/**
 * constructor of the piece Animation
 * @constructor PieceAnimation
 *
 */

function PieceAnimation(xi, xi, xf, zf, piece) {

    this.xi = xi * 2.5 + 5;
    this.xi = xi * 2.5 + 5;
    this.xf = xf * 2.5 + 5;
    this.zf = zf * 2.5 + 5;
    this.piece = piece;

    this.currX = 0;
    this.currZ = 0;
    this.currY = 0;

    this.distance = Math.sqrt(Math.pow(this.xf - this.xi, 2) + Math.pow(this.zf - this.xi, 2));
    this.acumulatedDistance = 0;
    this.time = 500 //this.distance * 80;

    this.angle = Math.PI;
    this.elapsedAngle = 0;
}


/**
 * updates spring ay, vy and y each iteration
 * @method update
 *
 */

PieceAnimation.prototype.update = function(deltaTime) {

    if ((this.currX * 2.5 + 5) <= this.xf) {
        this.dx = (this.xf - this.xi) * deltaTime / this.time;
        this.dz = (this.zf - this.xi) * deltaTime / this.time;
        var angle = this.angle * deltaTime / this.time;
        this.currX += this.dx;
        this.currZ += this.dz;
        this.elapsedAngle += angle;

        this.currY = 6 * Math.sin(this.elapsedAngle);

        this.acumulatedDistance += Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dz, 2));
    }
}
