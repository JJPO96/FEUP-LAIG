/*
Reads and stores data from the dsx file
*/
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	this.root;
	this.rgba = ['r', 'g', 'b', 'a'];
	this.xyzw = ['x', 'y', 'z', 'w'];
	this.xyz = ['x', 'y', 'z'];
	this.doublexyz = ['xx', 'yy', 'zz'];
	this.allTagNames = ['scene', 'views', 'illumination', 'lights', 'textures', 'materials','transformations','primitives', 'components', 'animations'];

	this.lightIndex = 0;

	this.materialsList = {};
	this.materialsIDs = [];

	this.texturesList = {};
	this.texturesID = [];

	this.primitivesList = {};
	this.cameras = [];

	this.omniLightsList = [];
	this.spotLightsList = [];

	this.primitivesIDs = [];

	this.componentsList = {};
	this.componentsIDs = [];

	this.transformationList = {};
	this.transformationsIDs = [];

	this.animationsList = {};
	this.animationsIDs = [];

	// File reading
	this.reader = new CGFXMLreader();

	/*
	* Read the contents of the xml file, and refer to this class for loading and error handlers.
	* After the file is read, the reader calls onXMLReady on this object.
	* If any error occurs, the reader calls onXMLError on this object, with an error message
	*/

	this.reader.open(filename, this);
}

/*
* Callback to be executed after successful reading
*/
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	var checkDSX = this.checkOrder(rootElement);
	if(checkDSX != 0){
		this.onXMLError(checkDSX);
		return;
	}

	var sceneError = this.parseScene(rootElement);
	if (sceneError != null) {
		this.onXMLError(sceneError);
		return;
	}

	var viewsError = this.parseViews(rootElement);
	if (viewsError != null) {
		this.onXMLError(viewsError);
		return;
	}

	var illuminationError = this.parseIllumination(rootElement);
	if (illuminationError != null) {
		this.onXMLError(illuminationError);
		return;
	}

	var lightsError = this.parseLights(rootElement);
	if (lightsError != null) {
		this.onXMLError(lightsError);
		return;
	}

	var texturesError = this.parseTextures(rootElement);
	if (texturesError != null) {
		this.onXMLError(texturesError);
		return;
	}

	var materialsError = this.parseMaterials(rootElement);
	if (materialsError != null) {
		this.onXMLError(materialsError);
		return;
	}

	var transformationsError = this.parseTransformations(rootElement);
	if (transformationsError != null) {
		this.onXMLError(transformationsError);
		return;
	}

	var primitivesError = this.parsePrimitives(rootElement);
	if (primitivesError != null) {
		this.onXMLError(primitivesError);
		return;
	}

	var componentsError = this.parseComponents(rootElement);
	if (componentsError != null) {
		this.onXMLError(componentsError);
		return;
	}

	var animationsError = this.parseAnimations(rootElement);
	if (animationsError != null) {
		this.onXMLError(animationsError);
		return;
	}

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


/*
Verifies if the order of the elements is correct
*/
MySceneGraph.prototype.checkOrder = function(rootElement){

	//console.log(rootElement.children.length);
	/*for (var i = 0; i < rootElement.children.length; i++) {
		console.log(rootElement.children[i]);
	}*/
	if(rootElement.children.length != 10){
		console.error("Wrong number of tags");
		return 1;
	}

	for(var i = 0;  i < this.allTagNames.length; i++){
		if(rootElement.children[i].tagName != this.allTagNames[i]){
			console.log(rootElement.children[i].tagName);
			console.log(this.allTagNames[i]);
			console.warn(rootElement.children[i].tagName + " is not on the right place");
			break;
		}
	}

	return 0;
}



/*
* Example of method that parses elements of one block and stores information in a specific data structure
*/
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	//console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

};

/*
Reads and stores data from the scene element
*/
MySceneGraph.prototype.parseScene = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('scene');
	if (elems == null) {
		return "scene element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'scene' element found.";
	}

	var scene = elems[0];

	this.root = this.reader.getString(scene, 'root');

	this.axis_length = this.reader.getFloat(scene, 'axis_length');

	//console.log("Scene read from file: root = " + this.root + ", axis_length = " + this.axis_length);
}

