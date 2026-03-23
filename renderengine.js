// Renders a fake 2d arr to the view
function renderFrame(arr) {
  view = document.getElementById("rendered_frame");
  view.innerHTML = arr.join("\n");
}

// turns arr of strings into arr of arr
function real2d(arr) {
  return arr.map((string) => string.split(""));
}

// turns arr of arr into arr of strings
function fake2d(arr) {
  return arr.map((string) => string.join(""));
}

//merges multiple 2d arrays into one by order, like layers
function mergeFrames(framesArr) {
  let result = real2d(spaces_frame);
  for (let currentFrame of framesArr) {
    for (y = 0; y < result.length; y++) {
      for (x = 0; x < currentFrame[y].length; x++) {
        if (currentFrame[y][x] != " ") {
          result[y][x] = currentFrame[y][x];
        }
      }
    }
  }
  return fake2d(result);
}

// pos is an object with a x and a y value to move.
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

function mergeAndRender(framesArr) {
  renderFrame(mergeFrames(framesArr));
}
