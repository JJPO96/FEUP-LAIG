var CircularAnimation = function(id, tempo, centro, raio, anguloinicial, angulorotacao) {
	this.centro=centro;
	this.raio=raio;
	this.anguloinicial=anguloinicial;
	this.angulorotacao=angulorotacao;
	this.tempo=this.tempo;
    
	this.calculateValues();
};
CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.calculateValues = function()
{
    var deg2Rad = Math.PI / 180;
    this.anguloinicial = this.anguloinicial *deg2Rad;
    this.angulorotacao = this.angulorotacao * deg2Rad;
   
    this.anguloincrementacao = (this.angulorotacao * deg2Rad) / (60 * this.tempo);
    this.angulo = this.startang *deg2Rad;
}

CircularAnimation.prototype.move = function()
{
	
}