/*
Reads and stores data from the illumination element
*/
MySceneGraph.prototype.parseIllumination = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('illumination');
	if (elems == null) {
		return "illumination element is missing.";
	}
	if (elems.length != 1) {
		return "either zero or more than one 'illumination' element found.";
	}

	var ambient = elems[0].getElementsByTagName('ambient');
	if (ambient == null) {
		return "ambient element is missing.";
	}
	if (ambient.length != 1) {
		return "either zero or more than one 'ambient' element found.";
	}

	var background = elems[0].getElementsByTagName('background');
	if (background == null) {
		return "background element is missing.";
	}

	if (background.length != 1) {
		return "either zero or more than one 'background' element found.";
	}

	elems = elems[0];

	this.doubleSided = this.reader.getBoolean(elems, 'doublesided');
	this.local = this.reader.getBoolean(elems, 'local');

	//console.log('Illumination read from file: doubleSided = ' + this.doubleSided + ", local = " + this.local);

	ambient = ambient[0];
	this.ambientR = this.reader.getFloat(ambient, 'r');
	this.ambientG = this.reader.getFloat(ambient, 'g');
	this.ambientB = this.reader.getFloat(ambient, 'b');
	this.ambientA = this.reader.getFloat(ambient, 'a');

	//console.log('Illumination read from file: Ambient R = ' + this.ambientR + ", Ambient G = " + this.ambientG + ", Ambient B = " + this.ambientB + ", Ambient A = ", this.ambientA);

	background = background[0];
	this.backgroundR = this.reader.getFloat(background, 'r');
	this.backgroundG = this.reader.getFloat(background, 'g');
	this.backgroundB = this.reader.getFloat(background, 'b');
	this.backgroundA = this.reader.getFloat(background, 'a');

	//console.log('Illumination read from file: Background R = ' + this.backgroundR + ", Background G = " + this.backgroundG + ", Background B = " + this.backgroundB + ", Background A = ", this.backgroundA);
}

/*
Reads and stores data from the textures element
*/
MySceneGraph.prototype.parseTextures = function(rootElement)
{
	var textures = rootElement.getElementsByTagName('textures');

	if (textures == null  || textures.length==0) {
		return "textures element is missing.";
	}

	var numText = textures[0].children.length;

	if(numText <= 0)
	return "texture elements are missing";

	for (var i = 0; i < numText; i++)
	{
		var e = textures[0].children[i];
		// process each element and store its information
		var id = e.attributes.getNamedItem("id").value;
		var file = e.attributes.getNamedItem("file").value;
		var length_s = e.attributes.getNamedItem("length_s").value;
		var length_t = e.attributes.getNamedItem("length_t").value;


		if(this.texturesList.hasOwnProperty(id))
		console.warn("texture " + id + " repeated");

		var text = new CGFtexture(this.scene, file);
		this.texturesList[id] = text;
		this.texturesList[id + "s"] = length_s;
		this.texturesList[id + "t"] = length_t;
		this.texturesID[i] = id;
		//console.log("Texture read from file: ID = " + id + ", File = " + file + ",S Length = " + length_s + ",T Length = " + length_t);
	};

}

