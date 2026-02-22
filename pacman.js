google.pacman ||
function () {
    // ============================================================
    // Constants & Configuration
    // ============================================================
    var TRUE = true,
        FALSE = false,
        game = {},
        DIRECTIONS = [1, 4, 2, 8],
        DIRECTION_DELTAS = {
            0: {
                axis: 0,
                increment: 0
            },
            1: {
                axis: 0,
                increment: -1
            },
            2: {
                axis: 0,
                increment: +1
            },
            4: {
                axis: 1,
                increment: -1
            },
            8: {
                axis: 1,
                increment: +1
            }
        },
        ALTERNATE_PEN_LIMITS = [0, 7, 17, 32],
        PATH_SEGMENTS = [{
            x: 5,
            y: 1,
            w: 56
        },
        {
            x: 5,
            y: 4,
            w: 5
        },
        {
            x: 5,
            y: 1,
            h: 4
        },
        {
            x: 9,
            y: 1,
            h: 12
        },
        {
            x: 5,
            y: 12,
            h: 4
        },
        {
            x: 10,
            y: 12,
            h: 4
        },
        {
            x: 5,
            y: 15,
            w: 16
        },
        {
            x: 5,
            y: 12,
            w: 31
        },
        {
            x: 60,
            y: 1,
            h: 4
        },
        {
            x: 54,
            y: 1,
            h: 4
        },
        {
            x: 19,
            y: 1,
            h: 12
        },
        {
            x: 19,
            y: 4,
            w: 26
        },
        {
            x: 13,
            y: 5,
            w: 7
        },
        {
            x: 13,
            y: 5,
            h: 4
        },
        {
            x: 13,
            y: 8,
            w: 3
        },
        {
            x: 56,
            y: 4,
            h: 9
        },
        {
            x: 48,
            y: 4,
            w: 13
        },
        {
            x: 48,
            y: 1,
            h: 12
        },
        {
            x: 60,
            y: 12,
            h: 4
        },
        {
            x: 44,
            y: 15,
            w: 17
        },
        {
            x: 54,
            y: 12,
            h: 4
        },
        {
            x: 44,
            y: 12,
            w: 17
        },
        {
            x: 44,
            y: 1,
            h: 15
        },
        {
            x: 41,
            y: 13,
            w: 4
        },
        {
            x: 41,
            y: 13,
            h: 3
        },
        {
            x: 38,
            y: 13,
            h: 3
        },
        {
            x: 38,
            y: 15,
            w: 4
        },
        {
            x: 35,
            y: 10,
            w: 10
        },
        {
            x: 35,
            y: 1,
            h: 15
        },
        {
            x: 35,
            y: 13,
            w: 4
        },
        {
            x: 21,
            y: 12,
            h: 4
        },
        {
            x: 24,
            y: 12,
            h: 4
        },
        {
            x: 24,
            y: 15,
            w: 12
        },
        {
            x: 27,
            y: 4,
            h: 9
        },
        {
            x: 52,
            y: 9,
            w: 5
        },
        {
            x: 56,
            y: 8,
            w: 10,
            type: 1
        },
        {
            x: 1,
            y: 8,
            w: 9,
            type: 1
        }],
        DOT_FREE_ZONES = [{
            x: 1,
            y: 8,
            w: 8
        },
        {
            x: 57,
            y: 8,
            w: 9
        },
        {
            x: 44,
            y: 2,
            h: 10
        },
        {
            x: 35,
            y: 5,
            h: 7
        },
        {
            x: 36,
            y: 4,
            w: 8
        },
        {
            x: 36,
            y: 10,
            w: 8
        },
        {
            x: 39,
            y: 15,
            w: 2
        }],
        ENERGIZER_POSITIONS = [{
            x: 5,
            y: 15
        },
        {
            x: 5,
            y: 3
        },
        {
            x: 15,
            y: 8
        },
        {
            x: 60,
            y: 3
        },
        {
            x: 60,
            y: 15
        }],
        TUNNEL_POSITIONS = [{
            x: 2,
            y: 8
        },
        {
            x: 63,
            y: 8
        }],
        STARTING_POSITIONS = {
            1: [{
                x: 39.5,
                y: 15,
                dir: 4
            },
            {
                x: 39.5,
                y: 4,
                dir: 4,
                scatterX: 57,
                scatterY: -4
            },
            {
                x: 39.5,
                y: 7,
                dir: 2,
                scatterX: 0,
                scatterY: -4
            },
            {
                x: 37.625,
                y: 7,
                dir: 1,
                scatterX: 57,
                scatterY: 20
            },
            {
                x: 41.375,
                y: 7,
                dir: 1,
                scatterX: 0,
                scatterY: 20
            }],
            2: [{
                x: 40.25,
                y: 15,
                dir: 8
            },
            {
                x: 38.75,
                y: 15,
                dir: 4
            },
            {
                x: 39.5,
                y: 4,
                dir: 4,
                scatterX: 57,
                scatterY: -4
            },
            {
                x: 39.5,
                y: 7,
                dir: 2,
                scatterX: 0,
                scatterY: -4
            },
            {
                x: 37.625,
                y: 7,
                dir: 1,
                scatterX: 57,
                scatterY: 20
            },
            {
                x: 41.375,
                y: 7,
                dir: 1,
                scatterX: 0,
                scatterY: 20
            }]
        },
        PEN_ENTRANCE_POS = [32, 312],
        FRUIT_POS = [80, 312],
        TIMING_VALUES = {
            0: 0.16,
            1: 0.23,
            2: 1,
            3: 1,
            4: 2.23,
            5: 0.3,
            6: 1.9,
            7: 2.23,
            8: 1.9,
            9: 5,
            10: 1.9,
            11: 1.18,
            12: 0.3,
            13: 0.5,
            14: 1.9,
            15: 9,
            16: 10,
            17: 0.26
        },
        PEN_EXIT_SPEED = 0.8 * 0.4,
        // ============================================================
        // Level Data — per-level difficulty settings
        // ============================================================
        LEVEL_CONFIGS = [{},
        {
            ghostSpeed: 0.75,
            ghostTunnelSpeed: 0.4,
            playerSpeed: 0.8,
            dotEatingSpeed: 0.71,
            ghostFrightSpeed: 0.5,
            playerFrightSpeed: 0.9,
            dotEatingFrightSpeed: 0.79,
            elroyDotsLeftPart1: 20,
            elroySpeedPart1: 0.8,
            elroyDotsLeftPart2: 10,
            elroySpeedPart2: 0.85,
            frightTime: 6,
            frightBlinkCount: 5,
            fruit: 1,
            fruitScore: 100,
            ghostModeSwitchTimes: [7, 20, 7, 20, 5, 20, 5, 1],
            penForceTime: 4,
            penLeavingLimits: [0, 0, 30, 60]
        },
        {
            ghostSpeed: 0.85,
            ghostTunnelSpeed: 0.45,
            playerSpeed: 0.9,
            dotEatingSpeed: 0.79,
            ghostFrightSpeed: 0.55,
            playerFrightSpeed: 0.95,
            dotEatingFrightSpeed: 0.83,
            elroyDotsLeftPart1: 30,
            elroySpeedPart1: 0.9,
            elroyDotsLeftPart2: 15,
            elroySpeedPart2: 0.95,
            frightTime: 5,
            frightBlinkCount: 5,
            fruit: 2,
            fruitScore: 300,
            ghostModeSwitchTimes: [7, 20, 7, 20, 5, 1033, 1 / 60, 1],
            penForceTime: 4,
            penLeavingLimits: [0, 0, 0, 50],
            cutsceneId: 1
        },
        {
            ghostSpeed: 0.85,
            ghostTunnelSpeed: 0.45,
            playerSpeed: 0.9,
            dotEatingSpeed: 0.79,
            ghostFrightSpeed: 0.55,
            playerFrightSpeed: 0.95,
            dotEatingFrightSpeed: 0.83,
            elroyDotsLeftPart1: 40,
            elroySpeedPart1: 0.9,
            elroyDotsLeftPart2: 20,
            elroySpeedPart2: 0.95,
            frightTime: 4,
            frightBlinkCount: 5,
            fruit: 3,
            fruitScore: 500,
            ghostModeSwitchTimes: [7, 20, 7, 20, 5, 1033, 1 / 60, 1],
            penForceTime: 4,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.85,
            ghostTunnelSpeed: 0.45,
            playerSpeed: 0.9,
            dotEatingSpeed: 0.79,
            ghostFrightSpeed: 0.55,
            playerFrightSpeed: 0.95,
            dotEatingFrightSpeed: 0.83,
            elroyDotsLeftPart1: 40,
            elroySpeedPart1: 0.9,
            elroyDotsLeftPart2: 20,
            elroySpeedPart2: 0.95,
            frightTime: 3,
            frightBlinkCount: 5,
            fruit: 3,
            fruitScore: 500,
            ghostModeSwitchTimes: [7, 20, 7, 20, 5, 1033, 1 / 60, 1],
            penForceTime: 4,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 40,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 20,
            elroySpeedPart2: 1.05,
            frightTime: 2,
            frightBlinkCount: 5,
            fruit: 4,
            fruitScore: 700,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0],
            cutsceneId: 2
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 50,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 25,
            elroySpeedPart2: 1.05,
            frightTime: 5,
            frightBlinkCount: 5,
            fruit: 4,
            fruitScore: 700,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 50,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 25,
            elroySpeedPart2: 1.05,
            frightTime: 2,
            frightBlinkCount: 5,
            fruit: 5,
            fruitScore: 1E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 50,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 25,
            elroySpeedPart2: 1.05,
            frightTime: 2,
            frightBlinkCount: 5,
            fruit: 5,
            fruitScore: 1E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 60,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 30,
            elroySpeedPart2: 1.05,
            frightTime: 1,
            frightBlinkCount: 3,
            fruit: 6,
            fruitScore: 2E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0],
            cutsceneId: 3
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 60,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 30,
            elroySpeedPart2: 1.05,
            frightTime: 5,
            frightBlinkCount: 5,
            fruit: 6,
            fruitScore: 2E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 60,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 30,
            elroySpeedPart2: 1.05,
            frightTime: 2,
            frightBlinkCount: 5,
            fruit: 7,
            fruitScore: 3E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 80,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 40,
            elroySpeedPart2: 1.05,
            frightTime: 1,
            frightBlinkCount: 3,
            fruit: 7,
            fruitScore: 3E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 80,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 40,
            elroySpeedPart2: 1.05,
            frightTime: 1,
            frightBlinkCount: 3,
            fruit: 8,
            fruitScore: 5E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0],
            cutsceneId: 3
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 80,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 40,
            elroySpeedPart2: 1.05,
            frightTime: 3,
            frightBlinkCount: 5,
            fruit: 8,
            fruitScore: 5E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 100,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 50,
            elroySpeedPart2: 1.05,
            frightTime: 1,
            frightBlinkCount: 3,
            fruit: 8,
            fruitScore: 5E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 100,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 50,
            elroySpeedPart2: 1.05,
            frightTime: 1,
            frightBlinkCount: 3,
            fruit: 8,
            fruitScore: 5E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 100,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 50,
            elroySpeedPart2: 1.05,
            frightTime: 0,
            frightBlinkCount: 0,
            fruit: 8,
            fruitScore: 5E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0],
            cutsceneId: 3
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 100,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 50,
            elroySpeedPart2: 1.05,
            frightTime: 1,
            frightBlinkCount: 3,
            fruit: 8,
            fruitScore: 5E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 120,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 60,
            elroySpeedPart2: 1.05,
            frightTime: 0,
            frightBlinkCount: 0,
            fruit: 8,
            fruitScore: 5E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 1,
            dotEatingSpeed: 0.87,
            ghostFrightSpeed: 0.6,
            playerFrightSpeed: 1,
            dotEatingFrightSpeed: 0.87,
            elroyDotsLeftPart1: 120,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 60,
            elroySpeedPart2: 1.05,
            frightTime: 0,
            frightBlinkCount: 0,
            fruit: 8,
            fruitScore: 5E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        },
        {
            ghostSpeed: 0.95,
            ghostTunnelSpeed: 0.5,
            playerSpeed: 0.9,
            dotEatingSpeed: 0.79,
            ghostFrightSpeed: 0.75,
            playerFrightSpeed: 0.9,
            dotEatingFrightSpeed: 0.79,
            elroyDotsLeftPart1: 120,
            elroySpeedPart1: 1,
            elroyDotsLeftPart2: 60,
            elroySpeedPart2: 1.05,
            frightTime: 0,
            frightBlinkCount: 0,
            fruit: 8,
            fruitScore: 5E3,
            ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
            penForceTime: 3,
            penLeavingLimits: [0, 0, 0, 0]
        }],
        // ============================================================
        // Ghost Routines — predefined pen/exit movement paths
        // ============================================================
        GHOST_ROUTINES = {
            1: [{
                x: 37.6,
                y: 7,
                dir: 1,
                dest: 6.375,
                speed: 0.48
            },
            {
                x: 37.6,
                y: 6.375,
                dir: 2,
                dest: 7.625,
                speed: 0.48
            },
            {
                x: 37.6,
                y: 7.625,
                dir: 1,
                dest: 7,
                speed: 0.48
            }],
            2: [{
                x: 39.5,
                y: 7,
                dir: 2,
                dest: 7.625,
                speed: 0.48
            },
            {
                x: 39.5,
                y: 7.625,
                dir: 1,
                dest: 6.375,
                speed: 0.48
            },
            {
                x: 39.5,
                y: 6.375,
                dir: 2,
                dest: 7,
                speed: 0.48
            }],
            3: [{
                x: 41.4,
                y: 7,
                dir: 1,
                dest: 6.375,
                speed: 0.48
            },
            {
                x: 41.4,
                y: 6.375,
                dir: 2,
                dest: 7.625,
                speed: 0.48
            },
            {
                x: 41.4,
                y: 7.625,
                dir: 1,
                dest: 7,
                speed: 0.48
            }],
            4: [{
                x: 37.6,
                y: 7,
                dir: 8,
                dest: 39.5,
                speed: PEN_EXIT_SPEED
            },
            {
                x: 39.5,
                y: 7,
                dir: 1,
                dest: 4,
                speed: PEN_EXIT_SPEED
            }],
            5: [{
                x: 39.5,
                y: 7,
                dir: 1,
                dest: 4,
                speed: PEN_EXIT_SPEED
            }],
            6: [{
                x: 41.4,
                y: 7,
                dir: 4,
                dest: 39.5,
                speed: PEN_EXIT_SPEED
            },
            {
                x: 39.5,
                y: 7,
                dir: 1,
                dest: 4,
                speed: PEN_EXIT_SPEED
            }],
            7: [{
                x: 39.5,
                y: 4,
                dir: 2,
                dest: 7,
                speed: 1.6
            },
            {
                x: 39.5,
                y: 7,
                dir: 4,
                dest: 37.625,
                speed: 1.6
            }],
            8: [{
                x: 39.5,
                y: 4,
                dir: 2,
                dest: 7,
                speed: 1.6
            }],
            9: [{
                x: 39.5,
                y: 4,
                dir: 2,
                dest: 7,
                speed: 1.6
            },
            {
                x: 39.5,
                y: 7,
                dir: 8,
                dest: 41.375,
                speed: 1.6
            }],
            10: [{
                x: 37.6,
                y: 7,
                dir: 8,
                dest: 39.5,
                speed: PEN_EXIT_SPEED
            },
            {
                x: 39.5,
                y: 7,
                dir: 1,
                dest: 4,
                speed: PEN_EXIT_SPEED
            }],
            11: [{
                x: 39.5,
                y: 7,
                dir: 1,
                dest: 4,
                speed: PEN_EXIT_SPEED
            }],
            12: [{
                x: 41.4,
                y: 7,
                dir: 4,
                dest: 39.5,
                speed: PEN_EXIT_SPEED
            },
            {
                x: 39.5,
                y: 7,
                dir: 1,
                dest: 4,
                speed: PEN_EXIT_SPEED
            }]
        },
        // ============================================================
        // Cutscene Data — inter-level cutscene definitions
        // ============================================================
        CUTSCENE_DATA = {
            1: {
                actors: [{
                    ghost: FALSE,
                    x: 64,
                    y: 9,
                    id: 0
                },
                {
                    ghost: TRUE,
                    x: 68.2,
                    y: 9,
                    id: 1
                }],
                sequence: [{
                    time: 5.5,
                    moves: [{
                        dir: 4,
                        speed: 0.75 * 0.8 * 2
                    },
                    {
                        dir: 4,
                        speed: 0.78 * 0.8 * 2
                    }]
                },
                {
                    time: 0.1,
                    moves: [{
                        dir: 4,
                        speed: 32
                    },
                    {
                        dir: 4,
                        speed: 0
                    }]
                },
                {
                    time: 9,
                    moves: [{
                        dir: 8,
                        speed: 0.75 * 0.8 * 2,
                        elId: "pcm-bpcm"
                    },
                    {
                        dir: 8,
                        speed: 0.8,
                        mode: 4
                    }]
                }]
            },
            2: {
                actors: [{
                    ghost: FALSE,
                    x: 64,
                    y: 9,
                    id: 0
                },
                {
                    ghost: TRUE,
                    x: 70.2,
                    y: 9,
                    id: 1
                },
                {
                    ghost: TRUE,
                    x: 32,
                    y: 9.5,
                    id: 2
                }],
                sequence: [{
                    time: 2.7,
                    moves: [{
                        dir: 4,
                        speed: 0.75 * 0.8 * 2
                    },
                    {
                        dir: 4,
                        speed: 0.78 * 0.8 * 2
                    },
                    {
                        dir: 0,
                        speed: 0,
                        elId: "pcm-stck"
                    }]
                },
                {
                    time: 1,
                    moves: [{
                        dir: 4,
                        speed: 0.75 * 0.8 * 2
                    },
                    {
                        dir: 4,
                        speed: 0.1 * 0.8
                    },
                    {
                        dir: 0,
                        speed: 0,
                        elId: "pcm-stck"
                    }]
                },
                {
                    time: 1.3,
                    moves: [{
                        dir: 4,
                        speed: 0.75 * 0.8 * 2
                    },
                    {
                        dir: 4,
                        speed: 0
                    },
                    {
                        dir: 0,
                        speed: 0,
                        elId: "pcm-stck"
                    }]
                },
                {
                    time: 1,
                    moves: [{
                        dir: 4,
                        speed: 0.75 * 0.8 * 2
                    },
                    {
                        dir: 4,
                        speed: 0,
                        elId: "pcm-ghfa"
                    },
                    {
                        dir: 0,
                        speed: 0,
                        elId: "pcm-stck"
                    }]
                },
                {
                    time: 2.5,
                    moves: [{
                        dir: 4,
                        speed: 0.75 * 0.8 * 2
                    },
                    {
                        dir: 4,
                        speed: 0,
                        elId: "pcm-ghfa"
                    },
                    {
                        dir: 0,
                        speed: 0,
                        elId: "pcm-stck"
                    }]
                }]
            },
            3: {
                actors: [{
                    ghost: FALSE,
                    x: 64,
                    y: 9,
                    id: 0
                },
                {
                    ghost: TRUE,
                    x: 70.2,
                    y: 9,
                    id: 2
                }],
                sequence: [{
                    time: 5.3,
                    moves: [{
                        dir: 4,
                        speed: 0.75 * 0.8 * 2
                    },
                    {
                        dir: 4,
                        speed: 0.78 * 0.8 * 2,
                        elId: "pcm-ghin"
                    }]
                },
                {
                    time: 5.3,
                    moves: [{
                        dir: 4,
                        speed: 0
                    },
                    {
                        dir: 8,
                        speed: 0.78 * 0.8 * 2,
                        elId: "pcm-gbug"
                    }]
                }]
            }
        },
        FPS_OPTIONS = [90, 45, 30],
        BASE_FPS = FPS_OPTIONS[0];

    // ============================================================
    // Actor Class — players and ghosts
    // ============================================================
    function Actor(b) {
        this.id = b
    }
    Actor.prototype.reset = function () {
        var b = STARTING_POSITIONS[game.playerCount][this.id];
        this.pos = [b.y * 8, b.x * 8];
        this.posDelta = [0, 0];
        this.tilePos = [b.y * 8, b.x * 8];
        this.targetPos = [b.scatterY * 8, b.scatterX * 8];
        this.scatterPos = [b.scatterY * 8, b.scatterX * 8];
        this.lastActiveDir = this.dir = b.dir;
        this.physicalSpeed = this.requestedDir = this.nextDir = 0;
        this.setSpeedType(0);
        this.reverseDirectionsNext = this.freeToLeavePen = this.modeChangedWhileInPen = this.eatenInThisFrightMode = FALSE;
        this.selectTargetPlayer()
    };
    Actor.prototype.createElement = function () {
        this.el = document.createElement("div");
        this.el.className = "pcm-ac";
        this.el.id = "actor" + this.id;
        game.prepareElement(this.el, 0, 0);
        game.playfieldEl.appendChild(this.el);
        this.elPos = [0, 0];
        this.elBackgroundPos = [0, 0]
    };
    Actor.prototype.setMode = function (b) {
        var c = this.mode;
        this.mode = b;
        if (this.id == game.playerCount + 3 && (b == 16 || c == 16)) game.updateCruiseElroySpeed();
        switch (c) {
        case 32:
            game.ghostExitingPenNow = FALSE;
            break;
        case 8:
            game.ghostEyesCount > 0 && game.ghostEyesCount--;
            game.ghostEyesCount == 0 && game.playAmbientSound();
            break
        }
        switch (b) {
        case 4:
            this.fullSpeed = game.levels.ghostFrightSpeed * 0.8;
            this.tunnelSpeed = game.levels.ghostTunnelSpeed * 0.8;
            this.followingRoutine = FALSE;
            break;
        case 1:
            this.fullSpeed = game.levels.ghostSpeed * 0.8;
            this.tunnelSpeed = game.levels.ghostTunnelSpeed * 0.8;
            this.followingRoutine =
            FALSE;
            break;
        case 2:
            this.targetPos = this.scatterPos;
            this.fullSpeed = game.levels.ghostSpeed * 0.8;
            this.tunnelSpeed = game.levels.ghostTunnelSpeed * 0.8;
            this.followingRoutine = FALSE;
            break;
        case 8:
            this.tunnelSpeed = this.fullSpeed = 1.6;
            this.targetPos = [PEN_ENTRANCE_POS[0], PEN_ENTRANCE_POS[1]];
            this.freeToLeavePen = this.followingRoutine = FALSE;
            break;
        case 16:
            this.selectTargetPlayer();
            this.followingRoutine = TRUE;
            this.routineMoveId = -1;
            switch (this.id) {
            case game.playerCount + 1:
                this.routineToFollow = 2;
                break;
            case game.playerCount + 2:
                this.routineToFollow = 1;
                break;
            case game.playerCount + 3:
                this.routineToFollow =
                3;
                break
            }
            break;
        case 32:
            this.followingRoutine = TRUE;
            this.routineMoveId = -1;
            switch (this.id) {
            case game.playerCount + 1:
                this.routineToFollow = 5;
                break;
            case game.playerCount + 2:
                this.routineToFollow = 4;
                break;
            case game.playerCount + 3:
                this.routineToFollow = 6;
                break
            }
            game.ghostExitingPenNow = TRUE;
            break;
        case 64:
            this.followingRoutine = TRUE;
            this.routineMoveId = -1;
            switch (this.id) {
            case game.playerCount:
            case game.playerCount + 1:
                this.routineToFollow = 8;
                break;
            case game.playerCount + 2:
                this.routineToFollow = 7;
                break;
            case game.playerCount + 3:
                this.routineToFollow = 9;
                break
            }
            break;
        case 128:
            this.followingRoutine = TRUE;
            this.routineMoveId = -1;
            switch (this.id) {
            case game.playerCount:
            case game.playerCount + 1:
                this.routineToFollow = 11;
                break;
            case game.playerCount + 2:
                this.routineToFollow = 10;
                break;
            case game.playerCount + 3:
                this.routineToFollow = 12;
                break
            }
            break
        }
        this.updateSpeed()
    };
    Actor.prototype.selectTargetPlayer = function () {
        if (this.id >= game.playerCount) this.targetPlayerId = Math.floor(game.rand() * game.playerCount)
    };
    Actor.prototype.handleDirectionRequest = function (b) {
        if (!game.userDisabledSound) {
            google.pacManSound = TRUE;
            game.updateSoundIcon()
        }
        if (this.dir == game.oppositeDirections[b]) {
            this.dir = b;
            this.posDelta = [0, 0];
            this.currentSpeed != 2 && this.setSpeedType(0);
            if (this.dir != 0) this.lastActiveDir = this.dir;
            this.nextDir = 0
        } else if (this.dir != b) if (this.dir == 0) {
            if (game.playfield[this.pos[0]][this.pos[1]].allowedDir & b) this.dir = b
        } else {
            var c = game.playfield[this.tilePos[0]][this.tilePos[1]];
            if (c && c.allowedDir & b) {
                c = DIRECTION_DELTAS[this.dir];
                var d = [this.pos[0], this.pos[1]];
                d[c.axis] -= c.increment;
                var f =
                0;
                if (d[0] == this.tilePos[0] && d[1] == this.tilePos[1]) f = 1;
                else {
                    d[c.axis] -= c.increment;
                    if (d[0] == this.tilePos[0] && d[1] == this.tilePos[1]) f = 2
                }
                if (f) {
                    this.dir = b;
                    this.pos[0] = this.tilePos[0];
                    this.pos[1] = this.tilePos[1];
                    c = DIRECTION_DELTAS[this.dir];
                    this.pos[c.axis] += c.increment * f;
                    return
                }
            }
            this.nextDir = b;
            this.posDelta = [0, 0]
        }
    };
    Actor.prototype.decideNextDirection = function (b) {
        var c = this.tilePos,
            d = DIRECTION_DELTAS[this.dir],
            f = [c[0], c[1]];
        f[d.axis] += d.increment * 8;
        var h = game.playfield[f[0]][f[1]];
        if (b && !h.intersection) h = game.playfield[c[0]][c[1]];
        if (h.intersection) switch (this.mode) {
        case 2:
        case 1:
        case 8:
            if ((this.dir & h.allowedDir) == 0 && h.allowedDir == game.oppositeDirections[this.dir]) this.nextDir = game.oppositeDirections[this.dir];
            else {
                b = 99999999999;
                c = 0;
                for (var j in DIRECTIONS) {
                    var k = DIRECTIONS[j];
                    if (h.allowedDir & k && this.dir != game.oppositeDirections[k]) {
                        d = DIRECTION_DELTAS[k];
                        var x = [f[0], f[1]];
                        x[d.axis] += d.increment;
                        d = game.getDistance(x, [this.targetPos[0], this.targetPos[1]]);
                        if (d < b) {
                            b = d;
                            c = k
                        }
                    }
                }
                if (c) this.nextDir = c
            }
            break;
        case 4:
            if ((this.dir & h.allowedDir) == 0 && h.allowedDir == game.oppositeDirections[this.dir]) this.nextDir = game.oppositeDirections[this.dir];
            else {
                do f = DIRECTIONS[Math.floor(game.rand() * 4)];
                while ((f & h.allowedDir) == 0 || f == game.oppositeDirections[this.dir]);
                this.nextDir = f
            }
            break
        }
    };
    Actor.prototype.handleTileChange = function (b) {
        game.tilesChanged = TRUE;
        if (this.reverseDirectionsNext) {
            this.dir = game.oppositeDirections[this.dir];
            this.nextDir = 0;
            this.reverseDirectionsNext = FALSE;
            this.decideNextDirection(TRUE)
        }
        if (!this.ghost && !game.playfield[b[0]][b[1]].path) {
            this.pos[0] = this.lastGoodTilePos[0];
            this.pos[1] = this.lastGoodTilePos[1];
            b[0] = this.lastGoodTilePos[0];
            b[1] = this.lastGoodTilePos[1];
            this.dir = 0
        } else this.lastGoodTilePos = [b[0], b[1]];
        game.playfield[b[0]][b[1]].type == 1 && this.mode != 8 ? this.setSpeedType(2) : this.setSpeedType(0);
        !this.ghost && game.playfield[b[0]][b[1]].dot && game.dotEaten(this.id, b);
        this.tilePos[0] = b[0];
        this.tilePos[1] = b[1]
    };
    Actor.prototype.applyCornerCutting = function () {
        var b = this.tilePos;
        switch (this.dir) {
        case 1:
            var c = [b[0], b[1]],
                d = [b[0] + 3.6, b[1]];
            break;
        case 2:
            c = [b[0] - 4, b[1]];
            d = [b[0], b[1]];
            break;
        case 4:
            c = [b[0], b[1]];
            d = [b[0], b[1] + 3.6];
            break;
        case 8:
            c = [b[0], b[1] - 4];
            d = [b[0], b[1]];
            break
        }
        if (this.pos[0] >= c[0] && this.pos[0] <= d[0] && this.pos[1] >= c[1] && this.pos[1] <= d[1]) {
            b = DIRECTION_DELTAS[this.nextDir];
            this.posDelta[b.axis] += b.increment
        }
    };
    Actor.prototype.handleTunnelAndSpecialTiles = function () {
        if (this.pos[0] == TUNNEL_POSITIONS[0].y * 8 && this.pos[1] == TUNNEL_POSITIONS[0].x * 8) {
            this.pos[0] = TUNNEL_POSITIONS[1].y * 8;
            this.pos[1] = (TUNNEL_POSITIONS[1].x - 1) * 8
        } else if (this.pos[0] == TUNNEL_POSITIONS[1].y * 8 && this.pos[1] == TUNNEL_POSITIONS[1].x * 8) {
            this.pos[0] = TUNNEL_POSITIONS[0].y * 8;
            this.pos[1] = (TUNNEL_POSITIONS[0].x + 1) * 8
        }
        this.mode == 8 && this.pos[0] == PEN_ENTRANCE_POS[0] && this.pos[1] == PEN_ENTRANCE_POS[1] && this.setMode(64);
        if (!this.ghost && this.pos[0] == FRUIT_POS[0] && (this.pos[1] == FRUIT_POS[1] || this.pos[1] == FRUIT_POS[1] + 8)) game.eatFruit(this.id)
    };
    Actor.prototype.handleIntersection = function () {
        this.handleTunnelAndSpecialTiles();
        this.ghost && this.decideNextDirection(FALSE);
        var b = game.playfield[this.pos[0]][this.pos[1]];
        if (b.intersection) if (this.nextDir && this.nextDir & b.allowedDir) {
            if (this.dir != 0) this.lastActiveDir = this.dir;
            this.dir = this.nextDir;
            this.nextDir = 0;
            if (!this.ghost) {
                this.pos[0] += this.posDelta[0];
                this.pos[1] += this.posDelta[1];
                this.posDelta = [0, 0]
            }
        } else if ((this.dir & b.allowedDir) == 0) {
            if (this.dir != 0) this.lastActiveDir = this.dir;
            this.nextDir = this.dir = 0;
            this.setSpeedType(0)
        }
    };
    Actor.prototype.checkTilePosition = function () {
        var b = this.pos[0] / 8,
            c = this.pos[1] / 8,
            d = [Math.round(b) * 8, Math.round(c) * 8];
        if (d[0] != this.tilePos[0] || d[1] != this.tilePos[1]) this.handleTileChange(d);
        else {
            b = [Math.floor(b) * 8, Math.floor(c) * 8];
            this.pos[1] == b[1] && this.pos[0] == b[0] && this.handleIntersection()
        }!this.ghost && this.nextDir && game.playfield[d[0]][d[1]].intersection && this.nextDir & game.playfield[d[0]][d[1]].allowedDir && this.applyCornerCutting()
    };
    Actor.prototype.updateTargetPosition = function () {
        if (this.id == game.playerCount && game.dotsRemaining < game.levels.elroyDotsLeftPart1 && this.mode == 2 && (!game.lostLifeOnThisLevel || game.actors[game.playerCount + 3].mode != 16)) {
            var b = game.actors[this.targetPlayerId];
            this.targetPos = [b.tilePos[0], b.tilePos[1]]
        } else if (this.ghost && this.mode == 1) {
            b = game.actors[this.targetPlayerId];
            switch (this.id) {
            case game.playerCount:
                this.targetPos = [b.tilePos[0], b.tilePos[1]];
                break;
            case game.playerCount + 1:
                this.targetPos = [b.tilePos[0], b.tilePos[1]];
                var c = DIRECTION_DELTAS[b.dir];
                this.targetPos[c.axis] += 32 * c.increment;
                if (b.dir == 1) this.targetPos[1] -= 32;
                break;
            case game.playerCount + 2:
                var d = game.actors[game.playerCount],
                    f = [b.tilePos[0], b.tilePos[1]];
                c = DIRECTION_DELTAS[b.dir];
                f[c.axis] += 16 * c.increment;
                if (b.dir == 1) f[1] -= 16;
                this.targetPos[0] = f[0] * 2 - d.tilePos[0];
                this.targetPos[1] = f[1] * 2 - d.tilePos[1];
                break;
            case game.playerCount + 3:
                c = game.getDistance(b.tilePos, this.tilePos);
                this.targetPos = c > 64 ? [b.tilePos[0], b.tilePos[1]] : this.scatterPos;
                break
            }
        }
    };
    Actor.prototype.advanceToNextRoutineMove = function () {
        this.routineMoveId++;
        if (this.routineMoveId == GHOST_ROUTINES[this.routineToFollow].length) if (this.mode == 16 && this.freeToLeavePen && !game.ghostExitingPenNow) {
            this.eatenInThisFrightMode ? this.setMode(128) : this.setMode(32);
            return
        } else if (this.mode == 32 || this.mode == 128) {
            this.pos = [PEN_ENTRANCE_POS[0], PEN_ENTRANCE_POS[1] + 4];
            this.dir = this.modeChangedWhileInPen ? 8 : 4;
            var b = game.mainGhostMode;
            if (this.mode == 128 && b == 4) b = game.lastMainGhostMode;
            this.setMode(b);
            return
        } else if (this.mode == 64) {
            if (this.id == game.playerCount || this.freeToLeavePen) this.setMode(128);
            else {
                this.eatenInThisFrightMode =
                TRUE;
                this.setMode(16)
            }
            return
        } else this.routineMoveId = 0;
        b = GHOST_ROUTINES[this.routineToFollow][this.routineMoveId];
        this.pos[0] = b.y * 8;
        this.pos[1] = b.x * 8;
        this.dir = b.dir;
        this.physicalSpeed = 0;
        this.speedIntervals = game.getSpeedIntervals(b.speed);
        this.proceedToNextRoutineMove = FALSE;
        this.render()
    };
    Actor.prototype.executeRoutineMove = function () {
        var b = GHOST_ROUTINES[this.routineToFollow][this.routineMoveId];
        if (b) if (this.speedIntervals[game.intervalTime]) {
            var c = DIRECTION_DELTAS[this.dir];
            this.pos[c.axis] += c.increment;
            switch (this.dir) {
            case 1:
            case 4:
                if (this.pos[c.axis] < b.dest * 8) {
                    this.pos[c.axis] = b.dest * 8;
                    this.proceedToNextRoutineMove = TRUE
                }
                break;
            case 2:
            case 8:
                if (this.pos[c.axis] > b.dest * 8) {
                    this.pos[c.axis] = b.dest * 8;
                    this.proceedToNextRoutineMove = TRUE
                }
                break
            }
            this.render()
        }
    };
    Actor.prototype.followRoutine = function () {
        if (this.routineMoveId == -1 || this.proceedToNextRoutineMove) this.advanceToNextRoutineMove();
        this.executeRoutineMove()
    };
    Actor.prototype.updateSpeed = function () {
        switch (this.currentSpeed) {
        case 0:
            var b = this.id == game.playerCount && (this.mode == 2 || this.mode == 1) ? game.cruiseElroySpeed : this.fullSpeed;
            break;
        case 1:
            b = this.dotEatingSpeed;
            break;
        case 2:
            b = this.tunnelSpeed;
            break
        }
        if (this.physicalSpeed != b) {
            this.physicalSpeed = b;
            this.speedIntervals = game.getSpeedIntervals(this.physicalSpeed)
        }
    };
    Actor.prototype.setSpeedType = function (b) {
        this.currentSpeed = b;
        this.updateSpeed()
    };
    Actor.prototype.moveOneStep = function () {
        if (this.dir) if (this.speedIntervals[game.intervalTime]) {
            var b = DIRECTION_DELTAS[this.dir];
            this.pos[b.axis] += b.increment;
            this.checkTilePosition();
            this.render()
        }
    };
    Actor.prototype.move = function () {
        if (game.gameplayMode == 0 || this.ghost && game.gameplayMode == 1 && (this.mode == 8 || this.mode == 64)) {
            if (this.requestedDir != 0) {
                this.handleDirectionRequest(this.requestedDir);
                this.requestedDir = 0
            }
            if (this.followingRoutine) {
                this.followRoutine();
                this.mode == 64 && this.followRoutine()
            } else {
                this.moveOneStep();
                this.mode == 8 && this.moveOneStep()
            }
        }
    };
    Actor.prototype.updateElementPosition = function () {
        var b = game.getPlayfieldX(this.pos[1] + this.posDelta[1]),
            c = game.getPlayfieldY(this.pos[0] + this.posDelta[0]);
        if (this.elPos[0] != c || this.elPos[1] != b) {
            this.elPos[0] = c;
            this.elPos[1] = b;
            this.el.style.left = b + "px";
            this.el.style.top = c + "px"
        }
    };
    Actor.prototype.getPlayerSprite = function () {
        var b = 0,
            c = 0,
            d = this.dir;
        if (d == 0) d = this.lastActiveDir;
        if (game.gameplayMode == 1 && this.id == game.playerEatingGhostId) {
            b = 3;
            c = 0
        } else if ((game.gameplayMode == 9 || game.gameplayMode == 10) && this.id == 0) {
            b = 2;
            c = 0
        } else if (game.gameplayMode == 4 || game.gameplayMode == 5 || game.gameplayMode == 7) {
            b = this.id == 0 ? 2 : 4;
            c = 0
        } else if (game.gameplayMode == 3) if (this.id == game.playerDyingId) {
            d = 20 - Math.floor(game.gameplayModeTime / game.timing[4] * 21);
            if (this.id == 0) {
                b = d - 1;
                switch (b) {
                case -1:
                    b = 0;
                    break;
                case 11:
                    b = 10;
                    break;
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                    b =
                    11;
                    break
                }
                c = 12
            } else switch (d) {
            case 0:
            case 1:
            case 2:
            case 6:
            case 10:
                b = 4;
                c = 3;
                break;
            case 3:
            case 7:
            case 11:
                b = 4;
                c = 0;
                break;
            case 4:
            case 8:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
                b = 4;
                c = 2;
                break;
            case 5:
            case 9:
                b = 4;
                c = 1;
                break
            }
        } else {
            b = 3;
            c = 0
        } else if (this.el.id == "pcm-bpcm") {
            b = 14;
            c = 0;
            d = Math.floor(game.globalTime * 0.2) % 4;
            if (d == 3) d = 1;
            c += 2 * d
        } else {
            switch (d) {
            case 4:
                c = 0;
                break;
            case 8:
                c = 1;
                break;
            case 1:
                c = 2;
                break;
            case 2:
                c = 3;
                break
            }
            if (game.gameplayMode != 2) b = Math.floor(game.globalTime * 0.3) % 4;
            if (b == 3 && this.dir == 0) b = 0;
            if (b == 2 && this.id == 0) b = 0;
            if (b == 3) {
                b = 2;
                if (this.id == 0) c = 0
            }
            if (this.id == 1) b += 4
        }
        return [c, b]
    };
    Actor.prototype.getGhostSprite = function () {
        var b = 0,
            c = 0;
        if (game.gameplayMode == 10 || game.gameplayMode == 4 || game.gameplayMode == 3) {
            b = 3;
            c = 0
        } else if (game.gameplayMode == 1 && this.id == game.ghostBeingEatenId) {
            switch (game.modeScoreMultiplier) {
            case 2:
                b = 0;
                break;
            case 4:
                b = 1;
                break;
            case 8:
                b = 2;
                break;
            case 16:
                b = 3;
                break
            }
            c = 11;
            this.el.className = "pcm-ac pcm-n"
        } else if (this.mode == 4 || (this.mode == 16 || this.mode == 32) && game.mainGhostMode == 4 && !this.eatenInThisFrightMode) {
            b = 0;
            c = 8;
            if (game.frightModeTime < game.levels.frightTotalTime - game.levels.frightTime && Math.floor(game.frightModeTime / game.timing[1]) % 2 == 0) b += 2;
            b += Math.floor(game.globalTime / 16) % 2
        } else if (this.mode == 8 || this.mode == 64) {
            c = this.nextDir;
            if (!c) c = this.dir;
            switch (c) {
            case 4:
                b = 2;
                break;
            case 8:
                b = 3;
                break;
            case 1:
                b = 0;
                break;
            case 2:
                b = 1;
                break
            }
            c = 10
        } else if (this.el.id == "pcm-ghin") {
            b = 6;
            c = 8;
            b += Math.floor(game.globalTime / 16) % 2
        } else if (this.el.id == "pcm-gbug") {
            b = 6;
            c = 9;
            c += Math.floor(game.globalTime / 16) % 2
        } else if (this.el.id == "pcm-ghfa") {
            b = game.cutsceneSequenceId == 3 ? 6 : 7;
            c = 11
        } else if (this.el.id == "pcm-stck") {
            b = game.cutsceneSequenceId == 1 ? game.cutsceneTime > 60 ? 1 : game.cutsceneTime > 45 ? 2 : 3 : game.cutsceneSequenceId == 2 ? 3 : game.cutsceneSequenceId == 3 || game.cutsceneSequenceId == 4 ? 4 : 0;
            c = 13
        } else {
            c = this.nextDir;
            if (!c || game.playfield[this.tilePos[0]][this.tilePos[1]].type == 1) c = this.dir;
            switch (c) {
            case 4:
                b = 4;
                break;
            case 8:
                b = 6;
                break;
            case 1:
                b = 0;
                break;
            case 2:
                b = 2;
                break
            }
            c = 4 + this.id - game.playerCount;
            if (this.speed > 0 || game.gameplayMode != 13) b += Math.floor(game.globalTime / 16) % 2
        }
        return [c, b]
    };
    Actor.prototype.render = function () {
        this.updateElementPosition();
        var b = [0, 0];
        b = game.gameplayMode == 8 || game.gameplayMode == 14 ? [0, 3] : this.ghost ? this.getGhostSprite() : this.getPlayerSprite();
        if (this.elBackgroundPos[0] != b[0] || this.elBackgroundPos[1] != b[1]) {
            this.elBackgroundPos[0] = b[0];
            this.elBackgroundPos[1] = b[1];
            b[0] *= 16;
            b[1] *= 16;
            game.changeElementBkPos(this.el, b[1], b[0], TRUE)
        }
    };
    // ============================================================
    // Game State Management — RNG, utilities, distance
    // ============================================================
    game.rand = function () {
        var b = 4294967296,
            c = 134775813;
        c = c * game.randSeed + 1;
        return (game.randSeed = c % b) / b
    };
    game.seed = function (b) {
        game.randSeed = b
    };
    game.getDistance = function (b, c) {
        return Math.sqrt((c[1] - b[1]) * (c[1] - b[1]) + (c[0] - b[0]) * (c[0] - b[0]))
    };
    game.getPlayfieldX = function (b) {
        return b + -32
    };
    game.getPlayfieldY = function (b) {
        return b + 0
    };
    game.getCorrectedSpritePos = function (b) {
        return b / 8 * 10 + 2
    };
    game.getDotElementId = function (b, c) {
        return "pcm-d" + b + "-" + c
    };
    game.showElementById = function (b, c) {
        var d = document.getElementById(b);
        if (d) d.style.visibility = c ? "visible" : "hidden"
    };
    game.getAbsoluteElPos = function (b) {
        var c = [0, 0];
        do {
            c[0] += b.offsetTop;
            c[1] += b.offsetLeft
        } while (b = b.offsetParent);
        return c
    };
    game.prepareElement = function (b, c, d) {
        c = game.getCorrectedSpritePos(parseInt(c, 10));
        d = game.getCorrectedSpritePos(parseInt(d, 10));
        if (game.useCss) {
            b.style.backgroundImage = "url(pacman10-hp-sprite-2.png)";
            b.style.backgroundPosition = -c + "px " + -d + "px";
            b.style.backgroundRepeat = "no-repeat"
        } else {
            b.style.overflow = "hidden";
            c = "display: block; position: relative; left: " + -c + "px; top: " + -d + "px";
            b.innerHTML = '<img style="' + c + '" src="pacman10-hp-sprite.png">'
        }
    };
    game.changeElementBkPos = function (b, c, d, f) {
        if (f) {
            c = game.getCorrectedSpritePos(c);
            d = game.getCorrectedSpritePos(d)
        }
        if (game.useCss) b.style.backgroundPosition = -c + "px " + -d + "px";
        else if (b.childNodes[0]) {
            b.childNodes[0].style.left = -c + "px";
            b.childNodes[0].style.top = -d + "px"
        }
    };
    // ============================================================
    // Playfield Setup — board construction and dot placement
    // ============================================================
    game.determinePlayfieldDimensions = function () {
        game.playfieldWidth = 0;
        game.playfieldHeight = 0;
        for (var b in PATH_SEGMENTS) {
            var c = PATH_SEGMENTS[b];
            if (c.w) {
                c = c.x + c.w - 1;
                if (c > game.playfieldWidth) game.playfieldWidth = c
            } else {
                c = c.y + c.h - 1;
                if (c > game.playfieldHeight) game.playfieldHeight = c
            }
        }
    };
    game.preparePlayfield = function () {
        game.playfield = [];
        for (var b = 0; b <= game.playfieldHeight + 1; b++) {
            game.playfield[b * 8] = [];
            for (var c = -2; c <= game.playfieldWidth + 1; c++) game.playfield[b * 8][c * 8] = {
                path: 0,
                dot: 0,
                intersection: 0
            }
        }
    };
    game.preparePaths = function () {
        for (var b in PATH_SEGMENTS) {
            var c = PATH_SEGMENTS[b],
                d = c.type;
            if (c.w) {
                for (var f = c.y * 8, h = c.x * 8; h <= (c.x + c.w - 1) * 8; h += 8) {
                    game.playfield[f][h].path = TRUE;
                    if (game.playfield[f][h].dot == 0) {
                        game.playfield[f][h].dot = 1;
                        game.dotsRemaining++
                    }
                    game.playfield[f][h].type = !d || h != c.x * 8 && h != (c.x + c.w - 1) * 8 ? d : 0
                }
                game.playfield[f][c.x * 8].intersection = TRUE;
                game.playfield[f][(c.x + c.w - 1) * 8].intersection = TRUE
            } else {
                h = c.x * 8;
                for (f = c.y * 8; f <= (c.y + c.h - 1) * 8; f += 8) {
                    if (game.playfield[f][h].path) game.playfield[f][h].intersection = TRUE;
                    game.playfield[f][h].path = TRUE;
                    if (game.playfield[f][h].dot == 0) {
                        game.playfield[f][h].dot = 1;
                        game.dotsRemaining++
                    }
                    game.playfield[f][h].type = !d || f != c.y * 8 && f != (c.y + c.h - 1) * 8 ? d : 0
                }
                game.playfield[c.y * 8][h].intersection = TRUE;
                game.playfield[(c.y + c.h - 1) * 8][h].intersection = TRUE
            }
        }
        for (b in DOT_FREE_ZONES) if (DOT_FREE_ZONES[b].w) for (h = DOT_FREE_ZONES[b].x * 8; h <= (DOT_FREE_ZONES[b].x + DOT_FREE_ZONES[b].w - 1) * 8; h += 8) {
            game.playfield[DOT_FREE_ZONES[b].y * 8][h].dot = 0;
            game.dotsRemaining--
        } else for (f = DOT_FREE_ZONES[b].y * 8; f <= (DOT_FREE_ZONES[b].y + DOT_FREE_ZONES[b].h - 1) * 8; f += 8) {
            game.playfield[f][DOT_FREE_ZONES[b].x * 8].dot = 0;
            game.dotsRemaining--
        }
    };
    game.prepareAllowedDirections = function () {
        for (var b = 8; b <= game.playfieldHeight * 8; b += 8) for (var c = 8; c <= game.playfieldWidth * 8; c += 8) {
            game.playfield[b][c].allowedDir = 0;
            if (game.playfield[b - 8][c].path) game.playfield[b][c].allowedDir += 1;
            if (game.playfield[b + 8][c].path) game.playfield[b][c].allowedDir += 2;
            if (game.playfield[b][c - 8].path) game.playfield[b][c].allowedDir += 4;
            if (game.playfield[b][c + 8].path) game.playfield[b][c].allowedDir += 8
        }
    };
    game.createDotElements = function () {
        for (var b = 8; b <= game.playfieldHeight * 8; b += 8) for (var c = 8; c <= game.playfieldWidth * 8; c += 8) if (game.playfield[b][c].dot) {
            var d = document.createElement("div");
            d.className = "pcm-d";
            d.id = game.getDotElementId(b, c);
            d.style.left = c + -32 + "px";
            d.style.top = b + 0 + "px";
            game.playfieldEl.appendChild(d)
        }
    };
    game.createEnergizerElements = function () {
        for (var b in ENERGIZER_POSITIONS) {
            var c = ENERGIZER_POSITIONS[b],
                d = game.getDotElementId(c.y * 8, c.x * 8);
            document.getElementById(d).className = "pcm-e";
            game.prepareElement(document.getElementById(d), 0, 144);
            game.playfield[c.y * 8][c.x * 8].dot = 2
        }
    };
    game.createFruitElement = function () {
        game.fruitEl = document.createElement("div");
        game.fruitEl.id = "pcm-f";
        game.fruitEl.style.left = game.getPlayfieldX(FRUIT_POS[1]) + "px";
        game.fruitEl.style.top = game.getPlayfieldY(FRUIT_POS[0]) + "px";
        game.prepareElement(game.fruitEl, -32, -16);
        game.playfieldEl.appendChild(game.fruitEl)
    };
    game.createPlayfieldElements = function () {
        game.doorEl = document.createElement("div");
        game.doorEl.id = "pcm-do";
        game.doorEl.style.display = "none";
        game.playfieldEl.appendChild(game.doorEl);
        game.createDotElements();
        game.createEnergizerElements();
        game.createFruitElement()
    };
    game.createActors = function () {
        game.actors = [];
        for (var b = 0; b < game.playerCount + 4; b++) {
            game.actors[b] = new Actor(b);
            if (b < game.playerCount) {
                game.actors[b].ghost = FALSE;
                game.actors[b].mode = 1
            } else game.actors[b].ghost = TRUE
        }
    };
    game.restartActors = function () {
        for (var b in game.actors) game.actors[b].reset()
    };
    game.createActorElements = function () {
        for (var b in game.actors) game.actors[b].createElement()
    };
    game.createPlayfield = function () {
        game.playfieldEl = document.createElement("div");
        game.playfieldEl.id = "pcm-p";
        game.canvasEl.appendChild(game.playfieldEl)
    };
    game.resetPlayfield = function () {
        game.dotsRemaining = 0;
        game.dotsEaten = 0;
        game.playfieldEl.innerHTML = "";
        game.prepareElement(game.playfieldEl, 256, 0);
        game.determinePlayfieldDimensions();
        game.preparePlayfield();
        game.preparePaths();
        game.prepareAllowedDirections();
        game.createPlayfieldElements();
        game.createActorElements()
    };
    // ============================================================
    // Input Handling — keyboard, mouse, and touch controls
    // ============================================================
    game.keyPressed = function (b) {
        var c = FALSE;
        switch (b) {
        case 37:
            game.actors[0].requestedDir = 4;
            c = TRUE;
            break;
        case 38:
            game.actors[0].requestedDir = 1;
            c = TRUE;
            break;
        case 39:
            game.actors[0].requestedDir = 8;
            c = TRUE;
            break;
        case 40:
            game.actors[0].requestedDir = 2;
            c = TRUE;
            break;
        case 65:
            if (game.playerCount == 2) {
                game.actors[1].requestedDir = 4;
                c = TRUE
            }
            break;
        case 83:
            if (game.playerCount == 2) {
                game.actors[1].requestedDir = 2;
                c = TRUE
            }
            break;
        case 68:
            if (game.playerCount == 2) {
                game.actors[1].requestedDir = 8;
                c = TRUE
            }
            break;
        case 87:
            if (game.playerCount == 2) {
                game.actors[1].requestedDir = 1;
                c = TRUE
            }
            break
        }
        return c
    };
    game.handleKeyDown = function (b) {
        if (!b) b = window.event;
        if (game.keyPressed(b.keyCode)) if (b.preventDefault) b.preventDefault();
        else b.returnValue = FALSE
    };
    game.canvasClicked = function (b, c) {
        var d = game.getAbsoluteElPos(game.canvasEl);
        b -= d[1] - -32;
        c -= d[0] - 0;
        d = game.actors[0];
        var f = game.getPlayfieldX(d.pos[1] + d.posDelta[1]) + 16,
            h = game.getPlayfieldY(d.pos[0] + d.posDelta[0]) + 32,
            j = Math.abs(b - f),
            k = Math.abs(c - h);
        if (j > 8 && k < j) d.requestedDir = b > f ? 8 : 4;
        else if (k > 8 && j < k) d.requestedDir = c > h ? 2 : 1
    };
    game.handleClick = function (b) {
        if (!b) b = window.event;
        game.canvasClicked(b.clientX, b.clientY)
    };
    game.registerTouch = function () {
        document.body.addEventListener("touchstart", game.handleTouchStart, TRUE);
        game.canvasEl.addEventListener("touchstart", game.handleTouchStart, TRUE);
        document.f && document.f.q && document.f.q.addEventListener("touchstart", game.handleTouchStart, TRUE)
    };
    game.handleTouchStart = function (b) {
        game.touchDX = 0;
        game.touchDY = 0;
        if (b.touches.length == 1) {
            game.touchStartX = b.touches[0].pageX;
            game.touchStartY = b.touches[0].pageY;
            document.body.addEventListener("touchmove", game.handleTouchMove, TRUE);
            document.body.addEventListener("touchend", game.handleTouchEnd, TRUE)
        }
        b.preventDefault();
        b.stopPropagation()
    };
    game.handleTouchMove = function (b) {
        if (b.touches.length > 1) game.cancelTouch();
        else {
            game.touchDX = b.touches[0].pageX - game.touchStartX;
            game.touchDY = b.touches[0].pageY - game.touchStartY
        }
        b.preventDefault();
        b.stopPropagation()
    };
    game.handleTouchEnd = function (b) {
        if (game.touchDX == 0 && game.touchDY == 0) game.canvasClicked(game.touchStartX, game.touchStartY);
        else {
            var c = Math.abs(game.touchDX),
                d = Math.abs(game.touchDY);
            if (c < 8 && d < 8) game.canvasClicked(game.touchStartX, game.touchStartY);
            else if (c > 15 && d < c * 2 / 3) game.actors[0].requestedDir = game.touchDX > 0 ? 8 : 4;
            else if (d > 15 && c < d * 2 / 3) game.actors[0].requestedDir = game.touchDY > 0 ? 2 : 1
        }
        b.preventDefault();
        b.stopPropagation();
        game.cancelTouch()
    };
    game.cancelTouch = function () {
        document.body.removeEventListener("touchmove", game.handleTouchMove, TRUE);
        document.body.removeEventListener("touchend", game.handleTouchEnd, TRUE);
        game.touchStartX = null;
        game.touchStartY = null
    };
    game.addEventListeners = function () {
        if (window.addEventListener) {
            window.addEventListener("keydown", game.handleKeyDown, FALSE);
            game.canvasEl.addEventListener("click", game.handleClick, FALSE);
            game.registerTouch()
        } else {
            document.body.attachEvent("onkeydown", game.handleKeyDown);
            game.canvasEl.attachEvent("onclick", game.handleClick)
        }
    };
    // ============================================================
    // Game Logic — gameplay modes, levels, scoring
    // ============================================================
    game.startGameplay = function () {
        game.score = [0, 0];
        game.extraLifeAwarded = [FALSE, FALSE];
        game.lives = 3;
        game.level = 0;
        game.paused = FALSE;
        game.globalTime = 0;
        game.newLevel(TRUE)
    };
    game.restartGameplay = function (b) {
        game.seed(0);
        game.frightModeTime = 0;
        game.intervalTime = 0;
        game.gameplayModeTime = 0;
        game.fruitTime = 0;
        game.ghostModeSwitchPos = 0;
        game.ghostModeTime = game.levels.ghostModeSwitchTimes[0] * BASE_FPS;
        game.ghostExitingPenNow = FALSE;
        game.ghostEyesCount = 0;
        game.tilesChanged = FALSE;
        game.updateCruiseElroySpeed();
        game.hideFruit();
        game.resetForcePenLeaveTime();
        game.restartActors();
        game.updateActorPositions();
        game.switchMainGhostMode(2, TRUE);
        for (var c = game.playerCount + 1; c < game.playerCount + 4; c++) game.actors[c].setMode(16);
        game.dotEatingChannel = [0, 0];
        game.dotEatingSoundPart = [1, 1];
        game.clearDotEatingNow();
        b ? game.changeGameplayMode(4) : game.changeGameplayMode(6)
    };
    game.initiateDoubleMode = function () {
        if (game.playerCount != 2) {
            game.stopAllAudio();
            game.changeGameplayMode(12)
        }
    };
    game.newGame = function () {
        game.playerCount = 1;
        game.createChrome();
        game.createPlayfield();
        game.createActors();
        game.startGameplay()
    };
    game.switchToDoubleMode = function () {
        game.playerCount = 2;
        game.createChrome();
        game.createPlayfield();
        game.createActors();
        game.startGameplay()
    };
    game.insertCoin = function () {
        game.gameplayMode == 8 || game.gameplayMode == 14 ? game.newGame() : game.initiateDoubleMode()
    };
    game.createKillScreenElement = function (b, c, d, f, h) {
        var j = document.createElement("div");
        j.style.left = b + "px";
        j.style.top = c + "px";
        j.style.width = d + "px";
        j.style.height = f + "px";
        j.style.zIndex = 119;
        if (h) {
            j.style.background = "url(pacman10-hp-sprite.png) -" + game.killScreenTileX + "px -" + game.killScreenTileY + "px no-repeat";
            game.killScreenTileY += 8
        } else j.style.background = "black";
        game.playfieldEl.appendChild(j)
    };
    game.killScreen = function () {
        game.seed(0);
        game.canvasEl.style.visibility = "";
        game.createKillScreenElement(272, 0, 200, 80, FALSE);
        game.createKillScreenElement(280, 80, 192, 56, FALSE);
        game.killScreenTileX = 80;
        game.killScreenTileY = 0;
        for (var b = 280; b <= 472; b += 8) for (var c = 0; c <= 136; c += 8) {
            if (game.rand() < 0.03) {
                game.killScreenTileX = Math.floor(game.rand() * 25) * 10;
                game.killScreenTileY = Math.floor(game.rand() * 2) * 10
            }
            game.createKillScreenElement(b, c, 8, 8, TRUE)
        }
        game.changeGameplayMode(14)
    };
    game.newLevel = function (b) {
        game.level++;
        game.levels = game.level >= LEVEL_CONFIGS.length ? LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1] : LEVEL_CONFIGS[game.level];
        game.levels.frightTime = Math.round(game.levels.frightTime * BASE_FPS);
        game.levels.frightTotalTime = game.levels.frightTime + game.timing[1] * (game.levels.frightBlinkCount * 2 - 1);
        for (var c in game.actors) game.actors[c].dotCount = 0;
        game.alternatePenLeavingScheme = FALSE;
        game.lostLifeOnThisLevel = FALSE;
        game.updateChrome();
        game.resetPlayfield();
        game.restartGameplay(b);
        game.level == 256 && game.killScreen()
    };
    game.newLife = function () {
        game.lostLifeOnThisLevel = TRUE;
        game.alternatePenLeavingScheme = TRUE;
        game.alternateDotCount = 0;
        game.lives--;
        game.updateChromeLives();
        game.lives == -1 ? game.changeGameplayMode(8) : game.restartGameplay(FALSE)
    };
    game.switchMainGhostMode = function (b, c) {
        if (b == 4 && game.levels.frightTime == 0) for (var d in game.actors) {
            var f = game.actors[d];
            if (f.ghost) f.reverseDirectionsNext = TRUE
        } else {
            f = game.mainGhostMode;
            if (b == 4 && game.mainGhostMode != 4) game.lastMainGhostMode = game.mainGhostMode;
            game.mainGhostMode = b;
            if (b == 4 || f == 4) game.playAmbientSound();
            switch (b) {
            case 1:
            case 2:
                game.currentPlayerSpeed = game.levels.playerSpeed * 0.8;
                game.currentDotEatingSpeed = game.levels.dotEatingSpeed * 0.8;
                break;
            case 4:
                game.currentPlayerSpeed = game.levels.playerFrightSpeed * 0.8;
                game.currentDotEatingSpeed = game.levels.dotEatingFrightSpeed * 0.8;
                game.frightModeTime = game.levels.frightTotalTime;
                game.modeScoreMultiplier = 1;
                break
            }
            for (d in game.actors) {
                f = game.actors[d];
                if (f.ghost) {
                    if (b != 64 && !c) f.modeChangedWhileInPen = TRUE;
                    if (b == 4) f.eatenInThisFrightMode = FALSE;
                    if (f.mode != 8 && f.mode != 16 && f.mode != 32 && f.mode != 128 && f.mode != 64 || c) {
                        if (!c && f.mode != 4 && f.mode != b) f.reverseDirectionsNext = TRUE;
                        f.setMode(b)
                    }
                } else {
                    f.fullSpeed = game.currentPlayerSpeed;
                    f.dotEatingSpeed = game.currentDotEatingSpeed;
                    f.tunnelSpeed = game.currentPlayerSpeed;
                    f.updateSpeed()
                }
            }
        }
    };
    game.figureOutPenLeaving = function () {
        if (game.alternatePenLeavingScheme) {
            game.alternateDotCount++;
            switch (game.alternateDotCount) {
            case ALTERNATE_PEN_LIMITS[1]:
                game.actors[game.playerCount + 1].freeToLeavePen = TRUE;
                break;
            case ALTERNATE_PEN_LIMITS[2]:
                game.actors[game.playerCount + 2].freeToLeavePen = TRUE;
                break;
            case ALTERNATE_PEN_LIMITS[3]:
                if (game.actors[game.playerCount + 3].mode == 16) game.alternatePenLeavingScheme = FALSE;
                break
            }
        } else if (game.actors[game.playerCount + 1].mode == 16 || game.actors[game.playerCount + 1].mode == 8) {
            game.actors[game.playerCount + 1].dotCount++;
            if (game.actors[game.playerCount + 1].dotCount >= game.levels.penLeavingLimits[1]) game.actors[game.playerCount + 1].freeToLeavePen = TRUE
        } else if (game.actors[game.playerCount + 2].mode == 16 || game.actors[game.playerCount + 2].mode == 8) {
            game.actors[game.playerCount + 2].dotCount++;
            if (game.actors[game.playerCount + 2].dotCount >= game.levels.penLeavingLimits[2]) game.actors[game.playerCount + 2].freeToLeavePen = TRUE
        } else if (game.actors[game.playerCount + 3].mode == 16 || game.actors[game.playerCount + 3].mode == 8) {
            game.actors[game.playerCount + 3].dotCount++;
            if (game.actors[game.playerCount + 3].dotCount >= game.levels.penLeavingLimits[3]) game.actors[game.playerCount + 3].freeToLeavePen = TRUE
        }
    };
    game.resetForcePenLeaveTime = function () {
        game.forcePenLeaveTime = game.levels.penForceTime * BASE_FPS
    };
    game.dotEaten = function (b, c) {
        game.dotsRemaining--;
        game.dotsEaten++;
        game.actors[b].setSpeedType(1);
        game.playDotEatingSound(b);
        if (game.playfield[c[0]][c[1]].dot == 2) {
            game.switchMainGhostMode(4, FALSE);
            game.addToScore(50, b)
        } else game.addToScore(10, b);
        var d = document.getElementById(game.getDotElementId(c[0], c[1]));
        d.style.display = "none";
        game.playfield[c[0]][c[1]].dot = 0;
        game.updateCruiseElroySpeed();
        game.resetForcePenLeaveTime();
        game.figureOutPenLeaving();
        if (game.dotsEaten == 70 || game.dotsEaten == 170) game.showFruit();
        game.dotsRemaining == 0 && game.finishLevel();
        game.playAmbientSound()
    };
    game.getFruitSprite = function (b) {
        var c = b <= 4 ? 128 : 160;
        b = 128 + 16 * ((b - 1) % 4);
        return [c, b]
    };
    game.getFruitScoreSprite = function (b) {
        var c = 128;
        b = 16 * (b - 1);
        return [c, b]
    };
    game.hideFruit = function () {
        game.fruitShown = FALSE;
        game.changeElementBkPos(game.fruitEl, 32, 16, TRUE)
    };
    game.showFruit = function () {
        game.fruitShown = TRUE;
        var b = game.getFruitSprite(game.levels.fruit);
        game.changeElementBkPos(game.fruitEl, b[0], b[1], TRUE);
        game.fruitTime = game.timing[15] + (game.timing[16] - game.timing[15]) * game.rand()
    };
    game.eatFruit = function (b) {
        if (game.fruitShown) {
            game.playSound("fruit", 0);
            game.fruitShown = FALSE;
            var c = game.getFruitScoreSprite(game.levels.fruit);
            game.changeElementBkPos(game.fruitEl, c[0], c[1], TRUE);
            game.fruitTime = game.timing[14];
            game.addToScore(game.levels.fruitScore, b)
        }
    };
    game.updateActorTargetPositions = function () {
        for (var b = game.playerCount; b < game.playerCount + 4; b++) game.actors[b].updateTargetPosition()
    };
    game.moveActors = function () {
        for (var b in game.actors) game.actors[b].move()
    };
    game.ghostDies = function (b, c) {
        game.playSound("eating-ghost", 0);
        game.addToScore(200 * game.modeScoreMultiplier, c);
        game.modeScoreMultiplier *= 2;
        game.ghostBeingEatenId = b;
        game.playerEatingGhostId = c;
        game.changeGameplayMode(1)
    };
    game.playerDies = function (b) {
        game.playerDyingId = b;
        game.changeGameplayMode(2)
    };
    // ============================================================
    // Collision Detection
    // ============================================================
    game.detectCollisions = function () {
        game.tilesChanged = FALSE;
        for (var b = game.playerCount; b < game.playerCount + 4; b++) for (var c = 0; c < game.playerCount; c++) if (game.actors[b].tilePos[0] == game.actors[c].tilePos[0] && game.actors[b].tilePos[1] == game.actors[c].tilePos[1]) if (game.actors[b].mode == 4) {
            game.ghostDies(b, c);
            return
        } else game.actors[b].mode != 8 && game.actors[b].mode != 16 && game.actors[b].mode != 32 && game.actors[b].mode != 128 && game.actors[b].mode != 64 && game.playerDies(c)
    };
    game.updateCruiseElroySpeed = function () {
        var b = game.levels.ghostSpeed * 0.8;
        if (!game.lostLifeOnThisLevel || game.actors[game.playerCount + 3].mode != 16) {
            var c = game.levels;
            if (game.dotsRemaining < c.elroyDotsLeftPart2) b = c.elroySpeedPart2 * 0.8;
            else if (game.dotsRemaining < c.elroyDotsLeftPart1) b = c.elroySpeedPart1 * 0.8
        }
        if (b != game.cruiseElroySpeed) {
            game.cruiseElroySpeed = b;
            game.actors[game.playerCount].updateSpeed()
        }
    };
    game.getSpeedIntervals = function (b) {
        if (!game.speedIntervals[b]) {
            var c = 0,
                d = 0;
            game.speedIntervals[b] = [];
            for (var f = 0; f < BASE_FPS; f++) {
                c += b;
                if (Math.floor(c) > d) {
                    game.speedIntervals[b].push(TRUE);
                    d = Math.floor(c)
                } else game.speedIntervals[b].push(FALSE)
            }
        }
        return game.speedIntervals[b]
    };
    game.finishLevel = function () {
        game.changeGameplayMode(9)
    };
    game.changeGameplayMode = function (b) {
        game.gameplayMode = b;
        if (b != 13) for (var c = 0; c < game.playerCount + 4; c++) game.actors[c].render();
        switch (b) {
        case 0:
            game.playAmbientSound();
            break;
        case 2:
            game.stopAllAudio();
            game.gameplayModeTime = game.timing[3];
            break;
        case 3:
            game.playerDyingId == 0 ? game.playSound("death", 0) : game.playSound("death-double", 0);
            game.gameplayModeTime = game.timing[4];
            break;
        case 6:
            game.canvasEl.style.visibility = "hidden";
            game.gameplayModeTime = game.timing[5];
            break;
        case 7:
            game.stopAllAudio();
            game.canvasEl.style.visibility = "";
            game.doorEl.style.display = "block";
            b = document.createElement("div");
            b.id = "pcm-re";
            game.prepareElement(b, 160, 0);
            game.playfieldEl.appendChild(b);
            game.gameplayModeTime = game.timing[6];
            break;
        case 4:
            game.doorEl.style.display = "block";
            b = document.createElement("div");
            b.id = "pcm-re";
            game.prepareElement(b, 160, 0);
            game.playfieldEl.appendChild(b);
            game.gameplayModeTime = game.timing[7];
            game.stopAllAudio();
            game.playerCount == 2 ? game.playSound("start-music-double", 0, TRUE) : game.playSound("start-music", 0, TRUE);
            break;
        case 5:
            game.lives--;
            game.updateChromeLives();
            game.gameplayModeTime = game.timing[8];
            break;
        case 8:
        case 14:
            b = document.getElementById("pcm-re");
            google.dom.remove(b);
            game.stopAllAudio();
            b = document.createElement("div");
            b.id = "pcm-go";
            game.prepareElement(b, 8, 152);
            game.playfieldEl.appendChild(b);
            game.gameplayModeTime = game.timing[9];
            break;
        case 9:
            game.stopAllAudio();
            game.gameplayModeTime = game.timing[10];
            break;
        case 10:
            game.doorEl.style.display = "none";
            game.gameplayModeTime = game.timing[11];
            break;
        case 11:
            game.canvasEl.style.visibility = "hidden";
            game.gameplayModeTime = game.timing[12];
            break;
        case 12:
            game.playfieldEl.style.visibility = "hidden";
            game.gameplayModeTime = game.timing[13];
            break;
        case 1:
            game.gameplayModeTime =
            game.timing[2];
            break;
        case 13:
            game.startCutscene();
            break
        }
    };
    game.showChrome = function (b) {
        game.showElementById("pcm-sc-1-l", b);
        game.showElementById("pcm-sc-2-l", b);
        game.showElementById("pcm-sc-1", b);
        game.showElementById("pcm-sc-2", b);
        game.showElementById("pcm-li", b);
        game.showElementById("pcm-so", b)
    };
    game.toggleSound = function (b) {
        b = window.event || b;
        b.cancelBubble = TRUE;
        if (google.pacManSound) {
            game.userDisabledSound = TRUE;
            game.stopAllAudio();
            google.pacManSound = FALSE
        } else {
            google.pacManSound = TRUE;
            game.playAmbientSound()
        }
        game.updateSoundIcon();
        return b.returnValue = FALSE
    };
    game.updateSoundIcon = function () {
        if (game.soundEl) google.pacManSound ? game.changeElementBkPos(game.soundEl, 216, 105, FALSE) : game.changeElementBkPos(game.soundEl, 236, 105, FALSE)
    };
    game.startCutscene = function () {
        game.playfieldEl.style.visibility = "hidden";
        game.canvasEl.style.visibility = "";
        game.showChrome(FALSE);
        game.cutsceneCanvasEl = document.createElement("div");
        game.cutsceneCanvasEl.id = "pcm-cc";
        game.canvasEl.appendChild(game.cutsceneCanvasEl);
        game.cutscene = CUTSCENE_DATA[game.cutsceneId];
        game.cutsceneSequenceId = -1;
        game.frightModeTime = game.levels.frightTotalTime;
        game.cutsceneActors = [];
        for (var b in game.cutscene.actors) {
            var c = game.cutscene.actors[b].id;
            if (c > 0) c += game.playerCount - 1;
            var d = document.createElement("div");
            d.className = "pcm-ac";
            d.id = "actor" + c;
            game.prepareElement(d, 0, 0);
            c = new Actor(c);
            c.el = d;
            c.elBackgroundPos = [0, 0];
            c.elPos = [0, 0];
            c.pos = [game.cutscene.actors[b].y * 8, game.cutscene.actors[b].x * 8];
            c.posDelta = [0, 0];
            c.ghost = game.cutscene.actors[b].ghost;
            game.cutsceneCanvasEl.appendChild(d);
            game.cutsceneActors.push(c)
        }
        game.cutsceneNextSequence();
        game.stopAllAudio();
        game.playAmbientSound()
    };
    game.stopCutscene = function () {
        game.playfieldEl.style.visibility = "";
        google.dom.remove(game.cutsceneCanvasEl);
        game.showChrome(TRUE);
        game.newLevel(FALSE)
    };
    game.cutsceneNextSequence = function () {
        game.cutsceneSequenceId++;
        if (game.cutscene.sequence.length == game.cutsceneSequenceId) game.stopCutscene();
        else {
            var b = game.cutscene.sequence[game.cutsceneSequenceId];
            game.cutsceneTime = b.time * BASE_FPS;
            for (var c in game.cutsceneActors) {
                var d = game.cutsceneActors[c];
                d.dir = b.moves[c].dir;
                d.speed = b.moves[c].speed;
                if (b.moves[c].elId) d.el.id = b.moves[c].elId;
                if (b.moves[c].mode) d.mode = b.moves[c].mode;
                d.render()
            }
        }
    };
    game.checkCutscene = function () {
        game.cutsceneTime <= 0 && game.cutsceneNextSequence()
    };
    game.advanceCutscene = function () {
        for (var b in game.cutsceneActors) {
            var c = game.cutsceneActors[b],
                d = DIRECTION_DELTAS[c.dir];
            c.pos[d.axis] += d.increment * c.speed;
            c.render()
        }
        game.cutsceneTime--
    };
    // ============================================================
    // Rendering & Sprites
    // ============================================================
    game.updateActorPositions = function () {
        for (var b in game.actors) game.actors[b].updateElementPosition()
    };
    game.blinkEnergizers = function () {
        switch (game.gameplayMode) {
        case 4:
        case 5:
        case 6:
        case 7:
        case 9:
        case 10:
        case 11:
        case 12:
            game.playfieldEl.className = "";
            break;
        case 8:
        case 14:
            game.playfieldEl.className = "blk";
            break;
        default:
            if (game.globalTime % (game.timing[0] * 2) == 0) game.playfieldEl.className = "";
            else if (game.globalTime % (game.timing[0] * 2) == game.timing[0]) game.playfieldEl.className = "blk";
            break
        }
    };
    game.blinkScoreLabels = function () {
        if (game.gameplayMode != 13) {
            var b = "";
            if (game.globalTime % (game.timing[17] * 2) == 0) b = "visible";
            else if (game.globalTime % (game.timing[17] * 2) == game.timing[17]) b = "hidden";
            if (b) for (var c = 0; c < game.playerCount; c++) game.scoreLabelEl[c].style.visibility = b
        }
    };
    game.finishFrightMode = function () {
        game.switchMainGhostMode(game.lastMainGhostMode, FALSE)
    };
    game.handleGameplayModeTimer = function () {
        if (game.gameplayModeTime) {
            game.gameplayModeTime--;
            switch (game.gameplayMode) {
            case 2:
            case 3:
                for (var b = 0; b < game.playerCount + 4; b++) game.actors[b].render();
                break;
            case 10:
                Math.floor(game.gameplayModeTime / (game.timing[11] / 8)) % 2 == 0 ? game.changeElementBkPos(game.playfieldEl, 322, 2, FALSE) : game.changeElementBkPos(game.playfieldEl, 322, 138, FALSE)
            }
            if (game.gameplayModeTime <= 0) {
                game.gameplayModeTime = 0;
                switch (game.gameplayMode) {
                case 1:
                    game.changeGameplayMode(0);
                    game.ghostEyesCount++;
                    game.playAmbientSound();
                    game.actors[game.ghostBeingEatenId].el.className = "pcm-ac";
                    game.actors[game.ghostBeingEatenId].setMode(8);
                    var c = FALSE;
                    for (b = game.playerCount; b < game.playerCount + 4; b++) if (game.actors[b].mode == 4 || (game.actors[b].mode == 16 || game.actors[b].mode == 128) && !game.actors[b].eatenInThisFrightMode) {
                        c = TRUE;
                        break
                    }
                    c || game.finishFrightMode();
                    break;
                case 2:
                    game.changeGameplayMode(3);
                    break;
                case 3:
                    game.newLife();
                    break;
                case 4:
                    game.changeGameplayMode(5);
                    break;
                case 6:
                    game.changeGameplayMode(7);
                    break;
                case 7:
                case 5:
                    b = document.getElementById("pcm-re");
                    google.dom.remove(b);
                    game.changeGameplayMode(0);
                    break;
                case 8:
                    b = document.getElementById("pcm-go");
                    google.dom.remove(b);
                    google.pacManQuery && google.pacManQuery();
                    break;
                case 9:
                    game.changeGameplayMode(10);
                    break;
                case 10:
                    game.changeGameplayMode(11);
                    break;
                case 11:
                    if (game.levels.cutsceneId) {
                        game.cutsceneId = game.levels.cutsceneId;
                        game.changeGameplayMode(13)
                    } else {
                        game.canvasEl.style.visibility = "";
                        game.newLevel(FALSE)
                    }
                    break;
                case 12:
                    game.playfieldEl.style.visibility = "";
                    game.canvasEl.style.visibility = "";
                    game.switchToDoubleMode();
                    break
                }
            }
        }
    };
    game.handleFruitTimer = function () {
        if (game.fruitTime) {
            game.fruitTime--;
            game.fruitTime <= 0 && game.hideFruit()
        }
    };
    game.handleGhostModeTimer = function () {
        if (game.frightModeTime) {
            game.frightModeTime--;
            if (game.frightModeTime <= 0) {
                game.frightModeTime = 0;
                game.finishFrightMode()
            }
        } else if (game.ghostModeTime > 0) {
            game.ghostModeTime--;
            if (game.ghostModeTime <= 0) {
                game.ghostModeTime = 0;
                game.ghostModeSwitchPos++;
                if (game.levels.ghostModeSwitchTimes[game.ghostModeSwitchPos]) {
                    game.ghostModeTime = game.levels.ghostModeSwitchTimes[game.ghostModeSwitchPos] * BASE_FPS;
                    switch (game.mainGhostMode) {
                    case 2:
                        game.switchMainGhostMode(1, FALSE);
                        break;
                    case 1:
                        game.switchMainGhostMode(2, FALSE);
                        break
                    }
                }
            }
        }
    };
    game.handleForcePenLeaveTimer = function () {
        if (game.forcePenLeaveTime) {
            game.forcePenLeaveTime--;
            if (game.forcePenLeaveTime <= 0) {
                for (var b = 1; b <= 3; b++) if (game.actors[game.playerCount + b].mode == 16) {
                    game.actors[game.playerCount + b].freeToLeavePen = TRUE;
                    break
                }
                game.resetForcePenLeaveTime()
            }
        }
    };
    game.handleTimers = function () {
        if (game.gameplayMode == 0) {
            game.handleForcePenLeaveTimer();
            game.handleFruitTimer();
            game.handleGhostModeTimer()
        }
        game.handleGameplayModeTimer()
    };
    // ============================================================
    // Game Loop — main tick and timers
    // ============================================================
    game.tick = function () {
        var b = (new Date).getTime();
        game.lastTimeDelta += b - game.lastTime - game.tickInterval;
        if (game.lastTimeDelta > 100) game.lastTimeDelta = 100;
        if (game.canDecreaseFps && game.lastTimeDelta > 50) {
            game.lastTimeSlownessCount++;
            game.lastTimeSlownessCount == 20 && game.decreaseFps()
        }
        var c = 0;
        if (game.lastTimeDelta > game.tickInterval) {
            c = Math.floor(game.lastTimeDelta / game.tickInterval);
            game.lastTimeDelta -= game.tickInterval * c
        }
        game.lastTime = b;
        if (game.gameplayMode == 13) {
            for (b = 0; b < game.tickMultiplier + c; b++) {
                game.advanceCutscene();
                game.intervalTime = (game.intervalTime + 1) % BASE_FPS;
                game.globalTime++
            }
            game.checkCutscene();
            game.blinkScoreLabels()
        } else for (b = 0; b < game.tickMultiplier + c; b++) {
            game.moveActors();
            if (game.gameplayMode == 0) if (game.tilesChanged) {
                game.detectCollisions();
                game.updateActorTargetPositions()
            }
            game.globalTime++;
            game.intervalTime = (game.intervalTime + 1) % BASE_FPS;
            game.blinkEnergizers();
            game.blinkScoreLabels();
            game.handleTimers()
        }
    };
    game.extraLife = function (b) {
        game.playSound("extra-life", 0);
        game.extraLifeAwarded[b] = TRUE;
        game.lives++;
        if (game.lives > 5) game.lives = 5;
        game.updateChromeLives()
    };
    game.addToScore = function (b, c) {
        game.score[c] += b;
        !game.extraLifeAwarded[c] && game.score[c] > 1E4 && game.extraLife(c);
        game.updateChromeScore(c)
    };
    game.updateChrome = function () {
        game.updateChromeLevel();
        game.updateChromeLives();
        for (var b = 0; b < game.playerCount; b++) game.updateChromeScore(b)
    };
    game.updateChromeScore = function (b) {
        var c = game.score[b].toString();
        if (c.length > game.scoreDigits) c = c.substr(c.length - game.scoreDigits, game.scoreDigits);
        for (var d = 0; d < game.scoreDigits; d++) {
            var f = document.getElementById("pcm-sc-" + (b + 1) + "-" + d),
                h = c.substr(d, 1);
            h ? game.changeElementBkPos(f, 8 + 8 * parseInt(h, 10), 144, TRUE) : game.changeElementBkPos(f, 48, 0, TRUE)
        }
    };
    game.updateChromeLives = function () {
        game.livesEl.innerHTML = "";
        for (var b = 0; b < game.lives; b++) {
            var c = document.createElement("div");
            c.className = "pcm-lif";
            game.prepareElement(c, 64, 129);
            game.livesEl.appendChild(c)
        }
    };
    game.updateChromeLevel = function () {
        game.levelEl.innerHTML = "";
        for (var b = game.level; b >= Math.max(game.level - 4 + 1, 1); b--) {
            var c = b >= LEVEL_CONFIGS.length ? LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1].fruit : LEVEL_CONFIGS[b].fruit,
                d = document.createElement("div");
            c = game.getFruitSprite(c);
            game.prepareElement(d, c[0], c[1]);
            game.levelEl.appendChild(d)
        }
        game.levelEl.style.marginTop = (4 - Math.min(game.level, 4)) * 16 + "px"
    };
    // ============================================================
    // UI Chrome — score display, lives, level indicator
    // ============================================================
    game.createChrome = function () {
        game.canvasEl.innerHTML = "";
        game.scoreDigits = game.playerCount == 1 ? 10 : 5;
        game.scoreLabelEl = [];
        game.scoreLabelEl[0] = document.createElement("div");
        game.scoreLabelEl[0].id = "pcm-sc-1-l";
        game.prepareElement(game.scoreLabelEl[0], 160, 56);
        game.canvasEl.appendChild(game.scoreLabelEl[0]);
        game.scoreEl = [];
        game.scoreEl[0] = document.createElement("div");
        game.scoreEl[0].id = "pcm-sc-1";
        for (var b = 0; b < game.scoreDigits; b++) {
            var c = document.createElement("div");
            c.id = "pcm-sc-1-" + b;
            c.style.top = b * 8 + "px";
            c.style.left = 0;
            c.style.position = "absolute";
            c.style.width = "8px";
            c.style.height = "8px";
            game.prepareElement(c, 48, 0);
            game.scoreEl[0].appendChild(c)
        }
        game.canvasEl.appendChild(game.scoreEl[0]);
        game.livesEl = document.createElement("div");
        game.livesEl.id = "pcm-li";
        game.canvasEl.appendChild(game.livesEl);
        game.levelEl = document.createElement("div");
        game.levelEl.id = "pcm-le";
        game.canvasEl.appendChild(game.levelEl);
        if (game.playerCount == 2) {
            game.scoreLabelEl[1] = document.createElement("div");
            game.scoreLabelEl[1].id = "pcm-sc-2-l";
            game.prepareElement(game.scoreLabelEl[1], 160, 64);
            game.canvasEl.appendChild(game.scoreLabelEl[1]);
            game.scoreEl[1] = document.createElement("div");
            game.scoreEl[1].id = "pcm-sc-2";
            for (b = 0; b < game.scoreDigits; b++) {
                c = document.createElement("div");
                c.id = "pcm-sc-2-" + b;
                c.style.top = b * 8 + "px";
                c.style.left = 0;
                c.style.position = "absolute";
                c.style.width = "8px";
                c.style.height = "8px";
                game.prepareElement(c, 48, 0);
                game.scoreEl[1].appendChild(c)
            }
            game.canvasEl.appendChild(game.scoreEl[1])
        }
        if (game.soundAvailable) {
            game.soundEl = document.createElement("div");
            game.soundEl.id = "pcm-so";
            game.prepareElement(game.soundEl, -32, -16);
            game.canvasEl.appendChild(game.soundEl);
            game.soundEl.onclick =
            game.toggleSound;
            game.updateSoundIcon()
        }
    };
    // PacManAudioEngine is loaded from pacman-audio.js (global variable)
    // ============================================================
    // Audio System — sound playback and ambient tracks
    // ============================================================
    game.clearDotEatingNow = function () {
        game.dotEatingNow = [FALSE, FALSE];
        game.dotEatingNext = [FALSE, FALSE]
    };
    game.playSound = function (b, c, d) {
        if (!(!game.soundAvailable || !google.pacManSound || game.paused)) {
            d || game.stopSoundChannel(c);
            try {
                game.flashSoundPlayer.playTrack(b, c)
            } catch (f) {
                game.soundAvailable = FALSE
            }
        }
    };
    game.stopSoundChannel = function (b) {
        if (game.soundAvailable) try {
            game.flashSoundPlayer.stopChannel(b)
        } catch (c) {
            game.soundAvailable = FALSE
        }
    };
    game.stopAllAudio = function () {
        if (game.soundAvailable) {
            try {
                game.flashSoundPlayer.stopAmbientTrack()
            } catch (b) {
                game.soundAvailable = FALSE
            }
            for (var c = 0; c < 5; c++) game.stopSoundChannel(c)
        }
    };
    game.playDotEatingSound = function (b) {
        if (game.soundAvailable && google.pacManSound) if (game.gameplayMode == 0) if (game.dotEatingNow[b]) game.dotEatingNext[b] = TRUE;
        else {
            if (b == 0) {
                var c = game.dotEatingSoundPart[b] == 1 ? "eating-dot-1" : "eating-dot-2";
                game.playSound(c, 1 + game.dotEatingChannel[b], TRUE);
                game.dotTimer = window.setInterval(game.repeatDotEatingSoundPacMan, 150)
            } else {
                game.playSound("eating-dot-double", 3 + game.dotEatingChannel[b], TRUE);
                game.dotTimerMs = window.setInterval(game.repeatDotEatingSoundMsPacMan, 150)
            }
            game.dotEatingChannel[b] = (game.dotEatingChannel[b] + 1) % 2;
            game.dotEatingSoundPart[b] =
            3 - game.dotEatingSoundPart[b]
        }
    };
    game.repeatDotEatingSound = function (b) {
        game.dotEatingNow[b] = FALSE;
        if (game.dotEatingNext[b]) {
            game.dotEatingNext[b] = FALSE;
            game.playDotEatingSound(b)
        }
    };
    game.repeatDotEatingSoundPacMan = function () {
        game.repeatDotEatingSound(0)
    };
    game.repeatDotEatingSoundMsPacMan = function () {
        game.repeatDotEatingSound(1)
    };
    game.playAmbientSound = function () {
        if (game.soundAvailable && google.pacManSound) {
            var b = 0;
            if (game.gameplayMode == 0 || game.gameplayMode == 1) b = game.ghostEyesCount ? "ambient-eyes" : game.mainGhostMode == 4 ? "ambient-fright" : game.dotsEaten > 241 ? "ambient-4" : game.dotsEaten > 207 ? "ambient-3" : game.dotsEaten > 138 ? "ambient-2" : "ambient-1";
            else if (game.gameplayMode == 13) b = "cutscene";
            if (b) try {
                game.flashSoundPlayer.playAmbientTrack(b)
            } catch (c) {
                game.soundAvailable = FALSE
            }
        }
    };
    // ============================================================
    // Initialization — timer setup, CSS, canvas, Flash detection
    // ============================================================
    game.initializeTickTimer = function () {
        window.clearInterval(game.tickTimer);
        game.fps = FPS_OPTIONS[game.fpsChoice];
        game.tickInterval = 1E3 / game.fps;
        game.tickMultiplier = BASE_FPS / game.fps;
        game.timing = {};
        for (var b in TIMING_VALUES) {
            var c = !google.pacManSound && (b == 7 || b == 8) ? 1 : TIMING_VALUES[b];
            game.timing[b] = Math.round(c * BASE_FPS)
        }
        game.lastTime = (new Date).getTime();
        game.lastTimeDelta = 0;
        game.lastTimeSlownessCount = 0;
        game.tickTimer = window.setInterval(game.tick, game.tickInterval)
    };
    game.decreaseFps = function () {
        if (game.fpsChoice < FPS_OPTIONS.length - 1) {
            game.fpsChoice++;
            game.initializeTickTimer();
            if (game.fpsChoice == FPS_OPTIONS.length - 1) game.canDecreaseFps = FALSE
        }
    };
    game.addCss = function () {
        var b = "#pcm-c {  width: 554px;  border-top: 25px solid black;  padding-bottom: 25px;  height: 136px;  position: relative;  background: black;  outline: 0;  overflow: hidden;  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);}#pcm-c * {  position: absolute;  overflow: hidden;}#pcm-p,#pcm-cc {  left: 45px;  width: 464px;  height: 136px;  z-index: 99;  overflow: hidden;}#pcm-p .pcm-d {  width: 2px;  height: 2px;  margin-left: 3px;  margin-top: 3px;  background: #f8b090;  z-index: 100;}#pcm-p .pcm-e {  width: 8px;  height: 8px;  z-index: 101;}#pcm-sc-1 {  left: 18px;  top: 16px;  width: 8px;  height: 56px;  position: absolute;  overflow: hidden;}#pcm-sc-2 {  left: 18px;  top: 80px;  width: 8px;  height: 56px;  position: absolute;  overflow: hidden;}#pcm-le {  position: absolute;  left: 515px;  top: 74px;  height: 64px;  width: 32px;} #pcm-le div {  position: relative;}#pcm-sc-1-l {    left: -2px;  top: 0;  width: 48px;  height: 8px;}#pcm-sc-2-l {    left: -2px;  top: 64px;  width: 48px;  height: 8px;}#pcm-so {  left: 7px;  top: 116px;  width: 12px;  height: 12px;  border: 8px solid black;  cursor: pointer;}#pcm-li {  position: absolute;  left: 523px;  top: 0;  height: 80px;  width: 16px;}#pcm-li .pcm-lif {  position: relative;  width: 16px;  height: 12px;  margin-bottom: 3px;}#pcm-p.blk .pcm-e {  visibility: hidden;}#pcm-c .pcm-ac {  width: 16px;  height: 16px;  margin-left: -4px;  margin-top: -4px;  z-index: 110;}#pcm-c .pcm-n {  z-index: 111;}#pcm-c #pcm-stck {  z-index: 109;}#pcm-c #pcm-gbug {  width: 32px;}#pcm-c #pcm-bpcm {  width: 32px;  height: 32px;  margin-left: -20px;  margin-top: -20px;}#pcm-f,#pcm-le div {  width: 32px;  height: 16px;  z-index: 105;}#pcm-f {  margin-left: -8px;  margin-top: -4px;}#pcm-do {  width: 19px;  height: 2px;  left: 279px;  top: 46px;  overflow: hidden;  position: absolute;  background: #ffaaa5;}#pcm-re {  width: 48px;  height: 8px;  z-index: 120;  left: 264px;  top: 80px;}#pcm-go {  width: 80px;  height: 8px;  z-index: 120;  left: 248px;  top: 80px;}";
        game.styleElement =
        document.createElement("style");
        game.styleElement.type = "text/css";
        if (game.styleElement.styleSheet) game.styleElement.styleSheet.cssText = b;
        else game.styleElement.appendChild(document.createTextNode(b));
        document.getElementsByTagName("head")[0].appendChild(game.styleElement)
    };
    game.createCanvasElement = function () {
        game.canvasEl = document.createElement("div");
        game.canvasEl.id = "pcm-c";
        game.canvasEl.hideFocus = TRUE;
        document.getElementById("logo").appendChild(game.canvasEl);
        game.canvasEl.tabIndex = 0;
        game.canvasEl.focus()
    };
    game.everythingIsReady = function () {
        if (!game.ready) {
            game.ready = TRUE;
            var b = document.getElementById("logo-l");
            google.dom.remove(b);
            document.getElementById("logo").style.background = "black";
            game.addCss();
            game.createCanvasElement();
            game.speedIntervals = [];
            game.oppositeDirections = [];
            game.oppositeDirections[1] = 2;
            game.oppositeDirections[2] = 1;
            game.oppositeDirections[4] = 8;
            game.oppositeDirections[8] = 4;
            game.addEventListeners();
            game.fpsChoice = 0;
            game.canDecreaseFps = TRUE;
            game.initializeTickTimer();
            game.newGame()
        }
    };
    game.checkIfEverythingIsReady = function () {
        if (game.soundReady || game.graphicsReady) game.updateLoadingProgress(0.67);
        if (game.soundReady && game.graphicsReady) {
            game.updateLoadingProgress(1);
            game.everythingIsReady()
        }
    };
    game.preloadImage = function (b) {
        var c = new Image,
            d = google.browser.engine.IE;
        if (!d) c.onload = game.imageLoaded;
        c.src = b;
        d && game.imageLoaded()
    };
    game.imageLoaded = function () {
        game.graphicsReady = TRUE;
        game.checkIfEverythingIsReady()
    };
    game.prepareGraphics = function () {
        game.graphicsReady = FALSE;
        game.preloadImage("pacman10-hp-sprite.png")
    };
    game.prepareSound = function () {
        game.soundAvailable = FALSE;
        game.soundReady = FALSE;
        if (window.AudioContext || window.webkitAudioContext) {
            game.flashSoundPlayer = PacManAudioEngine;
            game.soundAvailable = TRUE;
        }
        game.soundReady = TRUE;
        game.checkIfEverythingIsReady();
    };
    game.destroy = function () {
        if (google.pacman) {
            game.stopAllAudio();
            window.clearInterval(game.tickTimer);
            window.clearInterval(game.dotTimer);
            window.clearInterval(game.dotTimerMs);
            google.dom.remove(game.styleElement);
            PacManAudioEngine.close();
            google.dom.remove(game.canvasEl);
            google.pacman = undefined
        }
    };
    game.exportFunctionCalls = function () {
        google.pacman = {};
        google.pacman.insertCoin = game.insertCoin;
        google.pacman.destroy = game.destroy
    };
    game.updateLoadingProgress = function (b) {
        b = Math.round(b * 200);
        document.getElementById("logo-b").style.width = b + "px"
    };
    game.init = function () {
        game.ready = FALSE;
        document.getElementById("logo").title = "";
        game.updateLoadingProgress(0.33);
        game.exportFunctionCalls();
        game.useCss = navigator.userAgent.indexOf("MSIE 5.") != -1 || navigator.userAgent.indexOf("MSIE 6.") != -1 || navigator.userAgent.indexOf("MSIE 7.") != -1 ? FALSE : TRUE;
        game.prepareGraphics();
        game.prepareSound()
    };
    game.init();
}();