var LinearAnimation = function(pontoscontrolo, tempo, scene) {
    Animation.apply(this, arguments);
    
    this.size = 0;
    this.tempo = tempo;
    this.pontoscontrolo = pontoscontrolo;
    
    

};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.calculateVectors = function () {
	
	vetores = [];
 
	for (var i = 1; i < this.pontoscontrolo.length; i++)
		{
			vetor = [];
		
			vetor[0] = pontoscontrolo[i][0] - pontoscontrolo[i-1][0];
			vetor[1] = pontoscontrolo[i][1] - pontoscontrolo[i-1][1];
			vetor[2] = pontoscontrolo[i][2] - pontoscontrolo[i-1][2];
			
			vetores.push(vetor);
		}
	
	increment = [];
	
	for (var i = 0; i<vetores.length; i++){
		
		var time = this.tempo/vetores.length-1;
		
		increment.push(this.incrementacao(vetores[i], time));
	}
		
}


LinearAnimation.prototype.incrementacao = function(pontos, time) {
	
	var inc = [];
	
	inc[0] = pontos[0]/time;
	inc[1] = pontos[1]/time;
	inc[2] = pontos[2]/time;
	
	return inc;
 
}

LinearAnimation.prototype.move = function () {
   
};