/*
Reads and stores data from the views element
*/
MySceneGraph.prototype.parseViews = function(rootElement)
{
	var views = rootElement.getElementsByTagName('views');

	if (views == null  || views.length==0) {
		return "views element is missing.";
	}

	var nnodes = views[0].children.length;

	var view = views[0];

	this.defaultCamera = this.reader.getString(view, 'default');
	var foundDefault = false;

	for(var i = 0; i <nnodes ; i++){

		perspective = view.children[i];
		var id = this.reader.getString(perspective, 'id');

		if(id == this.defaultCamera)
		foundDefault = true;

		this.cameras[i * 6 ] = id;
		this.cameras[i * 6 + 1] = this.reader.getFloat(perspective, 'near');
		this.cameras[i * 6 + 2] = this.reader.getFloat(perspective, 'far');
		this.cameras[i * 6 + 3] = this.reader.getFloat(perspective, 'angle');
		//console.log( this.reader.getString(perspective, 'id') + " " + this.reader.getFloat(perspective, 'near') + " " + this.reader.getFloat(perspective, 'far') + " " + this.reader.getFloat(perspective, 'angle'));

		from =perspective.children[0];
		this.cameras[i * 6 + 4] = vec3.fromValues( this.reader.getFloat(from, 'x'), this.reader.getFloat(from, 'y'),  this.reader.getFloat(from, 'z'));

		to = perspective.children[1];
		this.cameras[i * 6 + 5] =  vec3.fromValues(this.reader.getFloat(to, 'x'), this.reader.getFloat(to, 'y'), this.reader.getFloat(to, 'z'));
	}

	if(!foundDefault)
	return "Default camera does not exist";

	for(var i = 0; i < this.cameras.length; i += 6){
		for(var j = i + 6; j < this.cameras.length; j += 6 ){
			if(this.cameras[i] == this.cameras[j])
			return "camera " + this.cameras[i] + " repeated";
		}
	}

	/*console.log("tamanho " + this.cameras.length/6);
	for(var i = 0;  i< this.cameras.length /6 ; i++){
	console.log("Perspective :id= " + this.cameras[i * 6] + " near= " + this.cameras[i * 6 +1] + " far= "+ this.cameras[i * 6 + 2] + " angle= " + this.cameras[i * 6 + 3]);
	console.log("from x= " + this.cameras[i * 6 + 4][0] + " y= " + this.cameras[i * 6 + 4][1] + " z= " +  this.cameras[i * 6 + 4][2]);
	console.log("to x= " +  this.cameras[i * 6 + 5][0] + " y= " + this.cameras[i * 6 + 5][1] + " z= " + this.cameras[i * 6 + 5][2]);
}*/
}

/*
Reads and stores data from materials element
*/
MySceneGraph.prototype.parseMaterials = function(rootElement)
{
	var component = ['emission', 'ambient', 'diffuse', 'specular'];

	var materials = rootElement.getElementsByTagName('materials');

	if (materials == null  || materials.length==0) {
		return  "materials element is missing.";
	}


	var ltMaterial = materials[0].getElementsByTagName('material');

	for(var i = 0; i< ltMaterial.length; i++){

		var id = ltMaterial[i].attributes.getNamedItem("id").value;

		if(id === null)
		continue;

		var material = [];

		var x =  ltMaterial[i].getElementsByTagName('shininess')[0];
		material[4] = x.getAttribute("value");

		for(var j = 0; j < component.length ; j++){

			var att = ltMaterial[i].getElementsByTagName(component[j]);

			material[j] = [];
			for(var k = 0; k < this.rgba.length; k++)
			{
				material[j][k] = att[0].getAttribute(this.rgba[k]);
				//console.log("Material property: " + material[j][k]);
			}

		}
		if(this.materialsList.hasOwnProperty(id))
		return "material " + id + " repeated";

		var mat = new CGFappearance(this.scene);
		mat.setEmission(material[0][0], material[0][1], material[0][2], material[0][3]);
		mat.setAmbient(material[1][0], material[1][1], material[1][2], material[1][3]);
		mat.setDiffuse(material[2][0], material[2][1], material[2][2], material[2][3]);
		mat.setSpecular(material[3][0], material[3][1], material[3][2], material[3][3]);
		mat.setShininess(material[4]);

		this.materialsList[id] = mat;
		this.materialsIDs[i] = id;
	};


}

/*
Reads and stores data from transformations element
*/
MySceneGraph.prototype.parseTransformations = function(rootElement)
{
	var transformations = rootElement.getElementsByTagName('transformations');

	if (transformations == null  || transformations.length==0) {
		return "transformations element is missing.";
	}

	var numTransf = transformations[0].children.length;

	if(numTransf <= 0)
	return "transformation elements are missing";

	for(var i = 0; i < numTransf; i++)
	{
		var transf = transformations[0].children[i];

		var id =  this.reader.getString(transf, 'id');
		this.transformationsIDs[i] = id;

		if(this.transformationList.hasOwnProperty(id))
		return "transformation " + id + " repeated";

		var tr = [];
		for(var j = 0; j < transf.children.length; j++)
		tr.push(this.getTransformationValues(transf.children[j]));

		this.transformationList[this.transformationsIDs[i]] = tr;

	}

	//console.log(this.transformationList);
}

