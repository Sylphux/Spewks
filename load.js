console.clear()

let game = {
  graphics: {
    background: "",
    food: { frame: [], foodPos: { x: -1, y: -1 } },
    spewk: [],
  },
  data: {
    startDate: "",
    lastSeen: "",
    level: 1,
    xp: 0,
    upgrades: 0,
    availableUps: 0,
    intention: "none",
    alive: true,
  },
};

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
    "spewk_step_0-00.108.wav"
  ],
  spewkEats: [
    "spewk_eats_0-01.629.wav"
  ],
  spewkIhu: [
    "spewk_ihu_0-00.499.wav",
    "spewk_ihu_0-00.554.wav",
    "spewk_ihu_0-00.596.wav",
    "spewk_ihu_0-00.610.wav",
    "spewk_ihu_0-00.660.wav",
    "spewk_ihu_0-00.667.wav",
    "spewk_ihu_0-00.717.wav",
    "spewk_ihu_0-00.724.wav"
  ]
}

const audioContext = new AudioContext();
let audioElement = null

Object.keys(sounds).forEach(key => {
  for (let sound of sounds[key]){
    let tempSound = document.createElement('audio')
    tempSound.id = sound
    tempSound.src = `Audio/${sound}`
    tempSound.autoplay = false
    document.getElementById('audio_files').appendChild(tempSound)
  }
})

playSound(sounds.spewkSteps)

function createNewGame() {
  console.log("Creating new game.");
  game.graphics.background = getRandomBiome();
  console.log("Selected random biome : " + game.graphics.background);
  spawnFood();
  game.graphics.spewk = new_spewk;
  game.data.startDate = new Date();
  game.data.lastSeen = new Date();
}

if (!loadGame()) { // creates new game if no save found, else save is loaded.
  createNewGame()
}

let today = Date.parse(new Date())
let lastSeen = Date.parse(game.data.lastSeen)
let absence = (milliToDays(today) - milliToDays(lastSeen))
console.log("Absent for : " + absence + " days.")
if (absence > 14) {
  spewkFoundDead()
} else {
  game.data.lastSeen = new Date();
}

let biomeFrames = biomes[game.graphics.background];
let biomeFrame = biomeFrames[0];