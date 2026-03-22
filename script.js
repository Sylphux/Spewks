mergeAndRender([spaces_frame, guy_frame, shape_frame])

function moveSprite(sprite, pos){
    let tempSprite = real2d(spaces_frame)
    for (y = 0; y < sprite.length; y++){
        for (x = 0; x < sprite[y].length; x++){
            let nextY = y + pos.y;
            let nextX = x + pos.x;
            if (nextY > -1 && nextY < tempSprite.length && nextX > -1 && nextX < tempSprite[0].length){
                tempSprite[y + pos.y][x + pos.x] = sprite[y][x]
            }
        }
    }
    //return fake2d(tempSprite)
    return tempSprite
}