/*
reads and returns an array with data from the transformation received
*/
MySceneGraph.prototype.getTransformationValues = function(transformation){
	var values = {};
	switch(transformation.tagName)
	{
		case "rotate":
		values.type = "rotate";
		values.axis = this.reader.getString(transformation, "axis");
		values.angle = this.reader.getString(transformation, "angle");
		break;
		case "translate":
		values.type = "translate";
		values.x = this.reader.getString(transformation, "x");
		values.y = this.reader.getString(transformation, "y");
		values.z = this.reader.getString(transformation, "z");
		break;
		case "scale":
		values.type = "scale";
		values.x = this.reader.getString(transformation, "x");
		values.y = this.reader.getString(transformation, "y");
		values.z = this.reader.getString(transformation, "z");
		break;
	}
	return values;
	//console.log(values);
}


/*
Reads and stores data from components element
*/
MySceneGraph.prototype.parseComponents = function(rootElement)
{
	var components = rootElement.getElementsByTagName('components');

	if (components == null  || components.length==0) {
		return "components element is missing.";
	}

	var compLength = components[0].children.length;
	for(var i = 0; i < compLength; i++)
	{
		var component = components[0].children[i];

		var componentID = this.reader.getString(component, 'id');

		if(this.componentsList.hasOwnProperty(componentID))
		return "component " +  componentID + " repeated";

		var transformation = component.getElementsByTagName('transformation');

		if(transformation == null) {
			return "transformation element is missing on Components";
		}

		transformation = transformation[0];
		var transformationRef = transformation.getElementsByTagName('transformationref');
		var transformationID;
		var transfList = [];
		// reads transformationref or the transformation list
		if(transformationRef != null && transformationRef.length != 0)
		transformationID = this.reader.getString(transformationRef[0], 'id');
		else
		{
			transformationID = null;
			for(var j = 0; j < transformation.children.length; j++)
			transfList.push(this.getTransformationValues(transformation.children[j]));
		}


		var material = component.getElementsByTagName('materials');

		if (material.length == 0) {
			return "materials element is missing com Components";
		}

		var materialLength = material[0].children.length;
		var materialID = [];

		if(materialLength == 0)
		return "every element must include at least a material";

		//reads materialsIDs
		for(var j = 0; j < materialLength; j++)
		materialID[j] = this.reader.getString(material[0].children[j], 'id');


		var texture = component.getElementsByTagName('texture');
		if(texture == null || texture.length == 0) {
			return "texture element is missing on Components";
		}

		texture = this.reader.getString(texture[0], 'id');


		var children = component.getElementsByTagName('children');
		if(children == null || children.length == 0) {
			return "children element is missing on Components";
		}

		children = children[0];
		var componentref = children.getElementsByTagName('componentref');
		var primitiveref = children.getElementsByTagName('primitiveref');
		if(componentref.length == 0 && primitiveref.length == 0) {
			return "children element on Components must contain componentref and/or primitiveref";
		}

		var componentRefs = [];
		var primitiveRefs = [];

		for(var j = 0; j < componentref.length; j++)
		componentRefs[j] = this.reader.getString(componentref[j], 'id');

		for(var j = 0; j < primitiveref.length; j++)
		primitiveRefs[j] = this.reader.getString(primitiveref[j], 'id');

		var animationList = [];

		var animation = component.getElementsByTagName('animation');

		if(animation.length != 0){
		for(var j = 0; j < animation[0].children.length; j++)
			animationList[j] = this.reader.getString(animation[0].children[j], 'id');
		}


		var component = new Component(this.scene, materialID, transformationID, transfList, texture, primitiveRefs, componentRefs, animationList);

		this.componentsList[componentID] = component;
		this.componentsIDs[i] = componentID;

	}
	//console.log(this.componentsList);
}

