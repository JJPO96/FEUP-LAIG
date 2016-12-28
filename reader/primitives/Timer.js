/**
 * Timer
 * @constructor
 * @param
 * scene: XMLscene where the cyllinder will be created
 * base: radius of the base of the cyllinder
 * top: radius of the top of the cyllinder
 * top: height of the cyllinder
 * slices: number of slices used to draw the sphere
 * loops: number of loops used to draw the sphere
 */
function Timer(scene) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.side = new MyPlane(scene,12,4,2,2);
    this.bottom = new MyPlane(scene,12,8*Math.sin(Math.PI/6),2,2);
    this.triangle = new MyTriangle(scene,6,0,4*Math.sin(Math.PI/6),6,0,-4*Math.sin(Math.PI/6),6,4*Math.cos(Math.PI/6),0)

};

Timer.prototype = Object.create(CGFobject.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.update = function(time){
  console.log(time);
}

Timer.prototype.display = function() {
  if (this.scene.board.ambient == 'Wood') {
      this.scene.board.woodBottomBoard.apply();
  } else if (this.scene.board.ambient == 'Marble') {
      this.scene.board.marbleBottomBoard.apply();
  }

  this.scene.pushMatrix();
  this.scene.rotate(Math.PI,0,1,0);
  this.scene.translate(0,2*Math.cos(Math.PI/6),2*Math.sin(Math.PI/6));
  this.scene.rotate(-Math.PI/6,1,0,0);
  this.side.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0,2*Math.cos(Math.PI/6),2*Math.sin(Math.PI/6));
  this.scene.rotate(-Math.PI/6,1,0,0);
  this.side.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.rotate(Math.PI/2,1,0,0);
  this.bottom.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.triangle.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.rotate(Math.PI,0,1,0);
  this.triangle.display();
  this.scene.popMatrix();
};
