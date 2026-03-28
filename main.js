/////////////////////////////////////////
// PROCESSES
/////////////////////////////////////////

async function renderFrames() {
  while (!idle) {
    mergeAndRender();
    await delay(refreshRate);
  }
}

async function spewkLives() {
  while (!idle && game.data.alive) {
    if (game.data.intention == "none") {
      moveSpewkRand();
    }
    if (game.guest != null) {
      moveSpewkRand(true); // true param moves the guest
    }
    if (checkIfAte()) {
      spawnFood();
      gainXP();
    }
    await delay(500);
  }
}

async function animateMap() {
  let f = 0;
  while (!idle) {
    if (f < biomeFrames.length) {
      layersArr[layers.bg] = biomeFrames[f];
      f++;
    } else {
      f = 0;
    }
    await delay(halfRefreshRate);
  }
}

async function autoSave() {
  while (!idle) {
    saveGame();
    await delay(autoSaveDelay);
  }
}

async function animateItems() {
  while (!idle) {
    animateFood();
    await delay(itemAnimSpeed);
  }
}

/////////////////////////////////////////
// TOP LEVEL STATUS FUNCTIONS
/////////////////////////////////////////

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

/////////////////////////////////////////
// LISTENERS
/////////////////////////////////////////

commandLineInput.addEventListener("keydown", (event) => {
  const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
  if (key === "Enter") {
    userSends(commandLineInput.value);
  }
  if (key === "ArrowUp" || key === "ArrowDown") {
    navThroughLastMessages(key);
  }
});

/////////////////////////////////////////
// EXECUTE
/////////////////////////////////////////

launch();

// upgradeSpewk();
