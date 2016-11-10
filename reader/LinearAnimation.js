var LinearAnimation = function(pontoscontrolo, tempo, scene) {
    Animation.apply(this, arguments);
    
    this.size = 0;
    this.tempo = tempo;   

};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.speed = function(pontos) {
	
	var speed = [];
	
	speed[0] = pontos[0]/tempo;
	speed[1] = pontos[1]/tempo;
	speed[2] = pontos[2]/tempo;
 
}

LinearAnimation.prototype.move = function () {
   
};
