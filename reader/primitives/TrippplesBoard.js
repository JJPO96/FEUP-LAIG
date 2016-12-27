/**
 * TrippplesBoard
 * @constructor
 * @param
 * scene: XMLscene where the chessboard will be created
 * du: number X parts of the base plane
 * dv: number Y parts of the base plane
 * texture: texture to be applied to the base plane
 * su: number of interpolations to be made between U points
 * sv: number of interpolations to be made between V points
 * c1: color 1
 * c2: color 2
 * cs: color of the selected square
 */
function TrippplesBoard(scene, pieces, ambient) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.pieces = pieces;
    this.lastPlay = 2;
    //REMOVER
    this.pieces = [
        [2, 5, 6, 7, 8, 9, 10, 3],
        [11, 12, 13, 14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23, 24, 25, 26],
        [27, 28, 29, 0, 30, 44, 31, 32],
        [33, 34, 35, 0, 0, 36, 37, 38],
        [39, 40, 41, 42, 43, 0, 45, 46],
        [47, 48, 49, 50, 51, 52, 53, 54],
        [4, 55, 56, 57, 58, 59, 60, 1]
    ]
    this.quad = new MyPlane(this.scene, 1, 1, 10, 10),
        this.bottom = new MyPlane(this.scene, 9, 9, 10, 10);
    this.side = new MyPlane(this.scene, 9, 0.5, 10, 10);

    this.defaultApp = new CGFappearance(this.scene);
    this.defaultApp.setAmbient(0.3, 0.3, 0.3, 1);
    this.defaultApp.setDiffuse(0.2, 0.2, 0.2, 1);
    this.defaultApp.setSpecular(0.2, 0.2, 0.2, 1);
    this.defaultApp.setShininess(20);

    this.boardQuad = new CGFappearance(this.scene);
    this.boardQuad.setAmbient(0.3, 0.3, 0.3, 1);
    this.boardQuad.setDiffuse(0.2, 0.2, 0.2, 1);
    this.boardQuad.setSpecular(0.2, 0.2, 0.2, 1);
    this.boardQuad.setShininess(20);

    this.sideBoard = new CGFappearance(this.scene);
    this.sideBoard.setAmbient(0.3, 0.3, 0.3, 1);
    this.sideBoard.setDiffuse(0.2, 0.2, 0.2, 1);
    this.sideBoard.setSpecular(0.2, 0.2, 0.2, 1);
    this.sideBoard.setShininess(20);
    if (ambient == 0)
        this.sideBoard.loadTexture("textures/boardPieces/woodSide.png");
    else if (ambient == 1)
        this.sideBoard.loadTexture("textures/boardPieces/marbleSide.png");


    this.bottomBoard = new CGFappearance(this.scene);
    this.bottomBoard.setAmbient(0.3, 0.3, 0.3, 1);
    this.bottomBoard.setDiffuse(0.2, 0.2, 0.2, 1);
    this.bottomBoard.setSpecular(0.2, 0.2, 0.2, 1);
    this.bottomBoard.setShininess(120);
    if (ambient == 0)
        this.bottomBoard.loadTexture("textures/boardPieces/woodBottom.png");
    else if (ambient == 1)
        this.bottomBoard.loadTexture("textures/boardPieces/marbleBottom.png");

    this.piecesText = this.loadPiecesText(this.pieces);
    this.piece1 = new MyPiece(this.scene, new coord2D(0, 7), 0, 101);
    this.piece2 = new MyPiece(this.scene, new coord2D(7, 7), 1, 102);
};


TrippplesBoard.prototype = Object.create(CGFobject.prototype);
TrippplesBoard.prototype.constructor = TrippplesBoard;

TrippplesBoard.prototype.loadPiecesText = function() {
    var ret = new Array(8);
    var x = 0;
    for (var i = 0; i < ret.length; i++) {
        ret[i] = new Array(8);
        for (var j = 0; j < ret.length; j++) {
            var tempApp = new CGFappearance(this.scene);
            tempApp.setAmbient(0, 0, 0, 1);
            tempApp.setDiffuse(0.5, 0.5, 0.5, 1);
            tempApp.setSpecular(0.5, 0.5, 0.5, 1);
            tempApp.setShininess(120);
            tempApp.loadTexture("textures/boardPieces/" + this.pieces[i][j] + ".png");
            ret[i][j] = tempApp;
        }
    }
    return ret;
}

