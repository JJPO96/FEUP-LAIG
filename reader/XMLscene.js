
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {


	// TODO CORRIGIR (NÃO ESTÁ A DETETAR O GRAPH(UNDEFINED))
	/*if (typeof this.XMLscene.graph != 'undefined'){

		console.log("sim");

		for (var i = 0; i < this.graph.omniLights.length; i++){
			this.lights[i].setPosition(this.graph.omniLights[i].location[0], this.graph.omniLights[i].location[1], this.graph.omniLights[i].location[2], this.graph.omniLights[i].location[3]);
			this.lights[i].setAmbient(this.graph.omniLights[i].ambient[0], this.graph.omniLights[i].ambient[1], this.graph.omniLights[i].ambient[2], this.graph.omniLights[i].ambient[3]);
			this.lights[i].setDiffuse(this.graph.omniLights[i].diffuse[0], this.graph.omniLights[i].diffuse[1], this.graph.omniLights[i].diffuse[2], this.graph.omniLights[i].diffuse[3]);
			this.lights[i].setSpecular(this.graph.omniLights[i].specular[0], this.graph.omniLights[i].specular[1], this.graph.omniLights[i].specular[2], this.graph.omniLights[i].specular[3]);
			this.lights[i].setVisible(this.graph.omniLights[i].getEnabled);
			this.lights[i].update();
		}
	}	*/

	// TODO - CONFIRMAR SE NO SET POSITION A 4ª VARIÁVEL É PARA COLOCAR A 1
	// TODO - FALTA FAZER SET DO TARGET
	/*for (var j = 0; j < this.graph.spotLights.length; j++){
		
		this.lights[i+j].setPosition(this.graph.spotLights[j].location[0], this.graph.spotLights[j].location[1], 1);
		this.lights[i+j].setAmbient(this.graph.spotLights[j].ambient[0], this.graph.spotLights[j].ambient[1], this.graph.spotLights[j].ambient[2], this.graph.spotLights[j].ambient[3]);
		this.lights[i+j].setDiffuse(this.graph.spotLights[j].diffuse[0], this.graph.spotLights[j].diffuse[1], this.graph.spotLights[j].diffuse[2], this.graph.spotLights[j].diffuse[3]);
		this.lights[i+j].setSpecular(this.graph.spotLights[j].specular[0], this.graph.spotLights[j].specular[1], this.graph.spotLights[j].specular[2], this.graph.spotLights[j].specular[3]);
		this.lights[i+j].setVisible(this.graph.spotLights[ij].getEnabled);
		this.lights[i+j].update();
	}*/


	

	
	// TODO - APAGAR CODIGO ORIGINAL
	
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.initPrimitives = function () {
	//TODO
};



XMLscene.prototype.initMaterials = function () {
// TODO
};

XMLscene.prototype.initTextures = function () {
	// TODO
};



XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	//TODO - apagar
	console.log("\n\ndebugging \n"+this.graph.omniLights);

	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
	};	
};

