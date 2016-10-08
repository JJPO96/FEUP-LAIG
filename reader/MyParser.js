

function MyParser(filename, scene) {
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

	this.reader.open('scenes/'+filename, this);
}

/*
 * Callback to be executed after successful reading
 */
MyParser.prototype.onXMLReady=function()
{
	console.log("DSX loaded.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseScene(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MyParser.prototype.parseScene= function(rootElement) {

/*-------------------------------------------------------------------------------------*/
//Scene
	var elems =  rootElement.getElementsByTagName('scene');
	var scene = elems[0];

	if (!elems) {
      return "scene missing!";
  }

	if (elems.length != 1) {
		return "different size of scene element"
	}

	this.sceneAtr = new SceneAtr(
		this.reader.getString(scene,'root',true),
		this.reader.getString(scene,'axis_length',true),
	);

/*-------------------------------------------------------------------------------------*/
//Views
	this.views = [];

	elems = rootElement.getElementsByTagName('views')

	if (!elems) {
      return "views missing!";
  }

	if (elems.length != 1) {
		return "different size of scene element"
	}

	var views = elems[0];

	this.defaultView = this.reader.getString()

/*-------------------------------------------------------------------------------------*/
//Illumination


/*-------------------------------------------------------------------------------------*/
//Lights


/*-------------------------------------------------------------------------------------*/
//Textures


/*-------------------------------------------------------------------------------------*/
//Materials


/*-------------------------------------------------------------------------------------*/
//Transformations


/*-------------------------------------------------------------------------------------*/
//Primitives


/*-------------------------------------------------------------------------------------*/
//Components


};


/*-------------------------------------------------------------------------------------*/
//Scene

/*-------------------------------------------------------------------------------------*/
//Views


/*-------------------------------------------------------------------------------------*/
//Illumination


/*-------------------------------------------------------------------------------------*/
//Lights


/*-------------------------------------------------------------------------------------*/
//Textures


/*-------------------------------------------------------------------------------------*/
//Materials


/*-------------------------------------------------------------------------------------*/
//Transformations


/*-------------------------------------------------------------------------------------*/
//Primitives


/*-------------------------------------------------------------------------------------*/
//Components



/*
 * Callback to be executed on any read error
 */

MyParser.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
