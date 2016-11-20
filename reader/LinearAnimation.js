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

LinearAnimation.prototype.calculateIncrement = function (vector, time) {
    var inc = [];
    inc[0] = vector[0]/(this.scene.fps * time);
    inc[1] = vector[1]/(this.scene.fps * time);
    inc[2] = vector[2]/(this.scene.fps * time);

    this.numAnimations = this.scene.fps * time;

    return inc;
};

LinearAnimation.prototype.animate = function() {
    var firstPoint = this.getTranslationMatrix(this.controlPoints[0][0], this.controlPoints[0][1], this.controlPoints[0][2]);
    this.scene.multMatrix(firstPoint);

    if(this.currentControlPoint >= this.controlPoints.length - 1)
    {
        this.scene.translate(this.currentPoint[0],this.currentPoint[1], this.currentPoint[2]);
        return 1;
    }

    this.currentPoint[0] += this.increments[this.currentControlPoint][0] ;
    this.currentPoint[1] += this.increments[this.currentControlPoint][1] ;
    this.currentPoint[2] += this.increments[this.currentControlPoint][2] ;

    var matrix = this.getTranslationMatrix(this.currentPoint[0], this.currentPoint[1], this.currentPoint[2]);

    this.scene.multMatrix(matrix);
    this.intermediatePoint++;

    if(this.intermediatePoint > this.numAnimations){
        this.currentControlPoint++;
        this.intermediatePoint = 0;
    }



    return 0;
}