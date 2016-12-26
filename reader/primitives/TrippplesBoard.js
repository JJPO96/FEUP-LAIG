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
    //REMOVER
    this.pieces = [
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8]
    ]
    this.quad = new MyPlane(this.scene, 1, 1, 10, 10),
        this.bottom = new MyPlane(this.scene, 8, 8, 10, 10);
    this.side = new MyPlane(this.scene, 8, 0.5, 10, 10);

    this.defaultApp = new CGFappearance(this.scene);
    this.defaultApp.setAmbient(0.3, 0.3, 0.3, 1);
    this.defaultApp.setDiffuse(0.2, 0.2, 0.2, 1);
    this.defaultApp.setSpecular(0.2, 0.2, 0.2, 1);
    this.defaultApp.setShininess(120);

    this.boardQuad = new CGFappearance(this.scene);
    this.boardQuad.setAmbient(0.3, 0.3, 0.3, 1);
    this.boardQuad.setDiffuse(0.2, 0.2, 0.2, 1);
    this.boardQuad.setSpecular(0.2, 0.2, 0.2, 1);
    this.boardQuad.setShininess(120);

    this.sideBoard = new CGFappearance(this.scene);
    this.sideBoard.setAmbient(0.3, 0.3, 0.3, 1);
    this.sideBoard.setDiffuse(0.2, 0.2, 0.2, 1);
    this.sideBoard.setSpecular(0.2, 0.2, 0.2, 1);
    this.sideBoard.setShininess(120);
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
    this.piece1 = new MyPiece(this.scene, new coord2D(1, 1), 0, 101);
    this.piece2 = new MyPiece(this.scene, new coord2D(4, 2), 1, 102);
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
            tempApp.setAmbient(0.3, 0.3, 0.3, 1);
            tempApp.setDiffuse(0.2, 0.2, 0.2, 1);
            tempApp.setSpecular(0.2, 0.2, 0.2, 1);
            tempApp.setShininess(120);
            tempApp.loadTexture("textures/boardPieces/" + this.pieces[i][j] + ".png");
            ret[i][j] = tempApp;
        }
    }
    return ret;
}

TrippplesBoard.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.registerForPick(200, this);
    this.bottomBoard.apply();
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.bottom.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.sideBoard.apply();
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4);
    this.side.display();
    this.scene.popMatrix();

    this.defaultApp.apply();

    this.scene.pushMatrix();
    this.scene.translate(0, 0.5, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    var pickID = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            this.scene.pushMatrix();
            this.scene.translate(-3.5 + i, -3.5 + j, 0);
            this.scene.registerForPick(pickID, this);
            pickID++;
            this.piecesText[j][i].apply();
            this.quad.display();
            this.scene.popMatrix();
        }
    }
    this.scene.popMatrix();

    this.piece1.display();
    this.piece2.display();

};
