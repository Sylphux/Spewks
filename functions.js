function saveGame(){
  console.log("Saving to local storage...")
  save("savedGame", game)
}

function loadGame(){
  temp = load("savedGame")
  if (temp != null){
    game = temp
    console.log("Loaded save from local storage.")
    return true
  }
  console.log("Nothing to load.")
  return false
}

function pause() {
  idle = true;
}

// turns arr of strings into arr of arr
function real2d(arr) {
  return arr.map((string) => string.split(""));
}

// turns arr of arr into arr of strings
function fake2d(arr) {
  return arr.map((string) => string.join(""));
}

function getRandomBiome() { // gets a random biome name
  let availableBiomes = Object.keys(biomes);
  console.log("Available biomes : " + availableBiomes);
  return availableBiomes[randTo(availableBiomes.length - 1)];
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

function spawnFood() { // randomly resets a food on the map
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
  game.graphics.spewk = moveSprite(game.graphics.spewk, { x: x, y: y });
}

// pos is x: y: object
function moveSprite(sprite, pos, allowLeave = false) {
  let tempSprite = real2d(spaces_frame);
  let gotBlocked = false;
  for (y = 0; y < sprite.length; y++) {
    for (x = 0; x < sprite[y].length; x++) {
      let nextY = y + pos.y;
      let nextX = x + pos.x;
      // only write in new frame if in frame
      if (
        nextY > -1 &&
        nextY < tempSprite.length &&
        nextX > -1 &&
        nextX < tempSprite[0].length
      ) {
        tempSprite[y + pos.y][x + pos.x] = sprite[y][x];
      } else if (sprite[y][x] != " ") {
        console.log("Border collision detected");
        gotBlocked = true;
        break;
      }
    }
    if (gotBlocked) {
      break;
    }
  }
  if (!allowLeave && gotBlocked) {
    console.log("Not allowing sprite out of the frame.");
    return sprite;
  }
  return tempSprite;
}