/*
Reads and stores data from lights element
*/
MySceneGraph.prototype.parseLights = function(rootElement)
{

	var lights = rootElement.getElementsByTagName('lights');

	if(lights == null | lights.length  == 0){
		return "lights element is missing";
	}

	var light = lights[0];
	var nnodes = light.children.length;

	if(nnodes == 0)
	return "there are no lights";

	for(var i = 0; i < nnodes; i++){
		var child = light.children[i];
		//console.log(child.tagName);
		switch(child.tagName){
			case "omni":
			this.parserOmniLights(child);
			break;
			case "spot":
			this.parserSpotLights(child);
			break;
		}
	}
}

/*
Reads and stores data from a omniLight element
*/
MySceneGraph.prototype.parserOmniLights = function(rootElement){

	if(rootElement == null)
	return "error on omni light";

	var omni = this.scene.lights[this.lightIndex];

	omni.disable();
	omni.setVisible(true);

	var id = this.reader.getString(rootElement, 'id');
	var enabled = this.reader.getBoolean(rootElement, 'enabled');

	if(enabled == 1)
	this.scene.lights[this.lightIndex].enable();
	else
	this.scene.lights[this.lightIndex].disable();


	for(var i = 0; i < this.lightIndex; i++){
		if(this.scene.lightsNames[i] == id)
		console.error("light " + id + " repeated");
	}

	this.scene.lightsStatus[this.lightIndex] = enabled;
	this.scene.lightsNames[this.lightIndex] = id;


	var location = this.getNvalues(rootElement.getElementsByTagName('location')[0], this.xyzw);
	var ambient = this.getNvalues(rootElement.getElementsByTagName('ambient')[0], this.rgba);
	var difuse =  this.getNvalues(rootElement.getElementsByTagName('diffuse')[0], this.rgba);
	var specular =  this.getNvalues(rootElement.getElementsByTagName('specular')[0], this.rgba);

	omni.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
	omni.setDiffuse(difuse[0], difuse[1], difuse[2], difuse[3]);
	omni.setSpecular(specular[0], specular[1], specular[2], specular[3]);
	omni.setPosition(location[0],location[1], location[2], location[3]);

	this.omniLightsList[id] = this.scene.lights[this.lightIndex];

	this.lightIndex++;
	omni.update();
}

/*
Reads and stores data from a Spot Light element
*/
MySceneGraph.prototype.parserSpotLights = function(rootElement){

	if(rootElement == null)
	return "error on spot light" ;

	var spot = this.scene.lights[this.lightIndex];

	spot.disable();
	spot.setVisible(true);

	var id = this.reader.getString(rootElement, 'id');
	var enabled = this.reader.getBoolean(rootElement, 'enabled');
	var angle = this.reader.getFloat(rootElement, 'angle');
	var exponent = this.reader.getFloat(rootElement, 'exponent');


	if(enabled == 1)
	this.scene.lights[this.lightIndex].enable();
	else
	this.scene.lights[this.lightIndex].disable();

	for(var i = 0; i < this.lightIndex; i++){
		if(this.scene.lightsNames[i] == id)
		console.error("light " + id + " repeated");
	}

	this.scene.lightsStatus[this.lightIndex] = enabled;
	this.scene.lightsNames[this.lightIndex] = id;

	var target = this.getNvalues(rootElement.getElementsByTagName('target')[0], this.xyz)
	var location = this.getNvalues(rootElement.getElementsByTagName('location')[0], this.xyz);
	var ambient = this.getNvalues(rootElement.getElementsByTagName('ambient')[0], this.rgba);
	var difuse =  this.getNvalues(rootElement.getElementsByTagName('diffuse')[0], this.rgba);
	var specular =  this.getNvalues(rootElement.getElementsByTagName('specular')[0], this.rgba);

	var direction = [];
	for(var j = 0; j < location.length; j++){
		direction[j] = target[j] - location[j];
	}

	spot.setSpotDirection(direction[0], direction[1], direction[2]);
	spot.setSpotExponent(exponent);
	spot.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
	spot.setDiffuse(difuse[0], difuse[1], difuse[2], difuse[3]);
	spot.setSpecular(specular[0], specular[1], specular[2], specular[3]);
	spot.setPosition(location[0],location[1], location[2], 1);

	this.spotLightsList[id] = this.scene.lights[this.lightIndex];

	this.lightIndex++;
	spot.update();
}

