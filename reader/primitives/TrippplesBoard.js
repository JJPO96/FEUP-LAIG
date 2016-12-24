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
function TrippplesBoard(scene, pieces) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.pieces = pieces;
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

    this.sideWood = new CGFappearance(this.scene);
    this.sideWood.setAmbient(0.3, 0.3, 0.3, 1);
    this.sideWood.setDiffuse(0.2, 0.2, 0.2, 1);
    this.sideWood.setSpecular(0.2, 0.2, 0.2, 1);
    this.sideWood.setShininess(120);
    this.sideWood.loadTexture("textures/boardPieces/woodSide.png");

    this.bottomWood = new CGFappearance(this.scene);
    this.bottomWood.setAmbient(0.3, 0.3, 0.3, 1);
    this.bottomWood.setDiffuse(0.2, 0.2, 0.2, 1);
    this.bottomWood.setSpecular(0.2, 0.2, 0.2, 1);
    this.bottomWood.setShininess(120);
    this.bottomWood.loadTexture("textures/boardPieces/woodBottom.png");

    this.piecesText = this.loadPiecesText(this.pieces);
    console.log(this.piecesText);
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
      tempApp.loadTexture("textures/boardPieces/" + (22+i+j) + ".png");
      ret[i][j] = tempApp;
    }
  }
  return ret;
}

TrippplesBoard.prototype.display = function() {
    this.scene.pushMatrix();
    this.bottomWood.apply();
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.bottom.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.sideWood.apply();
    this.scene.translate(0, 0.25, 4);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.translate(0, 0.25, 4);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.translate(0, 0.25, 4);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.translate(0, 0.25, 4);
    this.side.display();
    this.scene.popMatrix();

    this.defaultApp.apply();

    this.scene.pushMatrix();
    this.scene.translate(0, 0.5, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            this.scene.pushMatrix();
            this.scene.translate(-3.5 + i, -3.5 + j, 0);
            this.piecesText[j][i].apply();
            this.quad.display();
            this.scene.popMatrix();
        }
    }
    this.scene.popMatrix();


};
