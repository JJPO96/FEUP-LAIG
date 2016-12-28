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
    return ret;
}

function remCoordInv(array, tiles) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].x >= 0 && array[i].x < 8 && array[i].y >= 0 && array[i].y < 8){
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
        [0, 0b000010000],
        [1, 0b111111111],
        [2, 0b111111111],
        [3, 0b111111111],
        [4, 0b111111111],
        [5, 0b010010110],
        [6, 0b001111000],
        [7, 0b010111000],
        [8, 0b000011101],
        [9, 0b010110100],
        [10, 0b010011001],
        [11, 0b000110011],
        [12, 0b001010101],
        [13, 0b111010000],
        [14, 0b001010011],
        [15, 0b000010111],
        [16, 0b110110000],
        [17, 0b100010011],
        [18, 0b101010010],
        [19, 0b010011010],
        [20, 0b110011000],
        [21, 0b101110000],
        [22, 0b100110100],
        [23, 0b110010100],
        [24, 0b010011100],
        [25, 0b000111001],
        [26, 0b001110100],
        [27, 0b100010101],
        [28, 0b001011001],
        [29, 0b000011011],
        [30, 0b010010101],
        [31, 0b000111010],
        [32, 0b001011100],
        [33, 0b000110101],
        [34, 0b011010001],
        [35, 0b100110010],
        [36, 0b100011100],
        [37, 0b001110001],
        [38, 0b000111100],
        [39, 0b110010010],
        [40, 0b010110010],
        [41, 0b010110001],
        [42, 0b100010110],
        [43, 0b110010001],
        [44, 0b011010010],
        [45, 0b100011010],
        [46, 0b100111000],
        [47, 0b100110001],
        [48, 0b010010011],
        [49, 0b001010110],
        [50, 0b001011010],
        [51, 0b100011001],
        [52, 0b011110000],
        [53, 0b011011000],
        [54, 0b000011110],
        [55, 0b101010001],
        [56, 0b101010100],
        [57, 0b011010100],
        [58, 0b000110110],
        [59, 0b001110010],
        [60, 0b101011000]
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
