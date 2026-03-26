// Saving and loading

function loadLayers() {
  layersArr[layers.bg] = biomes[game.graphics.background][0];
  layersArr[layers.spewk] = game.graphics.spewk;
}

function saveLayers() {
  game.graphics.spewk = layersArr[layers.spewk];
}

function saveGame() {
  saveLayers();
  save("savedGame", game);
}

function reset() {
  localStorage.clear("savedGame");
  location.reload();
}

// Sound

function toggleSound() {
  if (audioContext.state == "suspended") {
    audioContext.resume();
    document.getElementById("toggle_sound").innerHTML = "🕪";
  } else {
    audioContext.suspend();
    document.getElementById("toggle_sound").innerHTML = "🕨";
  }
}

async function playSound(soundArr) {
  let soundName = "";
  let paramType = typeof soundArr;
  if (paramType == "array" || paramType == "object") {
    soundName = soundArr[randTo(soundArr.length - 1)];
  } else if (typeof soundArr == "string") {
    soundName = soundArr;
  } else {
    console.log("Not a valid sound");
    return;
  }
  audioElement = document.getElementById(soundName);
  if (!audioElement._sourceNode) {
    audioElement._sourceNode =
      audioContext.createMediaElementSource(audioElement);
    audioElement._sourceNode.connect(audioContext.destination);
  }
  audioElement.currentTime = 0;
  let soundError = false;
  audioElement.play();
  if (audioContext.state == "running") {
    document.getElementById("toggle_sound").innerHTML = "🕪";
  } else {
    document.getElementById("toggle_sound").innerHTML = "🕨";
  }
}

// Game state

function pause() {
  idle = true;
}

// Animation

function animateFood() {
  let pos = game.data.foodPos;
  let actualChar = layersArr[layers.food][pos["y"]][pos["x"]];
  if (actualChar == foodAnim.at(-1)) {
    layersArr[layers.food][pos["y"]][pos["x"]] = foodAnim[0];
  } else {
    for (let [i, c] of foodAnim.entries()) {
      if (actualChar == c) {
        layersArr[layers.food][pos["y"]][pos["x"]] = foodAnim[i + 1];
        break;
      }
    }
  }
}

// Game actions

function gainXP() {
  game.data.xp++;
  if (game.data.xp == game.data.level) {
    game.data.level++;
    game.data.xp = 0;
    game.data.availableUps++;
    console.log("### Spewk : I'm itching...");
  }
}

function spawnFood(pos = null) {
  let tempFrame = real2d(spaces_frame);
  let y = 0;
  let x = 0;
  if (pos === null) {
    y = randTo(default_frame.y - 1);
    x = randTo(default_frame.x - 1);
  } else {
    console.log(pos);
    y = pos["y"];
    x = pos["x"];
  }
  tempFrame[y][x] = foodAnim[0];
  layersArr[layers.food] = tempFrame;
  game.data.foodPos = { x: x, y: y };
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
  let oldFrame = layersArr[layers.spewk];
  layersArr[layers.spewk] = moveSprite(oldFrame, { x: x, y: y });
  if (JSON.stringify(oldFrame) != JSON.stringify(layersArr[layers.spewk])) {
    playSound(sounds.spewkSteps);
  }
}

function moveSprite(sprite, pos = { x: 0, y: 0 }, allowLeave = false) {
  let tempSprite = real2d(spaces_frame);
  let gotBlocked = false;
  for (y = 0; y < sprite.length; y++) {
    for (x = 0; x < sprite[y].length; x++) {
      let nextY = y + pos.y;
      let nextX = x + pos.x;
      if (
        // only write in new frame if index exists
        nextY > -1 &&
        nextY < tempSprite.length &&
        nextX > -1 &&
        nextX < tempSprite[0].length
      ) {
        tempSprite[y + pos.y][x + pos.x] = sprite[y][x];
      } else if (sprite[y][x] != " ") {
        console.log("Border collision detected");
        gotBlocked = true;
        if (!allowLeave) {
          break;
        }
      }
    }
    if (gotBlocked && !allowLeave) {
      break;
    }
  }
  if (!allowLeave && gotBlocked) {
    console.log("Not allowing sprite out of the frame.");
    return sprite;
  }
  return tempSprite;
}

function spewkFoundDead() {
  console("Your spewk died of sadness.");
  game.data.alive = false;
}

// Checks

function checkIfAte() {
  let spewk = layersArr[layers.spewk];
  let tempPos = game.data.foodPos;
  console.log();
  if (spewk[tempPos.y][tempPos.x] != " ") {
    console.log("Spewk ate some food!");
    playSound(sounds.spewkEats);
    return true;
  }
  return false;
}

// Other utils

function getRandomBiome() {
  let availableBiomes = Object.keys(biomes);
  console.log("Available biomes : " + availableBiomes);
  return availableBiomes[randTo(availableBiomes.length - 1)]; // string
}
