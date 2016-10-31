var LinearAnimation = function(pontoscontrolo) {
    Animation.apply(this, arguments);
    
    this.size = 0;
    
    for (var i = 0; i<pontoscontrolo.length; i++)
    	{
    		this.x = pontoscontrolo[i+1][0] - pontoscontrolo[i][0];
    		this.y = pontoscontrolo[i+1][1] - pontoscontrolo[i][1];
    		this.z = pontoscontrolo[i+1][2] - pontoscontrolo[i][2];
    		
    		size += sqrt(pow(x,2)+pow(y,2)+pow(z,2),2);
    	}
    
    this.speed = size/tempo; 

};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.move = function () {
   
	
};


