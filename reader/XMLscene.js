/**
 * XML Scene
 * @param itf
 * @returns
 */
function XMLscene(itf) {
    CGFscene.call(this);
    this.interface = itf;
    this.lightsArray = [];
    this.viewIndex = 0;
    this.updateTime = 10;
    this.temp = 0;
    this.camInd = 1;
    this.cameraReady = true;
    this.camAnimDur = 2;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * init of the scene
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);
    this.setPickEnabled(true);
    this.initCameras();
    this.initLights();

    this.enableTextures(true);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);

    this.trippples = new Trippples(this, 1);

    this.trippples.init();

    this.board = new TrippplesBoard(this);


    this.currentCamera = 0;
    this.cameras = [];

    this.materialsList = {};
    this.materialsIDs = []

    this.texturesList = {};
    this.texturesID = [];

    this.transformationsList = {};
    this.transformationsIDs = [];

    this.componentsList = {};
    this.componentsIDs = [];

    this.lightsStatus = [];
    this.lightsNames = [];

    this.animationsList = {};
    this.animationsIDs = [];
    this.fps = 60;
    var updatePeriod = 1000 / this.fps;
    this.setUpdatePeriod(updatePeriod);

    this.cameraInc = 0;
    this.inv = true;
};

/**
 * init of the cameras
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.logPicking = function() {
    this.board.makePlay();
}

/**
 * init of the lights
 */
XMLscene.prototype.initLights = function() {
    this.setGlobalAmbientLight(0, 0, 0, 1);

    this.setGlobalAmbientLight(0.5, 0.5, 0.5, 1.0);

    // Positions for four lights
    this.lights[0].setPosition(4, 6, 1, 1);
    this.lights[0].setVisible(true); // show marker on light position (different from enabled)
    this.lights[0].setAmbient(0, 0, 0, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].setSpecular(10, 10, 0, 1);
    this.lights[0].enable();


};

/**
 * Initialization of the data from Materials
 */

XMLscene.prototype.initMaterials = function() {
    this.materialsList = this.graph.materialsList;
    this.materialsIDs = this.graph.materialsIDs;

}

//Initialization of the data from Textures
XMLscene.prototype.initTextures = function() {
    this.texturesList = this.graph.texturesList;
    this.texturesID = this.graph.texturesID;


    if (this.texturesID.length > 0)
        this.enableTextures(true);
}

//Initialization of the data from Transformations
XMLscene.prototype.initTransformations = function() {

    this.transformationsList = this.graph.transformationList;
    this.transformationsIDs = this.graph.transformationIDs;

}

//Initialization of the data from Components
XMLscene.prototype.initComponents = function() {
    this.componentsList = this.graph.componentsList;
    this.componentsIDs = this.graph.componentsIDs;

}

//Initialization of the data from Primitives
XMLscene.prototype.initPrimitives = function() {
    this.primitives = this.graph.primitivesList;
    this.primitivesIDs = this.graph.primitivesIDs;
};

/**
 * Initalization of the data from Animations
 */
XMLscene.prototype.initAnimations = function() {
    this.animationsList = this.graph.animationsList;
    this.animationsIDs = this.graph.animationsIDs;
};

/**
 * Updates the current time
 */
XMLscene.prototype.update = function(currTime) {
    this.board.timer.update(currTime);
    this.updateCamera();
};

//Function of display of the scene
XMLscene.prototype.display = function() {
    this.clearPickRegistration();
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.logPicking();

    // Initialize Model-View matrix as identity (no transformation)
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Update all lights used
    this.updateLights();

    // Draw axis
    this.axis.display();

    this.board.display();


    if (this.graph.loadedOk) {
        this.lights[0].update();
        //	this.displayGraph(this.graph.root, null, null);
    };
}

//Function to intialize everything
XMLscene.prototype.onGraphLoaded = function() {

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
    this.initDSXLights();
    this.initMaterials();
    this.initPrimitives();
    this.initTextures();
    this.initTransformations();

    this.initComponents();
    this.initAnimations();
    this.axis = new CGFaxis(this, this.graph.axis_length);

};

//Function to update the different views from dsx by pressing 'v'
XMLscene.prototype.updateView = function() {
    this.camera = this.graph.views.perspectives[this.viewIndex].camera;
    this.interface.setActiveCamera(this.graph.views.perspectives[this.viewIndex].camera);
    this.viewIndex = (++this.viewIndex) % this.graph.views.perspectives.length;
    this.inv = !this.inv;
};

//Function to update the different materials from dsx by pressing 'm'
XMLscene.prototype.updateMaterial = function() {
    for (var i = 0; i < this.componentsIDs.length; i++) {
        this.componentsList[this.componentsIDs[i]].updateMaterial();
    }
}

//Function to update the different materials from dsx by pressing 'm'
XMLscene.prototype.updateCamera = function(time) {
  if (!this.cameraReady && this.board.move/* && this.board.lastPlay == 1*/) {
    this.cameraInc += 25;
    var i = 180 * (this.cameraInc / (this.camAnimDur * 1000));
    if (this.board.lastPlay == 1 && !this.inv) {
      this.interface.activeCamera.setPosition(vec3.fromValues(-10 * Math.sin(i * (Math.PI / 180)), 10, - 12 * Math.cos(i * (Math.PI / 180))));
    }else if (this.board.lastPlay == 2 && !this.inv) {
        this.interface.activeCamera.setPosition(vec3.fromValues(-10 * Math.sin(i * (Math.PI / 180)), 10,12 * Math.cos(i * (Math.PI / 180))));
    }


    if (this.cameraInc >= (this.camAnimDur * 1000)) {
      this.cameraReady = true;
      this.cameraInc = 0;
      if (this.inv) {
        this.viewIndex = (++this.viewIndex) % this.graph.views.perspectives.length;
      }
      this.inv = false;
    }
  }
}


