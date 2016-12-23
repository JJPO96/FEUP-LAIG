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
    this.quad = new MyPlane(this.scene,1,1,10,10),
    this.bottom = new MyPlane(this.scene,8,8,10,10);
    this.side = new MyPlane(this.scene,8,0.5,10,10);

    console.log(this.quad);
    console.log("CENAS");
    console.log(changeTo(2,6));


};

TrippplesBoard.prototype = Object.create(CGFobject.prototype);
TrippplesBoard.prototype.constructor = TrippplesBoard;

TrippplesBoard.prototype.display = function() {
  this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2,1,0,0);
    this.bottom.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0,0.25,4);
    this.side.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2,0,1,0);
    this.scene.translate(0,0.25,4);
    this.side.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.rotate(Math.PI,0,1,0);
    this.scene.translate(0,0.25,4);
    this.side.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,0,1,0);
    this.scene.translate(0,0.25,4);
    this.side.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0,0.5,0);
    this.scene.rotate(-Math.PI/2,1,0,0);
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        this.scene.pushMatrix();
          this.scene.translate(-3.5+i,-3.5+j,0);
          this.quad.display();
        this.scene.popMatrix();
      }
    }
    this.scene.popMatrix();

getTexture(0b100100100);
};
