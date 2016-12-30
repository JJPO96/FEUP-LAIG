/**
 * MyPiece
 * @constructor
 * @param
 * scene: XMLscene where the piece will be created
 */
function MyPiece(scene, coord, appearence, pickID) {
    this.scene = scene;
    this.coord = coord;
    this.app = appearence;
    this.pickID = pickID;
    this.bodyT = new MyTorus(this.scene,0.15,0.2,30,30);
    this.bodyC = new MyCylinder(this.scene, 0.17, 0, 1, 30,30);
    this.bodyS = new MySphere(this.scene, 0.15, 30,30);
    this.type = "piece" + (pickID-100);

    this.texture = new CGFappearance(this.scene);
    this.texture.setAmbient(0, 0, 0, 1);
    this.texture.setDiffuse(0.2, 0.2, 0.2, 1);
    this.texture.setSpecular(0.2, 0.2, 0.2, 1);
    this.texture.setShininess(50);
    if (appearence == 0) {
    this.texture.setDiffuse(0.2, 0.2, 0.5, 1);
    this.texture.setSpecular(0.2, 0.2, 0.5, 1);
      this.texture.loadTexture("textures/boardPieces/pieceBlue.png");
    }else if (appearence == 1) {
    this.texture.setDiffuse(0.5, 0.2, 0.2, 1);
    this.texture.setSpecular(0.5, 0.2, 0.2, 1);
      this.texture.loadTexture("textures/boardPieces/pieceRed.png");
    }

};

MyPiece.prototype = Object.create(CGFnurbsObject.prototype);
MyPiece.prototype.constructor = MyPiece;

MyPiece.prototype.movePiece = function(x,y) {
  this.coord.x = x;
  this.coord.y = y;
}

MyPiece.prototype.display = function() {
  this.scene.registerForPick(this.pickID,this);
  this.scene.pushMatrix();
  this.scene.translate(-3.5+this.coord.y,0.30,-3.5+this.coord.x);
  this.scene.rotate(Math.PI/2,1,0,0);
  this.texture.apply();
  this.bodyT.display();
  this.scene.rotate(Math.PI,1,0,0);
  this.bodyC.display();
  this.scene.translate(0,0,0.9);
  this.bodyS.display();
  this.scene.popMatrix();
}
