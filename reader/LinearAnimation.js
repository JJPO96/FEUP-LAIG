var LinearAnimation = function(pontoscontrolo, tempo, scene) {
    Animation.apply(this, arguments);
    
    this.size = 0;
    this.tempo = tempo;
    this.pontoscontrolo = pontoscontrolo;
    
    this.size = 0;
    
    this.speed = this.calculateSpeed();
    this.calculateVectors();
    this.move();
    
    this.pontoAtual = pontoscontrolo[0];

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
	
	this.increment = [];
	
	for (var i = 0; i<vetores.length; i++){
		
		var time = this.tempo/vetores.length-1;
		
		increment.push(this.incrementation(vetores[i], time));
	}
		
}


LinearAnimation.prototype.incrementation = function(pontos, time) {
	
	var inc = [];
	
	inc[0] = pontos[0]/time;
	inc[1] = pontos[1]/time;
	inc[2] = pontos[2]/time;
	
	return inc;
 
}

LinearAnimation.prototype.calculateSpeed = function() {
	
	for (var i = 0; i<pontoscontrolo.length; i++)
	{
		this.x = pontoscontrolo[i+1][0] - pontoscontrolo[i][0];
		this.y = pontoscontrolo[i+1][1] - pontoscontrolo[i][1];
		this.z = pontoscontrolo[i+1][2] - pontoscontrolo[i][2];
		
		size += sqrt(pow(x,2)+pow(y,2)+pow(z,2),2);
	}
	
	return size/tempo;
	
}

LinearAnimation.prototype.move = function () {
   
	while (){ // - TODO JÁ NÃO CONSIGO PENSAR NISTO
		this.pontoAtual[0] += this.increment[i][0];
		this.pontoAtual[1] += this.increment[i][1];
		this.pontoAtual[2] += this.increment[i][2];
	}
	
};
