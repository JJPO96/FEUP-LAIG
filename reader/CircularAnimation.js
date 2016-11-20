function CircularAnimation(id,time, center, radius, startang, rotang, scene){
  this.init(id);
  this.time = time;
  this.center = center;
  this.radius = radius;
  this.startang = startang;
  this.rotang = rotang;
  this.scene = scene;

  this.calculateValues();
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.calculateValues = function()
{
    var deg2Rad = Math.PI / 180;
    this.incangle = (this.rotang * deg2Rad) / (this.scene.fps * this.time);
    this.angle = this.startang *deg2Rad;
    this.rotang = this.rotang * deg2Rad;
    this.startang = this.startang * deg2Rad;
}


CircularAnimation.prototype.animate = function(){

    var mat1 = this.getTranslationMatrix(Math.sin(this.angle) * this.radius, 0 , Math.cos(this.angle)*this.radius);
    this.scene.multMatrix(mat1);
    var mat2 = this.getRotationMatrix("y", this.angle);
    this.scene.multMatrix(mat2);
    var mat3 = this.getTranslationMatrix(this.center[0], this.center[1], this.center[2]);
    this.scene.multMatrix(mat3);

    if(this.angle > this.startang + this.rotang)
        return 1;

    this.angle += this.incangle;
    return 0;
}