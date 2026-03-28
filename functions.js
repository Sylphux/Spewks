/////////////////////////////////////////
// CHAT
/////////////////////////////////////////

function userSends(s) {
  // first input
  commandLineInput.value = "";
  let formattedMessage = formatUserMessage(s);
  if (formattedMessage == "") {
    return;
  }
  log("You: " + s);
  // Here goes all the funcs
  if (userCommand(formattedMessage)) {
    return; // if the message is a command, return (after command executed)
  }
}

function log(s) {
  // prints a string to the ingame terminal
  let lineJump = "<br>";
  if (terminalP.innerHTML == "") {
    lineJump = "";
  }
  terminalP.innerHTML = terminalP.innerHTML + lineJump + s;
}

function chatError() {
  log(game.data.name + ": ???");
}

function formatUserMessage(s) {
  s = s.trim();
  return s;
}

function getHelp() {
  // later add specific commands help
  let helpMessage = [
    narratorName + ": Here are some things you can ask your spewk...",
    " -'wander' gives you a code to send your spewk traveling.",
    " -'part ways' tells your friend to leave.",
    " -'reset' reset your world.",
    " -'i never loved you' is the worst thing to tell your spewk.",
    " - Paste a spewks code to invite a friend.",
  ].join("<br>");
  log(helpMessage);
}

function userCommand(s) {
  if (s == "tools") {
    toggleDevControls();
    return true;
  }
  if (s == "help") {
    getHelp();
    return true;
  }
  if (s == "part ways") {
    excludeGuest();
    return true;
  }
  if (s == "wander") {
    exportSpewk();
    return true;
  }
  if (s.indexOf("01581") == 0) {
    inviteSpewk(s);
    return true;
  }
  if (s == "reset") {
    reset();
    return true;
  }
  if (s == "i never loved you") {
    spewkFoundDead();
    return true;
  }
  if (scan(s, "hey") || scan(s, "hello") || scan(s, "!")) {
    log(game.data.name + ": Ihu!");
    playSound(sounds.spewkIhu);
  }
  return false; // returns false if not a command
}

function focusTerminal() {
  commandLineInput.focus();
}

/////////////////////////////////////////
// GRAPHICS
/////////////////////////////////////////

function centerSpewk() {
  let canvas = real2d(spacesFrame);
  let oldLayer = fake2d(layersArr[layers.spewk]);
  let oldYIndex = -1;
  let oldXIndex = -1;
  let destYindex = 6; // hardcode
  let destXindex = 13; // hardcode
  for (let [y, line] of oldLayer.entries()) {
    let index = line.indexOf(game.graphics.spewkFace);
    if (index != -1) {
      oldXIndex = index;
      oldYIndex = y;
      break;
    }
  }
  let displaceY = destYindex - oldYIndex;
  let displaceX = destXindex - oldXIndex;
  for (let [y, line] of oldLayer.entries()) {
    for (let [x, c] of line.split("").entries()) {
      if (c != " " && c != "" && c != undefined) {
        canvas[y + displaceY][x + displaceX] = c;
      }
    }
  }
  layersArr[layers.spewk] = canvas;
}

function updateLvGraphics() {
  let canvas = real2d(uiCanvas);
  let lv = String(game.data.level);
  let y = 13;
  let x = 3;
  for (let i = 0; i < lv.length; i++) {
    canvas[y][x + i] = lv[i];
  }
  if (game.data.availableUps > 0) {
    canvas[y][x + lv.length] = "+";
  }
  layersArr[layers.ui] = fake2d(canvas);
}

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

function moveSpewkRand(guest = false) {
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
  let movingLayer = layers.spewk;
  if (guest) {
    movingLayer = layers.guest;
  }
  let oldFrame = layersArr[movingLayer];
  layersArr[movingLayer] = moveSprite(oldFrame, { x: x, y: y });
  if (JSON.stringify(oldFrame) != JSON.stringify(layersArr[movingLayer])) {
    playSound(sounds.spewkSteps);
  }
}

