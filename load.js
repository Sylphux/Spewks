console.clear();

// DOM

const commandLineInput = document.getElementById("command_line");
const terminalP = document.getElementById("terminal");
const devControls = document.getElementById("dev_controls");

devControls.style.display = defaultDevToolsDisplay;

function toggleDevControls() {
  let display = devControls.style.display;
  if (display != "none") {
    devControls.style.display = "none";
  } else {
    devControls.style.display = "flex";
  }
}

// Templates

console.log("Loading templates...");

let game = {
  graphics: {
    background: "",
    spewk: [],
  },
  data: {
    name: "",
    startDate: "",
    lastSeen: "",
    level: 1,
    xp: 0,
    upgrades: 0,
    availableUps: 0,
    intention: "none",
    foodPos: { x: -1, y: -1 },
    alive: true,
  },
};

// Audio

console.log("Loading audio...");

let sounds = {
  spewkSteps: [
    "spewk_step_0-00.072.wav",
    "spewk_step_0-00.083.wav",
    "spewk_step_0-00.087.wav",
    "spewk_step_0-00.090.wav",
    "spewk_step_0-00.091.wav",
    "spewk_step_0-00.092-001.wav",
    "spewk_step_0-00.092-002.wav",
    "spewk_step_0-00.093.wav",
    "spewk_step_0-00.094.wav",
    "spewk_step_0-00.099-001.wav",
    "spewk_step_0-00.099-002.wav",
    "spewk_step_0-00.101-001.wav",
    "spewk_step_0-00.101-002.wav",
    "spewk_step_0-00.101-003.wav",
    "spewk_step_0-00.105.wav",
    "spewk_step_0-00.106.wav",
    "spewk_step_0-00.108.wav",
  ],
  spewkEats: ["spewk_eats_0-01.629.wav"],
  spewkIhu: [
    "spewk_ihu_0-00.499.wav",
    "spewk_ihu_0-00.554.wav",
    "spewk_ihu_0-00.596.wav",
    "spewk_ihu_0-00.610.wav",
    "spewk_ihu_0-00.660.wav",
    "spewk_ihu_0-00.667.wav",
    "spewk_ihu_0-00.717.wav",
    "spewk_ihu_0-00.724.wav",
  ],
};

const audioContext = new AudioContext();
let audioElement = null;

Object.keys(sounds).forEach((key) => {
  // adding sounds to DOM
  for (let sound of sounds[key]) {
    let tempSound = document.createElement("audio");
    tempSound.id = sound;
    tempSound.src = `Assets/Audio/${sound}`;
    tempSound.autoplay = false;
    document.getElementById("audio_files").appendChild(tempSound);
  }
});

// Graphics (layers)

console.log("Loading graphics (layers layout)...");

let layersArr = new Array(20).fill("");

const layers = {
  bg: 0,
  food: 9,
  spewk: 10,
  ui: 20,
};

// Game data loading

console.log("Loading game...");

function createNewGame() {
  console.log("Creating new game.");
  game.graphics.background = getRandomBiome(); // string
  game.data.name = generateName();
  game.graphics.spewk = newSpewk;
  game.data.startDate = new Date();
  game.data.lastSeen = new Date();
  loadLayers();
  spawnFood();
}

function loadGame() {
  let temp = load("savedGame");
  if (temp != null) {
    game = temp;
    loadLayers();
    spawnFood(game.data.foodPos);
    updateLvGraphics();
    console.log("Loaded save from local storage.");
    return true;
  }
  console.log("Nothing to load.");
  return false;
}

if (onlyNewGame) {
  createNewGame();
} else {
  if (!loadGame()) {
    createNewGame();
  }
}

// Graphics (background)

console.log("Loading graphics (biome)...");

let biomeFrames = biomes[game.graphics.background];

// Gameplay

console.log("Loading gameplay elements...");

function verifyAbsence() {
  let today = Date.parse(new Date());
  let lastSeen = Date.parse(game.data.lastSeen);
  let absence = milliToDays(today) - milliToDays(lastSeen);
  console.log("Absent for : " + absence + " days.");
  if (absence > timeAloneBeforeDeath) {
    spewkFoundDead();
  } else {
    game.data.lastSeen = new Date();
  }
  if (absence >= absenceUntilFoodReset) {
    spawnFood();
  }
}

verifyAbsence();
