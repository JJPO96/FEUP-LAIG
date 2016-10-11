function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	// File reading
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/dsxscene.xml', this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseLoadOk(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.parseLoadOk=function (rootElement) {

	var rootElement = this.reader.xmlDoc.documentElement;

	this.parseScene(rootElement);
	this.parseViews(rootElement);
	this.parseIllumination(rootElement);
	this.parseLights(rootElement);

	this.loadedOk=true;

	console.log("XML Loaded");

}

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};

MySceneGraph.prototype.parseScene= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('scene');

	if (!elems) {
      return "scene missing!";
  }

	if (elems.length != 1) {
		return "different size of scene element"
	}

	var scene = elems[0];

	this.sceneAtr = new SceneAtr(
		this.reader.getString(scene,'root',true),
		this.reader.getString(scene,'axis_length',true)
	);
}

MySceneGraph.prototype.parseViews= function(rootElement) {
	elems = rootElement.getElementsByTagName('views')

	if (!elems) {
      return "views missing!";
  }

	var views = elems[0];

	this.views = new Views(this.reader.getString(views,'default',true));

	var arrViews = views.getElementsByTagName('perspective');

	for (var i = 0; i < arrViews.length; i++) {
		this.views.perspectives.push(this.parsePerspective(arrViews[i]));
	}
}

MySceneGraph.prototype.parsePerspective = function(perspective){
	var ret = new Perspective(this.reader.getString(perspective,"id",true),
														this.reader.getFloat(perspective,"near"),
														this.reader.getFloat(perspective,"far"),
														this.reader.getFloat(perspective,"angle"));

	var fr = perspective.getElementsByTagName("from")[0];
	var to = perspective.getElementsByTagName("to")[0];

	ret.to.push(this.reader.getFloat(to,"x"));
	ret.to.push(this.reader.getFloat(to,"y"));
	ret.to.push(this.reader.getFloat(to,"z"));

	return ret;
}

MySceneGraph.prototype.parseIllumination = function(rootElement){
	var elems =  rootElement.getElementsByTagName('illumination');
	if (elems == null) {
		onXMLError("illumination element is missing.");
	}
	if (elems.length != 1) {
		onXMLError("either zero or more than one 'illumination' element found.");
	}

	var ambient = elems[0].getElementsByTagName('ambient');
	if (ambient == null) {
		onXMLError("ambient element is missing.");
	}
	if (ambient.length != 1) {
		onXMLError("either zero or more than one 'ambient' element found.");
	}

	var background = elems[0].getElementsByTagName('background');
	if (background == null) {
		onXMLError("background element is missing.");
	}

	if (background.length != 1) {
		onXMLError("either zero or more than one 'background' element found.");
	}

	elems = elems[0];

	this.illumination = new Illumination(this.reader.getBoolean(elems, 'doublesided'),
																			 this.reader.getBoolean(elems, 'local'));

	console.log('Illumination read from file: doubleSided = ' + this.illumination.doubleSided
																							+ ", local = " + this.illumination.local);

	ambient = ambient[0];
	var amb = [this.reader.getFloat(ambient, 'r'),
						 this.reader.getFloat(ambient, 'g'),
						 this.reader.getFloat(ambient, 'b'),
						 this.reader.getFloat(ambient, 'a')];

	this.illumination.ambient = amb;

	console.log('Illumination read from file: Ambient R = ' + this.illumination.ambient[0]
																			 + ", Ambient G = " + this.illumination.ambient[1]
																			 + ", Ambient B = " + this.illumination.ambient[2]
																			 + ", Ambient A = " + this.illumination.ambient[3]);

	background = background[0];
	var bg = [this.reader.getFloat(background, 'r'),
						this.reader.getFloat(background, 'g'),
						this.reader.getFloat(background, 'b'),
						this.reader.getFloat(background, 'a')];

	this.illumination.background = bg;

	console.log('Illumination read from file: Background R = ' + this.illumination.background[0]
																			 + ", Background G = " + this.illumination.background[1]
	                              			 + ", Background B = " + this.illumination.background[2]
																			 + ", Background A = ", this.illumination.background[3]);
}

MySceneGraph.prototype.parseLights = function(rootElement){
	this.omniLights = [];
	this.spotLights = [];

	elems = rootElement.getElementsByTagName('lights')

	if (!elems) {
      return "lights missing!";
  }

	var lights = elems[0];

	var arrOmni = lights.getElementsByTagName('omni');
	var arrSpot = lights.getElementsByTagName('spot');

	for (var i = 0; i < arrOmni.length; i++) {
		this.omniLights.push(this.parseOmniLight(arrOmni[i]));
	}

	for (var i = 0; i < arrSpot.length; i++) {
		this.spotLights.push(this.parseSpotLight(arrSpot[i]));
	}

}

MySceneGraph.prototype.parseOmniLight = function(omni){
	var ret = new omniLight();

	return ret;
}

MySceneGraph.prototype.parseSpotLight = function(spot){
	var ret = new parseSpotLight();

	return ret;
}