function moveSprite(sprite, pos = { x: 0, y: 0 }, allowLeave = false) {
  let tempSprite = real2d(spacesFrame);
  let gotBlocked = false;
  for (y = 0; y < sprite.length; y++) {
    for (x = 0; x < sprite[y].length; x++) {
      let nextY = y + pos.y;
      let nextX = x + pos.x;
      if (
        nextY > -1 &&
        nextY < tempSprite.length &&
        nextX > -1 &&
        nextX < tempSprite[0].length
      ) {
        tempSprite[y + pos.y][x + pos.x] = sprite[y][x];
      } else if (sprite[y][x] != " ") {
        // console.log("Border collision detected");
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
    // console.log("Not allowing sprite out of the frame.");
    return sprite;
  }
  return tempSprite;
}

/////////////////////////////////////////
// USER ACTIONS
/////////////////////////////////////////

function pause() {
  idle = true;
}

async function exportSpewk() {
  let gameToExport = JSON.parse(JSON.stringify(game));
  gameToExport.guest = null;
  let gameString = JSON.stringify(gameToExport);
  gameString = crypt("spewk", gameString);
  try {
    await navigator.clipboard.writeText(gameString);
    log(narratorName + ": Copied to clipboard!");
  } catch (err) {
    log(gameString);
    log(narratorName + ": Spewks code ready to copy!");
  }
}

function inviteSpewk(s) {
  try {
    let guestObject = JSON.parse(decrypt("spewk", s));
    game.guest = guestObject;
    if (lookForGuest()) {
      log(game.guest.data.name + ": Hello!");
    }
  } catch {
    chatError();
  }
}

function excludeGuest() {
  if (game.guest == null) {
    chatError();
  }
  log(game.guest.data.name + ": Goodbye!");
  layersArr[layers.guest] = "";
  game.guest = null;
  console.log(layersArr);
  console.log(game);
}

/////////////////////////////////////////
// GAME ACTIONS
/////////////////////////////////////////

function levelUp() {
  game.data.level++;
  game.data.xp = 0;
  game.data.availableUps++;
  log(game.data.name + ": I'm itching...");
  updateLvGraphics();
}

function gainXP() {
  game.data.xp++;
  if (game.data.xp == game.data.level) {
    levelUp();
  }
}

function spawnFood(pos = null) {
  let tempFrame = real2d(spacesFrame);
  let y = -1;
  let x = -1;
  let ySafeZone = 2;
  let xSafeZone = 6;
  if (pos === null) {
    y = randTo(default_frame.y - 1 - 2 * ySafeZone) + ySafeZone;
    x = randTo(default_frame.x - 1 - 2 * xSafeZone) + xSafeZone;
  } else {
    y = pos["y"];
    x = pos["x"];
  }
  tempFrame[y][x] = foodAnim[0];
  layersArr[layers.food] = tempFrame;
  game.data.foodPos = { x: x, y: y };
}

function spewkFoundDead() {
  log(narratorName + ": Your spewk died of sadness.");
  game.data.alive = false;
  layersArr[layers.spewk] = tomb;
}

/////////////////////////////////////////
// CHECKS
/////////////////////////////////////////

function checkIfAte() {
  let spewk = layersArr[layers.spewk];
  let tempPos = game.data.foodPos;
  console.log();
  if (spewk[tempPos.y][tempPos.x] != " ") {
    log(game.data.name + ": Yum!");
    playSound(sounds.spewkEats);
    return true;
  }
  return false;
}

function lookForGuest() {
  if (game.guest == null) {
    return false;
  }
  layersArr[layers.guest] = game.guest.graphics.spewk;
  return true;
}

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

/////////////////////////////////////////
// GENERATORS
/////////////////////////////////////////

function getRandomBiome() {
  let availableBiomes = Object.keys(biomes);
  return availableBiomes[randTo(availableBiomes.length - 1)]; // string
}

function generateName() {
  return capitalize(
    randomSyllables[randTo(randomSyllables.length - 1)] +
      randomSyllables[randTo(randomSyllables.length - 1)],
  );
}

function drawNewSpewk(face = ";_;") {
  let baby = spewkBodies[randTo(spewkBodies.length - 1)];
  baby[6] = baby[6].replace("???", face);
  return baby;
}

/////////////////////////////////////////
// DATA MANAGEMENT
/////////////////////////////////////////

function loadLayers() {
  biomeFrames = biomes[game.graphics.background];
  layersArr[layers.bg] = biomes[game.graphics.background][0];
  layersArr[layers.spewk] = game.graphics.spewk;
  layersArr[layers.ui] = uiCanvas;
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

/////////////////////////////////////////
// SOUND MANAGEMENT
/////////////////////////////////////////

function toggleSound() {
  if (audioContext.state == "suspended") {
    audioContext.resume();
    document.getElementById("toggle_sound").innerHTML = soundOnString;
  } else {
    audioContext.suspend();
    document.getElementById("toggle_sound").innerHTML = soundOffString;
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
  try {
    await audioElement.play();
    document.getElementById("toggle_sound").innerHTML = soundOnString;
  } catch (err) {
    console.log("Error : " + err);
    if (audioContext.state == "suspended") {
      document.getElementById("toggle_sound").innerHTML = soundOffString;
    }
  }
}
