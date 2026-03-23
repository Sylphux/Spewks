// mergeAndRender([spaces_frame, guy_frame, shape_frame])
// guy_frame = moveSprite(guy_frame, {x: 4, y: -2})

let idle = false;

let game = {
  graphics: {
    background: [],
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

loadedCookie = getCookie("savedGame");
if (loadedCookie == "") {
  console.log("No game saved. Creating new game.");
  game.graphics.background = desert_background;
  spawnFood();
  game.graphics.spewk = new_spewk;
  game.data.startDate = new Date();
  game.data.lastSeen = new Date();
} else {
  game = getCookie("savedGame");
}

function checkIfAte() {
  let spewk = game.graphics.spewk;
  let y = game.graphics.food.foodPos.y;
  let x = game.graphics.food.foodPos.x;
  if (spewk[y][x] != " ") {
    console.log("Spewk ate some food!");
    return true;
  }
  return false;
}

function gainXP() {
  game.data.xp++;
  if (game.data.xp == game.data.level) {
    game.data.level++;
    game.data.xp = 0;
    game.data.availableUps++;
  }
}

function spawnFood() {
  let tempFrame = real2d(spaces_frame);
  let y = randTo(default_frame.y - 1);
  let x = randTo(default_frame.x - 1);
  tempFrame[y][x] = "¤";
  game.graphics.food = { frame: tempFrame, foodPos: { x: x, y: y } };
}

function moveSpewkRand() {
  let y = 0;
  let x = 0;
  let rand = randTo(20) - 10;
  if (Math.abs(rand) >= 10) {
    y = rand / 10;
  }
  rand = randTo(20) - 10;
  if (Math.abs(rand) >= 10) {
    x = rand / 10;
  }
  //console.log("moving " + String(x) + " " + String(y))
  game.graphics.spewk = moveSprite(game.graphics.spewk, { x: x, y: y });
}

console.log(game);

async function renderFrames() {
  while (!idle) {
    await delay(refreshRate);
    console.log("Running...");
    mergeAndRender([
      game.graphics.background,
      game.graphics.food.frame,
      game.graphics.spewk,
    ]);
  }
}

async function spewkLives() {
  while (!idle) {
    await delay(500);
    if (game.data.intention == "none") {
      moveSpewkRand();
    }
    if (checkIfAte()) {
      spawnFood();
      gainXP();
    }
  }
}

async function updateInfo() {
  while (!idle) {
    await delay(5000);
    if (document.getElementById("play").checked) {
      idle = true;
    }
    console.log(game);
  }
}

function start() {
  idle = false;
  renderFrames();
  spewkLives();
  updateInfo();
}

start();