/*
returns a filled array with info from the tags passed in the type array
*/
MySceneGraph.prototype.getNvalues = function(rootElement, type){

	if(rootElement == null)
	return "error geting values";

	var tmp = [];

	for(var i = 0; i< type.length; i++){
		tmp[i] = this.reader.getFloat(rootElement,type[i]);
	}

	return tmp;
}


/*
Reads and stores data from primitives element
*/
MySceneGraph.prototype.parsePrimitives = function(rootElement){

	var elems = rootElement.getElementsByTagName('primitives');

	if(elems == null || elems.length != 1){
		return "primitives element is missing or more than one element";
	}

	var prim = elems[0];

	if(prim.children == null|| prim.children.length == 0){
		return "Should have one or more primitives";
	}

	var nnodes = prim.children.length;

	for(var i = 0 ; i < nnodes ; i++){
		var child  = prim.children[i];

		if(child.tagName != 'primitive'){
			return "error got < " + child.tagName + " > instead of <primitive>";
		}

		if(child.children == null | child.children.length != 1 ){
			return "there must be only one primitive";
		}

		var primitiveChild = child.children[0];
		var primitve;

		var id = this.reader.getString(child, 'id');

		if(this.primitivesList.hasOwnProperty(id))
		return "primitive " + id + " repeated";

		//console.log(primitiveChild.tagName);
		switch(primitiveChild.tagName){
			case "rectangle":
			primitive = this.parserRectangle(primitiveChild);
			break;
			case "triangle":
			primitive = this.parserTriangle(primitiveChild);
			break;
			case "cylinder":
			primitive = this.parserCylinder(primitiveChild);
			break;
			case "sphere":
			primitive =  this.parserSphere(primitiveChild);
			break;
			case "torus":
			primitive = this.parserTorus(primitiveChild);
			break;
		}
		this.primitivesIDs[i] = id;
		this.primitivesList[child.id] = primitive;
	}

}

/*
Returns a new rectangle with the data read from the file
*/
MySceneGraph.prototype.parserRectangle = function(element){
	var coord ={
		x1:0,
		x2:0,
		y1:0,
		y2:0
	}

	coord.x1 = this.reader.getFloat(element, 'x1');
	coord.x2 = this.reader.getFloat(element, 'x2');
	coord.y1 = this.reader.getFloat(element, 'y1');
	coord.y2 = this.reader.getFloat(element, 'y2');

	return new MyRectangle(this.scene,coord.x1, coord.x2, coord.y1, coord.y2);
}

/*
Returns a new triangle with the data read from the file
*/
MySceneGraph.prototype.parserTriangle = function(element){
	var coord ={
		x1:0,
		x2:0,
		x3:0,
		y1:0,
		y2:0,
		y3:0,
		z1:0,
		z2:0,
		z3:0
	}

	coord.x1 = this.reader.getFloat(element, 'x1');
	coord.x2 = this.reader.getFloat(element, 'x2');
	coord.x3 = this.reader.getFloat(element, 'x3');
	coord.y1 = this.reader.getFloat(element, 'y1');
	coord.y2 = this.reader.getFloat(element, 'y2');
	coord.y3 = this.reader.getFloat(element, 'y3');
	coord.z1 = this.reader.getFloat(element, 'z1');
	coord.z2 = this.reader.getFloat(element, 'z2');
	coord.z3 = this.reader.getFloat(element, 'z3');

	return new MyTriangle(this.scene,coord.x1, coord.y1, coord.z1 ,coord.x2, coord.y2, coord.z2,coord.x3, coord.y3, coord.z3);
}