//Function of initialization of lights from dsx
XMLscene.prototype.initDSXLights = function() {
    var j = 0;

    this.lightsArray = new Array(this.graph.omniLights.length + this.graph.spotLights.length);
    for (var i = 0; i < this.graph.omniLights.length; i++, j++) {
        var omni = this.graph.omniLights[i];

        this.lights[j].setPosition(omni.location[0], omni.location[1], omni.location[2], omni.location[3]);
        this.lights[j].setAmbient(omni.ambient[0], omni.ambient[1], omni.ambient[2], omni.ambient[3]);
        this.lights[j].setDiffuse(omni.diffuse[0], omni.diffuse[1], omni.diffuse[2], omni.diffuse[3]);
        this.lights[j].setSpecular(omni.specular[0], omni.specular[1], omni.specular[2], omni.specular[3]);

        this.lightsArray[j] = omni.enabled;
        this.interface.addLight("omni", j, omni.id);

        if (omni.enabled)
            this.lights[j].enable();
        else
            this.lights[j].disable();

        this.lights[j].setVisible(true);
        this.lights[j].update();
    }

    for (var i = 0; i < this.graph.spotLights.length; i++, j++) {
        var spot = this.graph.spotLights[i];

        this.lights[j].setPosition(spot.location[0], spot.location[1], spot.location[2], 1);
        this.lights[j].setAmbient(spot.ambient[0], spot.ambient[1], spot.ambient[2], spot.ambient[3]);
        this.lights[j].setDiffuse(spot.diffuse[0], spot.diffuse[1], spot.diffuse[2], spot.diffuse[3]);
        this.lights[j].setSpecular(spot.specular[0], spot.specular[1], spot.specular[2], spot.specular[3]);
        this.lights[j].setSpotExponent(spot.exponent);
        this.lights[j].setSpotDirection(spot.location[0] - spot.target[0], spot.location[1] - spot.target[1], spot.location[2] - spot.target[2]);

        this.lightsArray[j] = spot.enabled;
        this.interface.addLight("spot", j, spot.id);

        if (spot.enabled)
            this.lights[j].enable();
        else
            this.lights[j].disable();

        this.lights[j].setVisible(true);
        this.lights[j].update();
    }
};

//Function to update the state ON or OFF from lights
XMLscene.prototype.updateLights = function() {

    for (var i = 0; i < this.lightsArray.length; i++) {
        if (this.lightsArray[i])
            this.lights[i].enable();
        else
            this.lights[i].disable();
    }

    for (var i = 0; i < this.lights.length; i++)
        this.lights[i].update();

}

//Function of the graph where the scene is created
XMLscene.prototype.displayGraph = function(root, material, texture) {
    var node;
    var mat;
    var text;


    node = this.componentsList[root];

    //transformations
    this.pushMatrix();

    if (node.materialListIDs[0] == 'inherit')
        mat = material;
    else
        mat = this.materialsList[node.materialListIDs[node.materialIndex]];

    //textures
    text = this.texturesList[node.texture];
    switch (node.texture) {
        case "none":
            text = null;
            break;
        case "inherit":
            text = texture;
            break;
    }

    if (node.transformationsID != null)
        this.applyTransformations(this.transformationsList[node.transformationsID]);
    else
        this.applyTransformations(node.transformations);


    if (node.currentAnimation < node.animationList.length) {
        var animation = this.animationsList[node.animationList[node.currentAnimation]];
        if (animation.animate() == 1 && node.currentAnimation + 1 < node.animationList.length)
            node.currentAnimation++;
    }
    for (var i = 0; i < node.primitivesRefs.length; i++) {
        if (this.primitives[node.primitivesRefs[i]] instanceof MyTriangle || this.primitives[node.primitivesRefs[i]] instanceof MyRectangle) {
            var s = this.texturesList[node.texture + "s"];
            var t = this.texturesList[node.texture + "t"];
            if (s > 1 && t > 1) {
                this.primitives[node.primitivesRefs[i]].updateTexCoords(s, t);
                mat.setTextureWrap('REPEAT', 'REPEAT');
            }
        }

        mat.setTexture(text);
        mat.apply();


        this.primitives[node.primitivesRefs[i]].display();
    }

    for (var i = 0; i < node.componentRefs.length; i++) {
        var childID = node.componentRefs[i];
        this.displayGraph(childID, mat, text);

    }
    this.popMatrix();

}


//Function to appy the transformations in each node
XMLscene.prototype.applyTransformations = function(transformations) {
    for (var i = 0; i < transformations.length; i++) {
        var transf = transformations[i];

        switch (transf.type) {
            case "rotate":
                this.rotate(transf.angle * Math.PI / 180,
                    transf.axis == "x" ? 1 : 0,
                    transf.axis == "y" ? 1 : 0,
                    transf.axis == "z" ? 1 : 0);
                break;
            case "translate":
                this.translate(transf.x, transf.y, transf.z);
                break;
            case "scale":
                this.scale(transf.x, transf.y, transf.z);
                break;
        }
    }
}
