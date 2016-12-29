function getAvaiPos(currentPos, piece, tiles) {
    ret = [];
    if ((piece & 0b100000000) == 0b100000000)
        ret.push(new coord2D(currentPos.y - 1, currentPos.x + 1));

    if ((piece & 0b010000000) == 0b010000000)
        ret.push(new coord2D(currentPos.y, currentPos.x + 1));

    if ((piece & 0b001000000) == 0b001000000)
        ret.push(new coord2D(currentPos.y + 1, currentPos.x + 1));

    if ((piece & 0b000100000) == 0b000100000)
        ret.push(new coord2D(currentPos.y - 1, currentPos.x));

    if ((piece & 0b000010000) == 0b000010000)
        ret.push(new coord2D(currentPos.y, currentPos.x));

    if ((piece & 0b000001000) == 0b000001000)
        ret.push(new coord2D(currentPos.y + 1, currentPos.x));

    if ((piece & 0b000000100) == 0b000000100)
        ret.push(new coord2D(currentPos.y - 1, currentPos.x - 1));

    if ((piece & 0b000000010) == 0b000000010)
        ret.push(new coord2D(currentPos.y, currentPos.x - 1));

    if ((piece & 0b000000001) == 0b000000001)
        ret.push(new coord2D(currentPos.y + 1, currentPos.x - 1));

    ret = remCoordInv(ret, tiles);
    if (ret.length == 0) {
        ret.push(new coord2D(currentPos.y, currentPos.x));
    }
    return ret;
}

function remCoordInv(array, tiles) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].x >= 0 && array[i].x < 8 && array[i].y >= 0 && array[i].y < 8 && !(array[i].x == 0 && array[i].y == 0) && !(array[i].x == 0 && array[i].y == 7)){
          if (typeof tiles === 'undefined') {
              ret.push(array[i]);
          }else if (true) {
              if(tiles[array[i].y][array[i].x] != 0)
                ret.push(array[i]);
          }
        }

    }
    return ret;
}

function changeTo(type, value) {
    var testes = [
        [0, 0b000000000],
        [1, 0b111101111],
        [2, 0b111101111],
        [3, 0b111101111],
        [4, 0b111101111],
        [5, 0b010000110],
        [6, 0b001101000],
        [7, 0b010101000],
        [8, 0b000001101],
        [9, 0b010100100],
        [10, 0b010001001],
        [11, 0b000100011],
        [12, 0b001000101],
        [13, 0b111000000],
        [14, 0b001000011],
        [15, 0b000000111],
        [16, 0b110100000],
        [17, 0b100000011],
        [18, 0b101000010],
        [19, 0b010001010],
        [20, 0b110001000],
        [21, 0b101100000],
        [22, 0b100100100],
        [23, 0b110000100],
        [24, 0b010001100],
        [25, 0b000101001],
        [26, 0b001100100],
        [27, 0b100000101],
        [28, 0b001001001],
        [29, 0b000001011],
        [30, 0b010000101],
        [31, 0b000101010],
        [32, 0b001001100],
        [33, 0b000100101],
        [34, 0b011000001],
        [35, 0b100100010],
        [36, 0b100001100],
        [37, 0b001100001],
        [38, 0b000101100],
        [39, 0b110000010],
        [40, 0b010100010],
        [41, 0b010100001],
        [42, 0b100000110],
        [43, 0b110000001],
        [44, 0b011000010],
        [45, 0b100001010],
        [46, 0b100101000],
        [47, 0b100100001],
        [48, 0b010000011],
        [49, 0b001000110],
        [50, 0b001001010],
        [51, 0b100001001],
        [52, 0b011100000],
        [53, 0b011001000],
        [54, 0b000001110],
        [55, 0b101000001],
        [56, 0b101000100],
        [57, 0b011000100],
        [58, 0b000100110],
        [59, 0b001100010],
        [60, 0b101001000]
    ];

    if (type == 2) {
        for (var i = 0; i < testes.length; i++) {
            if (testes[i][0] == value)
                return testes[i][1];
        }
    } else if (type == 10) {
        for (var i = 0; i < testes.length; i++) {
            if (testes[i][1] == value)
                return testes[i][0];
        }
    }
}


function getTexturePath(binaryPiece) {
    var piece = changeTo(10, binaryPiece)
    return "textures/boardPieces/" + piece + ".png";
}

function getTileCoords(int) {
    var x = int % 8;
    var y = Math.floor(int / 8);
    return new coord2D(x, y);
}

function isIn(coord, coordArray) {
    for (var i = 0; i < coordArray.length; i++) {
        if (coord.x == coordArray[i].y && coord.y == coordArray[i].x)
            return true;
    }
    return false;
}