/*
Returns a new cylinder with the data read from the file
*/
MySceneGraph.prototype.parserCylinder = function(element){
	var coord ={
		base: 0,
		top: 0,
		height: 0,
		slices: 0,
		stacks: 0
	}

	coord.base = this.reader.getFloat(element, 'base');
	coord.top = this.reader.getFloat(element, 'top');
	coord.height = this.reader.getFloat(element, 'height');
	coord.slices = this.reader.getInteger(element, 'slices');
	coord.stacks = this.reader.getInteger(element, 'stacks');

	return new MyCylinder(this.scene,coord.base, coord.top, coord.height ,coord.slices, coord.stacks);
}


/*
Returns a new sphere with the data read from the file
*/
MySceneGraph.prototype.parserSphere = function(element){
	var coord ={
		radius: 0,
		slices: 0,
		stacks: 0
	}

	coord.radius = this.reader.getFloat(element, 'radius');
	coord.slices = this.reader.getInteger(element, 'slices');
	coord.stacks = this.reader.getInteger(element, 'stacks');

	return new MySphere(this.scene, coord.radius, coord.slices, coord.stacks);
}

/*
Returns a new torus with the data read from the file
*/
MySceneGraph.prototype.parserTorus = function(element){
	var coord ={
		inner: 0,
		outer: 0,
		slices: 0,
		loops:0
	}

	coord.inner = this.reader.getFloat(element, 'inner');
	coord.outer = this.reader.getFloat(element, 'outer');
	coord.slices = this.reader.getInteger(element, 'slices');
	coord.loops = this.reader.getInteger(element, 'loops');

	return new MyTorus(this.scene, coord.inner, coord.outer, coord.slices, coord.loops);
}


/*
	Reads and stores data from animations element
*/
MySceneGraph.prototype.parseAnimations = function(variable){

	var allElements = variable.getElementsByTagName('animations');

	if(allElements == null){
		return "animations element is missing";
	}

	var animations = allElements[0].getElementsByTagName('animation');

	for(var i = 0; i < animations.length; i++ ){
		var element = animations[i];
		var id = this.reader.getString(element, 'id');
		var span = this.reader.getFloat(element, 'span');
		var type = this.reader.getString(element, 'type');
		var controlPoints = [];

		this.animationsIDs[i] = id;

		switch (type) {
			case "linear":
			controlPoints = this.getControlPoints(element, this.doublexyz);

			//console.log("id = " + id + " span= " + span + " type= " + type + " control0= " + controlPoints[0][0] +  " control1= " + controlPoints[0][1] +  " control2= " + controlPoints[0][2]);
			this.animationsList[id] = new LinearAnimation(id, controlPoints, span, this.scene);

			break;
			case "circular":
			var center = [];
			center.push( this.reader.getFloat(element,'centerx'));
			center.push( this.reader.getFloat(element,'centery'));
			center.push( this.reader.getFloat(element,'centerz'));

			var radius = this.reader.getFloat(element, 'radius');
			var startang = this.reader.getFloat(element, 'startang');
			var rotang = this.reader.getFloat(element, 'rotang');
			//console.log("id = " + id + " span= " + span + " type= " + type + " centerX= " + center[0]+ " centerY= " + center[1] + " centerZ= " + center[2] + " radius= " + radius + " startang= "+ startang + " rotang= " + rotang);
			this.animationsList[id] = new CircularAnimation(id, span, center, radius, startang, rotang, this.scene);
			break;
		}
	}
}

/*
reads and return the controlPoints
*/
MySceneGraph.prototype.getControlPoints = function (element, variables){

	var controlPoints = [];

	var control = element.getElementsByTagName('controlpoint');
	for (var j = 0; j < control.length; j++) {
		var x = this.reader.getFloat(control[j],variables[0]);
		var y = this.reader.getFloat(control[j],variables[1]);
		var z = this.reader.getFloat(control[j],variables[2]);

		controlPoints.push([x,y,z,1]);
	}

	return  controlPoints;
}



/*
* Callback to be executed on any read error
*/
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};