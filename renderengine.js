// Renders a fake 2d arr to the view
function renderFrame(arr){
    view = document.getElementById('rendered_frame')
    view.innerHTML = arr.join('\n')
}

// turns arr of strings into arr of arr
function real2d(arr){
    return arr.map(string => string.split(''))
}

// turns arr of arr into arr of strings
function fake2d(arr){
    return arr.map(string => string.join(''))
}

function mergeFrames(framesArr){
    let result = real2d(spaces_frame)
    for (let currentFrame of framesArr){
        for (y = 0; y < result.length; y++){
            for (x = 0; x < currentFrame[y].length; x++){
                if (currentFrame[y][x] != ' '){
                    result[y][x] = currentFrame[y][x]
                }
            }
        }
    }
    return fake2d(result)
}

function mergeAndRender(framesArr){
    renderFrame(mergeFrames(framesArr))
}