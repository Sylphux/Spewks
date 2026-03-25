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
      //biomeFrame = biomeFrames[f];
      layersArr[layers.bg] = biomeFrames[f]
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
    console.log("Status : playing");
    play();
  } else {
    console.log("Status : paused");
  }
}

launch()