TrippplesBoard.prototype.highlightTiles = function(tiles) {
    for (var i = 0; i < tiles.length; i++) {
        var tempX = tiles[i].x;
        var tempY = tiles[i].y;

        var tempApp = new CGFappearance(this.scene);
        tempApp.setAmbient(0.5, 0.5, 0.5, 1);
        tempApp.setDiffuse(0.5, 0.5, 0.5, 1);
        tempApp.setSpecular(0.5, 0.5, 0.5, 1);
        tempApp.setShininess(120);
        tempApp.loadTexture("textures/boardPieces/" + this.pieces[tempY][tempX] + ".png");
        this.piecesText[tempY][tempX] = tempApp;
    }
}

TrippplesBoard.prototype.restoreTiles = function(tiles) {
    for (var i = 0; i < tiles.length; i++) {
        var tempX = tiles[i].x;
        var tempY = tiles[i].y;

        var tempApp = new CGFappearance(this.scene);
        tempApp.setAmbient(0, 0, 0, 1);
        tempApp.setDiffuse(0.5, 0.5, 0.5, 1);
        tempApp.setSpecular(0.5, 0.5, 0.5, 1);
        tempApp.setShininess(120);
        tempApp.loadTexture("textures/boardPieces/" + this.pieces[tempY][tempX] + ".png");
        this.piecesText[tempY][tempX] = tempApp;
    }
}

TrippplesBoard.prototype.makePlay = function() {
    this.tempCoord;
    this.tempCh;
    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj) {
                    var customId = this.scene.pickResults[i][1];
                    if (obj.type == "piece1" && this.lastPlay == 2) {
                        this.tempCoord = new coord2D(this.piece1.coord.x, this.piece1.coord.y);
                        this.tempCh = changeTo(2, this.pieces[this.piece2.coord.x][this.piece2.coord.y]);
                        this.highlightTiles(getAvaiPos(this.tempCoord, this.tempCh));
                      //  this.restoreTiles(getAvaiPos(this.tempCoord, this.tempCh));
                        this.lastPlay = 1;
                    } else if (obj.type == "piece2" && this.lastPlay == 1) {
                        this.tempCoord = new coord2D(this.piece2.coord.x, this.piece2.coord.y);
                        this.tempCh = changeTo(2, this.pieces[this.piece1.coord.x][this.piece1.coord.y]);
                        this.highlightTiles(getAvaiPos(this.tempCoord, this.tempCh));
                        this.lastPlay = 2;
                    } else if (obj.type != "piece1" && obj.type != "piece2") {
                      console.log(getTileCoords(customId));
                    }
                    console.log("pick id " + customId);
                }
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
        }
    }
}

TrippplesBoard.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.registerForPick(200, this);
    this.bottomBoard.apply();
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.bottom.display();
    this.scene.popMatrix();
    //sides
    this.scene.pushMatrix();
    this.sideBoard.apply();
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4.5);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4.5);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4.5);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4.5);
    this.side.display();
    this.scene.popMatrix();
    //top sides
    this.scene.pushMatrix();
    this.sideBoard.apply();
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.5, 4.25);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.sideBoard.apply();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.5, 4.25);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.sideBoard.apply();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.5, 4.25);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.sideBoard.apply();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.5, 4.25);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.side.display();
    this.scene.popMatrix();

    this.defaultApp.apply();

    this.scene.pushMatrix();
    this.scene.translate(0, 0.5, 0);
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            this.scene.pushMatrix();
            this.scene.translate(-3.5 + i, 0, -3.5 + j);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.scene.registerForPick(i * 8 + j, this);
            this.piecesText[j][i].apply();
            this.quad.display();
            this.scene.popMatrix();
        }
    }
    this.scene.popMatrix();

    this.piece1.display();
    this.piece2.display();

};
