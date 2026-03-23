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

if (!loadGame()) { // creates new game if no save found, else save is loaded.
  console.log("No game saved. Creating new game.");
  game.graphics.background = getRandomBiome();
  console.log("Selected random biome : " + game.graphics.background);
  spawnFood();
  game.graphics.spewk = new_spewk;
  game.data.startDate = new Date();
  game.data.lastSeen = new Date();
}

let biomeFrames = biomes[game.graphics.background];
let biomeFrame = biomeFrames[0];