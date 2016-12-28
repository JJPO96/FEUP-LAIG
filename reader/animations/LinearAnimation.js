/*
    LinearAnimation constructor
*/
function LinearAnimation(id, controlPoints, time, scene){
  this.init(id);
  this.controlPoints = controlPoints;
  this.time = time;

  this.currentControlPoint = 0;
  this.intermediatePoint = 0;
  this.currentPoint = this.controlPoints[0];
  this.scene = scene;
  this.calculateVectors();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

/*
    Calculates movement vectors
*/
LinearAnimation.prototype.calculateVectors = function() {
    this.vectors = [];

    for(var i = 1; i < this.controlPoints.length; i++){
        var vect = [];
        vect[0] = this.controlPoints[i][0] - this.controlPoints[i - 1][0];
        vect[1] = this.controlPoints[i][1] - this.controlPoints[i - 1][1];
        vect[2] = this.controlPoints[i][2] - this.controlPoints[i - 1][2];
        this.vectors.push(vect);
    }

    this.increments = [];
    var time = this.time /(this.controlPoints.length - 1);

    for(var i = 0; i < this.vectors.length; i++){
        this.increments[i] = this.calculateIncrement(this.vectors[i], time);
    }
}

/*
    Calculates the value of the increment for each interaction
*/
LinearAnimation.prototype.calculateIncrement = function (vector, time) {
    var inc = [];
    inc[0] = vector[0]/(time);
    inc[1] = vector[1]/(time);
    inc[2] = vector[2]/(time);

    this.numAnimations = time;

    return inc;
};


/*
    Animates the scene according to the LinearAnimation
*/
LinearAnimation.prototype.animate = function() {
    var firstPoint = this.getTranslationMatrix(this.controlPoints[0][0], this.controlPoints[0][1], this.controlPoints[0][2]);
    this.scene.multMatrix(firstPoint);

    var xf, xi, zf, zi;
    var angle;
    if(this.currentControlPoint < this.controlPoints.length - 1){
    xf = this.controlPoints[this.currentControlPoint + 1][0];
    xi = this.controlPoints[this.currentControlPoint][0];
    zf = this.controlPoints[this.currentControlPoint + 1][2];
    zi = this.controlPoints[this.currentControlPoint][2];
    angle = Math.atan2( xf - xi,zf - zi);
    }
    else {
    angle = Math.atan2(this.vectors[this.vectors.length-1][0], this.vectors[this.vectors.length-1][2]);
    }

    var rot = this.getRotationMatrix("y", angle);



    if(this.currentControlPoint >= this.controlPoints.length - 1)
    {
        this.scene.translate(this.currentPoint[0],this.currentPoint[1], this.currentPoint[2]);
        this.scene.multMatrix(rot);
        return 1;
    }

    this.currentPoint[0] += this.increments[this.currentControlPoint][0] ;
    this.currentPoint[1] += this.increments[this.currentControlPoint][1] ;
    this.currentPoint[2] += this.increments[this.currentControlPoint][2] ;

    var matrix = this.getTranslationMatrix(this.currentPoint[0], this.currentPoint[1], this.currentPoint[2]);

    this.scene.multMatrix(matrix);
    this.intermediatePoint++;
    this.scene.multMatrix(rot);

    if(this.intermediatePoint > this.numAnimations){
        this.currentControlPoint++;
        this.intermediatePoint = 0;
    }

    return 0;
}
