var CircularAnimation = function(centro, raio, anguloinicial, angulorotacao) {
	this.centro=centro;
	this.raio=raio;
	this.anguloinicial=anguloinicial;
	this.angulorotacao=angulorotacao;
    Animation.apply(this, arguments);
    this.tempo=this.Animation.tempo;
    // Circular Animation initialization...
};
CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

