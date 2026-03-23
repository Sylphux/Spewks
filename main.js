// Processes

async function renderFrames() {
  while (!idle) {
    await delay(refreshRate);
    let framesToRender = [
      biomeFrame,
      game.graphics.food.frame,
      game.graphics.spewk,
    ];
    mergeAndRender(framesToRender);
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
      biomeFrame = biomeFrames[f];
      f++;
    } else {
      f = 0;
    }
  }
}

async function autoSave() {
  while (!idle) {
    await delay(autoSaveDelay);
    saveGame()
  }
}

// Run

function play() {
  idle = false;
  animateMap();
  spewkLives();
  renderFrames();
  autoSave()
}

function playPause() {
  idle = !idle;
  launch();
}

function launch() {
  if (!idle) {
    console.log("Playing");
    play();
  } else {
    console.log("Paused");
  }
}

launch();
