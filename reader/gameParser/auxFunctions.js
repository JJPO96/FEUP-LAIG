function getAvaiPos(currentPos, piece) {

    ret = [];
    if ((piece & 0b100000000) == 0b100000000)
        ret.push(new coord2D(currentPos.x - 1, currentPos.y + 1));

    if ((piece & 0b010000000) == 0b010000000)
        ret.push(new coord2D(currentPos.x, currentPos.y + 1));

    if ((piece & 0b001000000) == 0b001000000)
        ret.push(new coord2D(currentPos.x + 1, currentPos.y + 1));

    if ((piece & 0b000100000) == 0b000100000)
        ret.push(new coord2D(currentPos.x - 1, currentPos.y));

    if ((piece & 0b000010000) == 0b000010000)
        ret.push(new coord2D(currentPos.x, currentPos.y));

    if ((piece & 0b000001000) == 0b000001000)
        ret.push(new coord2D(currentPos.x + 1, currentPos.y));

    if ((piece & 0b000000100) == 0b000000100)
        ret.push(new coord2D(currentPos.x - 1, currentPos.y - 1));

    if ((piece & 0b000000010) == 0b000000010)
        ret.push(new coord2D(currentPos.x, currentPos.y - 1));

    if ((piece & 0b000000001) == 0b000000001)
        ret.push(new coord2D(currentPos.x + 1, currentPos.y - 1));

    ret = remCoordInv(ret);

    return ret;
}

function remCoordInv(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].x >= 0 && array[i].x <= 8 && 0 <= array[i].y >= 0 && array[i].y <= 8)
            ret.push(array[i]);
    }
    return ret;
}
