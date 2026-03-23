// Renders a fake 2d arr to the view
function renderFrame(arr) {
  view = document.getElementById("rendered_frame");
  view.innerHTML = arr.join("\n");
}

//merges multiple 2d arrays into one by order, like layers
function mergeFrames(framesArr) {
  let result = real2d(spaces_frame); // transform into arr of arr to write in
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

// main rendering function
function mergeAndRender(framesArr) {
  renderFrame(mergeFrames(framesArr));
}
