console.clear();

/////////////////////////////////////////
// VARIOUS DECLARATIONS
/////////////////////////////////////////

let inAProgram = false;
let sessionMessages = [];
let msgNavIndex = sessionMessages.length;

/////////////////////////////////////////
// DOM STUFF
/////////////////////////////////////////

const commandLineInput = document.getElementById("command_line");
const terminalP = document.getElementById("terminal");
const devControls = document.getElementById("dev_controls");
const updateArea = document.getElementById("update_area");
const terminalSign = document.getElementById("dollar_sign_term");

terminalSign.innerHTML = playerPrefix;

devControls.style.display = defaultDevToolsDisplay;

function toggleDevControls() {
  let display = devControls.style.display;
  if (display != "none") {
    devControls.style.display = "none";
  } else {
    devControls.style.display = "flex";
  }
}

/////////////////////////////////////////
// TEMPLATES
/////////////////////////////////////////

console.log("Loading templates...");

let game = {
  graphics: {
    background: "",
    spewkFace: "",
    spewk: [],
  },
  data: {
    name: "",
    startDate: "",
    lastSeen: "",
    level: 1,
    xp: 0,
    intention: "none",
    foodPos: { x: -1, y: -1 },
    alive: true,
  },
  guest: null,
};

/////////////////////////////////////////
// AUDIO
/////////////////////////////////////////

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

/////////////////////////////////////////
// GRAPHICS CANVAS
/////////////////////////////////////////

console.log("Loading graphics (layers layout)...");
let layersArr = new Array(20).fill("");

const layers = {
  bg: 0,
  food: 5,
  guest: 9,
  spewk: 10,
  ui: 20,
};

let biomeFrames = null;
let renderedFrame = [];

/////////////////////////////////////////
// LOAD SAVE DATA OR NEW GAME
/////////////////////////////////////////

console.log("Loading game...");

function createNewGame() {
  console.log("Creating new game.");
  game.graphics.background = getRandomBiome(); // string
  game.data.name = generateName();
  game.graphics.spewkFace = spewkFaces[randTo(spewkFaces.length - 1)];
  game.graphics.spewk = drawNewSpewk(game.graphics.spewkFace);
  game.data.startDate = new Date();
  game.data.lastSeen = new Date();
  spawnFood();
  loadLayers();
}

function loadGame() {
  let temp = load("savedGame");
  if (temp != null) {
    game = temp;
    loadLayers();
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

lookForGuest();

/////////////////////////////////////////
// PRE-GAME CHECKS
/////////////////////////////////////////

verifyAbsence();

saveGame()