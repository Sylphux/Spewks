// You can change these
let autoSaveDelay = 3000; // ms
let timeAloneBeforeDeath = 14; // days
let idle = false; // If set to true, the game will launch in a paused state
let onlyNewGame = false; // never save and load
let absenceUntilFoodReset = 2; // Resets food position after x days
let defaultDevToolsDisplay = "none"; // "none" or "flex"
let spawnFakeGuest = false;
let soundOnString = "Sound ON";
let soundOffString = "Sound OFF";
let narratorName = "The wind";
let playerPrefix = "You: ";
let ySafeZone = 2;
let xSafeZone = 4;

// Graphics and physics
let global_fps = 16; // do not touch
let default_frame = { x: 30, y: 14 }; // do not touch
let refreshRate = 1000 / global_fps; // do not touch
let halfRefreshRate = 1000 / (global_fps / 2); // do not touch
let itemAnimSpeed = 150;
let maxStartingChars = 6
