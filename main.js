// Processes

async function renderFrames() {
  while (!idle) {
    await delay(refreshRate);
    mergeAndRender();
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

async function animateMap() {
  let f = 0;
  while (!idle) {
    await delay(halfRefreshRate);
    if (f < biomeFrames.length) {
      layersArr[layers.bg] = biomeFrames[f];
      f++;
    } else {
      f = 0;
    }
  }
}

async function autoSave() {
  while (!idle) {
    await delay(autoSaveDelay);
    saveGame();
  }
}

async function animateItems() {
  while (!idle) {
    await delay(itemAnimSpeed);
    animateFood();
  }
}

// Run

function play() {
  idle = false;
  animateMap();
  animateItems();
  spewkLives();
  renderFrames();
  autoSave();
}

function playPause() {
  idle = !idle;
  launch();
}

function launch() {
  if (!idle) {
    console.log("Status : playing");
    play();
  } else {
    console.log("Status : paused");
  }
}

launch();
