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
function Timer(scene, texts) {
    CGFobject.call(this, scene);

    this.texts = texts;
    this.stop = false;
    this.time = 0;
    this.score = 0;

    this.scene = scene;
    this.clockOffset = 2.5;
    this.scoreOffset = 4.5;

    this.side = new MyPlane(this.scene, 12, 4, 2, 2);
    this.timerNum = new MyPlane(this.scene, 2, 3, 2, 2);
    this.bottom = new MyPlane(this.scene, 12, 8 * Math.sin(Math.PI / 6), 2, 2);
    this.triangle = new MyTriangle(this.scene, 6, 0, 4 * Math.sin(Math.PI / 6), 6, 0, -4 * Math.sin(Math.PI / 6), 6, 4 * Math.cos(Math.PI / 6), 0);
    this.support1 = new MyCylinder(this.scene,0.25,0.25,1.5,30,30);
    this.support2 = new MyCylinder(this.scene,0.25,0.25,6.5,30,30);

    this.alumText = new CGFappearance(this.scene);
    this.alumText.setAmbient(0, 0, 0, 1);
    this.alumText.setDiffuse(0.5, 0.5, 0.5, 1);
    this.alumText.setSpecular(0.5, 0.5, 0.5, 1);
    this.alumText.setShininess(120);
    this.alumText.loadTexture("textures/boardPieces/alumText.png");
};

Timer.prototype = Object.create(CGFobject.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.update = function(time) {
    if (!this.stop) {
      this.time += (1/40);
    }
}

Timer.prototype.updateScore = function(score){
  this.score = score;
}

Timer.prototype.display = function() {
    //un number
    var time = Math.floor(this.time);
    this.scene.pushMatrix();
    this.texts[(time%60)%10].apply();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.translate(this.clockOffset+1.9, 2 * Math.cos(Math.PI / 6) + 0.015, 2 * Math.sin(Math.PI / 6));
    this.scene.rotate(-Math.PI / 6, 1, 0, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.timerNum.display();
    this.scene.popMatrix();


    //dec number
    this.scene.pushMatrix();
    this.texts[(Math.floor((time%60)/10)%10)].apply();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.translate(this.clockOffset+0, 2 * Math.cos(Math.PI / 6) + 0.015, 2 * Math.sin(Math.PI / 6));
    this.scene.rotate(-Math.PI / 6, 1, 0, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.timerNum.display();
    this.scene.popMatrix();


    //dots
    this.scene.pushMatrix();
    this.texts[10].apply();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.translate(this.clockOffset-1.1, 2 * Math.cos(Math.PI / 6) + 0.01, 2 * Math.sin(Math.PI / 6));
    this.scene.rotate(-Math.PI / 6, 1, 0, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.timerNum.display();
    this.scene.popMatrix();


    //cent number
    this.scene.pushMatrix();
    this.texts[(Math.floor(time/60)%10)].apply();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.translate(this.clockOffset-2.3, 2 * Math.cos(Math.PI / 6) + 0.015, 2 * Math.sin(Math.PI / 6));
    this.scene.rotate(-Math.PI / 6, 1, 0, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.timerNum.display();
    this.scene.popMatrix();

    //score un number
    var time = Math.floor(this.time);
    this.scene.pushMatrix();
    this.texts[(this.score%60)%10].apply();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.translate(-this.scoreOffset+1.9, 2 * Math.cos(Math.PI / 6) + 0.015, 2 * Math.sin(Math.PI / 6));
    this.scene.rotate(-Math.PI / 6, 1, 0, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.timerNum.display();
    this.scene.popMatrix();


    //score dec number
    this.scene.pushMatrix();
    this.texts[(Math.floor((this.score%60)/10)%10)].apply();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.translate(-this.scoreOffset+0, 2 * Math.cos(Math.PI / 6) + 0.015, 2 * Math.sin(Math.PI / 6));
    this.scene.rotate(-Math.PI / 6, 1, 0, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.timerNum.display();
    this.scene.popMatrix();

    if (this.scene.board.ambient == 'Wood') {
        this.scene.board.woodBottomBoard.apply();
    } else if (this.scene.board.ambient == 'Marble') {
        this.scene.board.marbleBottomBoard.apply();
    }

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.translate(0, 2 * Math.cos(Math.PI / 6), 2 * Math.sin(Math.PI / 6));
    this.scene.rotate(-Math.PI / 6, 1, 0, 0);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 2 * Math.cos(Math.PI / 6), 2 * Math.sin(Math.PI / 6));
    this.scene.rotate(-Math.PI / 6, 1, 0, 0);
    this.side.display();
    this.scene.popMatrix();



    this.scene.pushMatrix();
    this.scene.translate(0, 2 * Math.cos(Math.PI / 6), 2 * Math.sin(Math.PI / 6));
    this.scene.rotate(-Math.PI / 6, 1, 0, 0);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.bottom.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.triangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.triangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(3,0,0);
    this.scene.rotate(Math.PI/2,1,0,0);
    this.alumText.apply();
    this.support1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(3,-1.5,0.25);
    this.scene.rotate(Math.PI,0,1,0);
    this.alumText.apply();
    this.support2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-3,0,0);
    this.scene.rotate(Math.PI/2,1,0,0);
    this.alumText.apply();
    this.support1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-3,-1.5,0.25);
    this.scene.rotate(Math.PI,0,1,0);
    this.support2.display();
    this.scene.popMatrix();

    this.scene.board.defaultApp.apply();
};
