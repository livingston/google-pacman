// ============================================================
// PacManAudioEngine — Web Audio API Sound Synthesizer
// ============================================================
// Replaces the original Flash SWF (pacman10-hp-sound.swf) with
// pure waveform synthesis based on the Namco WSG chip specs.
//
// Public API (drop-in replacement for the Flash sound player):
//   PacManAudioEngine.playTrack(name, channel)
//   PacManAudioEngine.stopChannel(channel)
//   PacManAudioEngine.playAmbientTrack(name)
//   PacManAudioEngine.stopAmbientTrack()
//   PacManAudioEngine.close()
// ============================================================

var PacManAudioEngine = (function () {
    var ctx = null;
    var channels = [null, null, null, null, null];
    var ambientNodes = null;
    var wsgWave = null; // cached PeriodicWave for Namco WSG wave 0

    function ensureCtx() {
        if (!ctx) {
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();
        }
        if (ctx.state === "suspended") ctx.resume();
        return ctx;
    }

    // Approximate the Namco WSG wave 0 (rounded/distorted sine from 82s126 PROM)
    // 4-bit samples produce a sine-like wave with odd-harmonic content
    function getWsgWave() {
        if (wsgWave) return wsgWave;
        var c = ensureCtx(); if (!c) return null;
        var real = new Float32Array(8);
        var imag = new Float32Array(8);
        real[0] = 0;
        imag[0] = 0;
        imag[1] = 1.0;    // fundamental
        imag[2] = 0.0;
        imag[3] = 0.18;   // 3rd harmonic — gives the slightly clipped character
        imag[4] = 0.0;
        imag[5] = 0.06;   // 5th harmonic
        imag[6] = 0.0;
        imag[7] = 0.02;   // 7th harmonic
        wsgWave = c.createPeriodicWave(real, imag, { disableNormalization: false });
        return wsgWave;
    }

    function stopNodes(nodes) {
        if (!nodes) return;
        for (var i = 0; i < nodes.length; i++) {
            try { nodes[i].stop(); } catch (e) {}
            try { nodes[i].disconnect(); } catch (e) {}
        }
    }

    // ---------- synthesis helpers ----------

    // Simple frequency sweep (linear ramp) with gain envelope
    function sweep(type, f1, f2, duration, gainVal, useWsg) {
        var c = ensureCtx(); if (!c) return [];
        var o = c.createOscillator();
        var g = c.createGain();
        if (useWsg && getWsgWave()) {
            o.setPeriodicWave(getWsgWave());
        } else {
            o.type = type;
        }
        o.frequency.value = f1;
        g.gain.value = gainVal || 0.3;
        o.connect(g); g.connect(c.destination);
        var t = c.currentTime;
        o.frequency.setValueAtTime(f1, t);
        o.frequency.linearRampToValueAtTime(f2, t + duration);
        g.gain.setValueAtTime(g.gain.value, t);
        g.gain.linearRampToValueAtTime(0.001, t + duration);
        o.start(t);
        o.stop(t + duration + 0.02);
        return [o, g];
    }

    // Play a sequence of [frequency, duration_in_seconds] pairs
    function melodySeq(type, notes, gainVal, useWsg) {
        var c = ensureCtx(); if (!c) return [];
        var all = [];
        var t = c.currentTime;
        var wave = useWsg ? getWsgWave() : null;
        for (var i = 0; i < notes.length; i++) {
            var freq = notes[i][0];
            var dur = notes[i][1];
            if (freq === 0) { t += dur; continue; } // rest
            var o = c.createOscillator();
            var g = c.createGain();
            if (wave) {
                o.setPeriodicWave(wave);
            } else {
                o.type = type;
            }
            o.frequency.value = freq;
            g.gain.value = gainVal || 0.2;
            o.connect(g); g.connect(c.destination);
            o.start(t);
            // slight decay at end of note for articulation
            g.gain.setValueAtTime(gainVal || 0.2, t);
            g.gain.setValueAtTime(gainVal || 0.2, t + dur * 0.85);
            g.gain.linearRampToValueAtTime(0.001, t + dur * 0.98);
            o.stop(t + dur);
            all.push(o, g);
            t += dur;
        }
        return all;
    }

    // ---------- track synthesizers ----------
    // Based on the Namco WSG chip: 3 voices, 32-step 4-bit wavetables,
    // frequency registers updated at 60 Hz (VBLANK), 96 kHz sample clock

    var tracks = {
        // Waka-waka: square wave, alternating up/down sweeps ~257-289 Hz
        // Original uses WSG wave 3 (pulse), ~67ms per chomp
        "eating-dot-1": function () {
            return sweep("square", 257, 289, 0.067, 0.18);
        },
        "eating-dot-2": function () {
            return sweep("square", 289, 257, 0.067, 0.18);
        },
        // Ms. Pac-Man dot sound — slightly higher pitch
        "eating-dot-double": function () {
            return sweep("square", 295, 330, 0.067, 0.16);
        },

        // Ghost eaten: WSG wave 0 (rounded sine), ascending sweep
        // 180 Hz -> 1800 Hz over ~400ms
        "eating-ghost": function () {
            var c = ensureCtx(); if (!c) return [];
            var o = c.createOscillator();
            var g = c.createGain();
            if (getWsgWave()) o.setPeriodicWave(getWsgWave());
            else o.type = "sine";
            o.frequency.value = 180;
            g.gain.value = 0.25;
            o.connect(g); g.connect(c.destination);
            var t = c.currentTime;
            o.frequency.setValueAtTime(180, t);
            o.frequency.exponentialRampToValueAtTime(1800, t + 0.4);
            g.gain.setValueAtTime(0.25, t);
            g.gain.linearRampToValueAtTime(0.18, t + 0.4);
            g.gain.linearRampToValueAtTime(0.001, t + 0.5);
            o.start(t);
            o.stop(t + 0.52);
            return [o, g];
        },

        // Fruit eaten: WSG wave 0, two-part ascending chirp
        // 500->1000 Hz in 125ms, then 800->1500 Hz in 125ms
        "fruit": function () {
            var c = ensureCtx(); if (!c) return [];
            var all = [];
            var t = c.currentTime;
            var wave = getWsgWave();
            // chirp 1
            var o1 = c.createOscillator();
            var g1 = c.createGain();
            if (wave) o1.setPeriodicWave(wave); else o1.type = "sine";
            o1.frequency.setValueAtTime(500, t);
            o1.frequency.exponentialRampToValueAtTime(1000, t + 0.125);
            g1.gain.value = 0.22;
            o1.connect(g1); g1.connect(c.destination);
            o1.start(t); o1.stop(t + 0.13);
            all.push(o1, g1);
            // chirp 2
            var o2 = c.createOscillator();
            var g2 = c.createGain();
            if (wave) o2.setPeriodicWave(wave); else o2.type = "sine";
            o2.frequency.setValueAtTime(800, t + 0.13);
            o2.frequency.exponentialRampToValueAtTime(1500, t + 0.255);
            g2.gain.value = 0.001;
            g2.gain.setValueAtTime(0.22, t + 0.13);
            o2.connect(g2); g2.connect(c.destination);
            o2.start(t + 0.13); o2.stop(t + 0.27);
            all.push(o2, g2);
            return all;
        },

        // Death: WSG wave 1 (clipped sine), descending spiral ~800->50 Hz
        // over ~1.6s with vibrato that widens
        "death": function () {
            var c = ensureCtx(); if (!c) return [];
            var o = c.createOscillator();
            var g = c.createGain();
            var vib = c.createOscillator();
            var vibGain = c.createGain();
            if (getWsgWave()) o.setPeriodicWave(getWsgWave());
            else o.type = "sine";
            var t = c.currentTime;
            // main descending pitch
            o.frequency.setValueAtTime(800, t);
            o.frequency.exponentialRampToValueAtTime(400, t + 0.5);
            o.frequency.exponentialRampToValueAtTime(150, t + 1.0);
            o.frequency.exponentialRampToValueAtTime(50, t + 1.6);
            // vibrato: starts narrow and slow, widens
            vib.type = "sine";
            vib.frequency.setValueAtTime(8, t);
            vib.frequency.linearRampToValueAtTime(6, t + 1.6);
            vibGain.gain.setValueAtTime(10, t);
            vibGain.gain.linearRampToValueAtTime(30, t + 1.6);
            vib.connect(vibGain);
            vibGain.connect(o.frequency);
            // volume: fade out
            g.gain.setValueAtTime(0.3, t);
            g.gain.linearRampToValueAtTime(0.001, t + 1.6);
            o.connect(g); g.connect(c.destination);
            o.start(t); vib.start(t);
            o.stop(t + 1.65); vib.stop(t + 1.65);
            return [o, g, vib, vibGain];
        },
        "death-double": function () {
            var c = ensureCtx(); if (!c) return [];
            var all = [];
            // two parallel death sounds, slightly detuned
            for (var d = 0; d < 2; d++) {
                var detune = d === 0 ? 0 : 15;
                var vol = d === 0 ? 0.25 : 0.18;
                var o = c.createOscillator();
                var g = c.createGain();
                var vib = c.createOscillator();
                var vibGain = c.createGain();
                if (getWsgWave()) o.setPeriodicWave(getWsgWave());
                else o.type = "sine";
                o.detune.value = detune;
                var t = c.currentTime;
                o.frequency.setValueAtTime(800, t);
                o.frequency.exponentialRampToValueAtTime(400, t + 0.5);
                o.frequency.exponentialRampToValueAtTime(150, t + 1.0);
                o.frequency.exponentialRampToValueAtTime(50, t + 1.6);
                vib.type = "sine";
                vib.frequency.setValueAtTime(8, t);
                vib.frequency.linearRampToValueAtTime(6, t + 1.6);
                vibGain.gain.setValueAtTime(10, t);
                vibGain.gain.linearRampToValueAtTime(30, t + 1.6);
                vib.connect(vibGain);
                vibGain.connect(o.frequency);
                g.gain.setValueAtTime(vol, t);
                g.gain.linearRampToValueAtTime(0.001, t + 1.6);
                o.connect(g); g.connect(c.destination);
                o.start(t); vib.start(t);
                o.stop(t + 1.65); vib.stop(t + 1.65);
                all.push(o, g, vib, vibGain);
            }
            return all;
        },

        // Extra life: original arcade has no 1-UP sound, but the game
        // code calls this, so use a brief authentic-style ascending chirp
        "extra-life": function () {
            var c = ensureCtx(); if (!c) return [];
            var o = c.createOscillator();
            var g = c.createGain();
            if (getWsgWave()) o.setPeriodicWave(getWsgWave());
            else o.type = "sine";
            var t = c.currentTime;
            o.frequency.setValueAtTime(600, t);
            o.frequency.exponentialRampToValueAtTime(1800, t + 0.15);
            g.gain.setValueAtTime(0.2, t);
            g.gain.setValueAtTime(0.2, t + 0.12);
            g.gain.linearRampToValueAtTime(0.001, t + 0.2);
            o.connect(g); g.connect(c.destination);
            o.start(t); o.stop(t + 0.22);
            return [o, g];
        },

        // Intro jingle: B major melody on WSG wave 0
        // Transcribed from Pac-Man ROM song data
        // ~140 BPM: 16th≈107ms, 8th≈214ms, 32nd≈54ms, dotted-16th≈160ms
        "start-music": function () {
            var N = 0.107; // 16th note
            var E = 0.214; // 8th note
            var T = 0.054; // 32nd note
            var D = 0.160; // dotted 16th
            var melody = [
                // Phrase 1: B4 B5 F#5 D#5 | B5(32) F#5(dot16) D#5(8th)
                [494, N], [988, N], [740, N], [622, N],
                [988, T], [740, D], [622, E],
                // Phrase 2: C5 C6 G5 E5 | C6(32) G5(dot16) E5(8th)
                [523, N], [1047, N], [784, N], [659, N],
                [1047, T], [784, D], [659, E],
                // Phrase 3: B4 B5 F#5 D#5 | B5(32) F#5(dot16) D#5(8th)
                [494, N], [988, N], [740, N], [622, N],
                [988, T], [740, D], [622, E],
                // Phrase 4: chromatic run D#5 E5 F5 | F5 F#5 G5 | G5 G#5 A5(16) B5(8)
                [622, T], [659, T], [698, T],
                [698, T], [740, T], [784, T],
                [784, T], [831, T], [880, N], [988, E]
            ];
            return melodySeq("sine", melody, 0.22, true);
        },
        "start-music-double": function () {
            var N = 0.107;
            var E = 0.214;
            var T = 0.054;
            var D = 0.160;
            var melody = [
                [494, N], [988, N], [740, N], [622, N],
                [988, T], [740, D], [622, E],
                [523, N], [1047, N], [784, N], [659, N],
                [1047, T], [784, D], [659, E],
                [494, N], [988, N], [740, N], [622, N],
                [988, T], [740, D], [622, E],
                [622, T], [659, T], [698, T],
                [698, T], [740, T], [784, T],
                [784, T], [831, T], [880, N], [988, E]
            ];
            // second voice: same melody up a 5th (approximate harmony)
            var harmony = melody.map(function (n) {
                return [n[0] > 0 ? n[0] * 1.498 : 0, n[1]];
            });
            var a = melodySeq("sine", melody, 0.18, true);
            var b = melodySeq("sine", harmony, 0.10, true);
            return a.concat(b);
        }
    };

    // ---------- ambient synthesizers ----------
    // The original siren uses WSG wave 2 (triangle-like) with a continuous
    // frequency sweep. Speed tiers increase as dots are eaten.

    function makeSiren(rate, center, depth) {
        var c = ensureCtx(); if (!c) return null;
        var o = c.createOscillator();
        var lfo = c.createOscillator();
        var lfoGain = c.createGain();
        var masterGain = c.createGain();
        o.type = "triangle";
        o.frequency.value = center;
        lfo.type = "triangle";
        lfo.frequency.value = rate;
        lfoGain.gain.value = depth;
        masterGain.gain.value = 0.18;
        lfo.connect(lfoGain);
        lfoGain.connect(o.frequency);
        o.connect(masterGain);
        masterGain.connect(c.destination);
        o.start(); lfo.start();
        return [o, lfo, lfoGain, masterGain];
    }

    // Power pellet / fright: sawtooth-like ~120 Hz with FM wobble at 7.5 Hz
    function makeFright() {
        var c = ensureCtx(); if (!c) return null;
        var o = c.createOscillator();
        var lfo = c.createOscillator();
        var lfoGain = c.createGain();
        var masterGain = c.createGain();
        o.type = "sawtooth";
        o.frequency.value = 120;
        lfo.type = "sine";
        lfo.frequency.value = 7.5;
        lfoGain.gain.value = 20; // +/- 20 Hz FM depth
        masterGain.gain.value = 0.16;
        lfo.connect(lfoGain);
        lfoGain.connect(o.frequency);
        o.connect(masterGain);
        masterGain.connect(c.destination);
        o.start(); lfo.start();
        return [o, lfo, lfoGain, masterGain];
    }

    // Ghost eyes returning: square 550 Hz, pulsed on/off at ~16.67 Hz
    // (40ms on, 20ms off — matches original WSG wave 5 staccato pattern)
    function makeEyes() {
        var c = ensureCtx(); if (!c) return null;
        var o = c.createOscillator();
        var g = c.createGain();
        var lfo = c.createOscillator();
        var lfoGain = c.createGain();
        o.type = "square";
        o.frequency.value = 550;
        g.gain.value = 0;
        // square LFO at 16.67 Hz creates on/off gating
        lfo.type = "square";
        lfo.frequency.value = 16.67;
        lfoGain.gain.value = 0.12;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        o.connect(g);
        g.connect(c.destination);
        o.start(); lfo.start();
        return [o, g, lfo, lfoGain];
    }

    // Cutscene/intermission: playful square wave melody with vibrato
    function makeCutscene() {
        var c = ensureCtx(); if (!c) return null;
        var o = c.createOscillator();
        var lfo = c.createOscillator();
        var lfoGain = c.createGain();
        var masterGain = c.createGain();
        if (getWsgWave()) o.setPeriodicWave(getWsgWave());
        else o.type = "square";
        o.frequency.value = 440;
        lfo.type = "sine";
        lfo.frequency.value = 3.5;
        lfoGain.gain.value = 60;
        masterGain.gain.value = 0.14;
        lfo.connect(lfoGain);
        lfoGain.connect(o.frequency);
        o.connect(masterGain);
        masterGain.connect(c.destination);
        o.start(); lfo.start();
        return [o, lfo, lfoGain, masterGain];
    }

    var ambientTracks = {
        // Siren tiers: rate increases, center frequency rises, depth widens
        "ambient-1": function () { return makeSiren(0.8, 310, 60); },
        "ambient-2": function () { return makeSiren(1.0, 325, 65); },
        "ambient-3": function () { return makeSiren(1.3, 350, 70); },
        "ambient-4": function () { return makeSiren(1.7, 390, 80); },
        "ambient-fright": makeFright,
        "ambient-eyes": makeEyes,
        "cutscene": makeCutscene
    };

    // ---------- public API ----------

    return {
        playTrack: function (name, channel) {
            var c = ensureCtx(); if (!c) return;
            if (channel >= 0 && channel < channels.length) {
                stopNodes(channels[channel]);
            }
            var fn = tracks[name];
            if (fn) {
                var nodes = fn();
                if (channel >= 0 && channel < channels.length) {
                    channels[channel] = nodes;
                }
            }
        },
        stopChannel: function (channel) {
            if (channel >= 0 && channel < channels.length) {
                stopNodes(channels[channel]);
                channels[channel] = null;
            }
        },
        playAmbientTrack: function (name) {
            stopNodes(ambientNodes);
            ambientNodes = null;
            var fn = ambientTracks[name];
            if (fn) {
                ambientNodes = fn();
            }
        },
        stopAmbientTrack: function () {
            stopNodes(ambientNodes);
            ambientNodes = null;
        },
        close: function () {
            for (var i = 0; i < channels.length; i++) {
                stopNodes(channels[i]);
                channels[i] = null;
            }
            stopNodes(ambientNodes);
            ambientNodes = null;
            if (ctx) { ctx.close(); ctx = null; }
            wsgWave = null;
        }
    };
})();
