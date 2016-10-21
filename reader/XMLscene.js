
function XMLscene(myInterface) {
  CGFscene.call(this);

  this.interface=myInterface;

  this.vwInd = 0;
  this.matInd = 0;

}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
  CGFscene.prototype.init.call(this, application);

  this.enableTextures(true);

  this.initCameras();

  this.initLights();

  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.axis=new CGFaxis(this);

  // TODO esfera para ir com o caralho
  this.sphere = new MyTriangle(this,0,2,1,0,0,2,0,0,0);
  this.appearance = new CGFappearance(this);

  //interface
  this.lightsArray;
  this.vwInd=0;
  this.materialIndex=0;
};

XMLscene.prototype.initLights = function () {

  this.lights[0].setPosition(2, 3, 3, 1);
  this.lights[0].setAmbient(0, 0, 0, 1);
  this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
  this.lights[0].setSpecular(1.0, 1.0, 1.0, 1.0);
  this.lights[0].setVisible(true);
  this.lights[0].enable();
  this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
  this.setAmbient(0.2, 0.4, 0.8, 1.0);
  this.setDiffuse(0.2, 0.4, 0.8, 1.0);
  this.setSpecular(0.2, 0.4, 0.8, 1.0);
  this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {
  this.gl.clearColor(this.graph.illumination.background[0],
                     this.graph.illumination.background[1],
                     this.graph.illumination.background[2],
                     this.graph.illumination.background[3]);

  this.setGlobalAmbientLight(this.graph.illumination.ambient[0],
                            this.graph.illumination.ambient[1],
                            this.graph.illumination.ambient[2],
                            this.graph.illumination.ambient[3]);
  this.lights[0].setVisible(true);
  this.lights[0].enable();
  this.updateView();
  this.initGraphLights();
  this.axis=new CGFaxis(this,this.graph.axis_length,0.05);
};


XMLscene.prototype.updateView = function () {
    this.camera = this.graph.views.perspectives[this.vwInd].camera;
    this.interface.setActiveCamera(this.graph.views.perspectives[this.vwInd].camera);

    this.vwInd = (++this.vwInd) % this.graph.views.perspectives.length;
};

XMLscene.prototype.initGraphLights = function () {
    var i = 0;


    this.lightsArray = new Array( this.graph.omniLights.length + this.graph.spotLights.length);

    for (var j = 0; j < this.graph.omniLights.length; j++,i++) {
      var tempO = this.graph.omniLights[j];
      this.lights[i].setPosition(tempO.location[0],
                                     tempO.location[1],
                                     tempO.location[2],
                                     tempO.location[3]);
      this.lights[i].setAmbient(tempO.ambient[0],
                                    tempO.ambient[1],
                                    tempO.ambient[2],
                                    tempO.ambient[3]);
      this.lights[i].setDiffuse(tempO.diffuse[0],
                                    tempO.diffuse[1],
                                    tempO.diffuse[2],
                                    tempO.diffuse[3]);
      this.lights[i].setSpecular(tempO.specular[0],
                                     tempO.specular[1],
                                     tempO.specular[2],
                                     tempO.specular[3]);

      this.lightsArray[i] = tempO.enabled;
      this.interface.addLight("omni",i,tempO.id);

      if (tempO.enabled)
        this.lights[i].enable();
      else
        this.lights[i].disable();

      this.lights[i].setVisible(true);
      this.lights[i].update();
    }



    for (var j = 0; j < this.graph.spotLights.length; j++,i++) {
      console.log(this.graph.spotLights);
      var tempS = this.graph.spotLights[j];
      console.log(tempS);

      this.lights[i].setPosition(tempS.location[0], tempS.location[1], tempS.location[2], 1);
      this.lights[i].setAmbient(tempS.ambient[0], tempS.ambient[1], tempS.ambient[2], tempS.ambient[3]);
      this.lights[i].setDiffuse(tempS.diffuse[0], tempS.diffuse[1], tempS.diffuse[2], tempS.diffuse[3]);
      this.lights[i].setSpecular(tempS.specular[0], tempS.specular[1], tempS.specular[2], tempS.specular[3]);
      this.lights[i].setSpotExponent(tempS.exponent);
      this.lights[i].setSpotDirection(tempS.location[0] - tempS.target[0], tempS.location[1] - tempS.target[1], tempS.location[2] - tempS.target[2]);

      this.lightsArray[i] = tempS.enabled;
      this.interface.addLight("spot",i,tempS.id);

      if (tempS.enabled)
        this.lights[i].enable();
      else
        this.lights[i].disable();

      this.lights[i].setVisible(true);
      this.lights[i].update();
    }



};


XMLscene.prototype.updateLights = function () {

  for (var i = 0; i < this.lightsArray.length; i++) {
    if(this.lightsArray[i])
      this.lights[i].enable();
    else
      this.lights[i].disable();
  }

  for (var i = 0; i < this.lights.length; i++)
    this.lights[i].update();

}

XMLscene.prototype.updateMaterial = function () {
    this.materialIndex++;
}



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
    this.updateLights();
    this.graph.displayGraph();
  };
};
