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
MySceneGraph.prototype.onXMLReady=function(){
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
	this.parseMaterials(rootElement);
	this.parseTransformations(rootElement);
	this.parsePrimitives(rootElement);
	//this.parseComponents(rootElement);

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

	ret.from.push(this.reader.getFloat(fr,"x"));
	ret.from.push(this.reader.getFloat(fr,"y"));
	ret.from.push(this.reader.getFloat(fr,"z"));

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
	var ret = new omniLight(this.reader.getString(omni,"id",true),
													this.reader.getBoolean(omni,"enabled"));

  var location = omni.getElementsByTagName("location")[0];
	ret.location.push(this.reader.getFloat(location,"x"));
	ret.location.push(this.reader.getFloat(location,"y"));
	ret.location.push(this.reader.getFloat(location,"z"));
	ret.location.push(this.reader.getFloat(location,"w"));

	var ambient = omni.getElementsByTagName("ambient")[0];
	ret.ambient.push(this.reader.getFloat(ambient,"r"));
	ret.ambient.push(this.reader.getFloat(ambient,"g"));
	ret.ambient.push(this.reader.getFloat(ambient,"b"));
	ret.ambient.push(this.reader.getFloat(ambient,"a"));

	var diffuse = omni.getElementsByTagName("diffuse")[0];
	ret.diffuse.push(this.reader.getFloat(diffuse,"r"));
	ret.diffuse.push(this.reader.getFloat(diffuse,"g"));
	ret.diffuse.push(this.reader.getFloat(diffuse,"b"));
	ret.diffuse.push(this.reader.getFloat(diffuse,"a"));

	var specular = omni.getElementsByTagName("specular")[0];
	ret.specular.push(this.reader.getFloat(specular,"r"));
	ret.specular.push(this.reader.getFloat(specular,"g"));
	ret.specular.push(this.reader.getFloat(specular,"b"));
	ret.specular.push(this.reader.getFloat(specular,"a"));

	return ret;
}

MySceneGraph.prototype.parseSpotLight = function(spot){

		var ret = new spotLight(this.reader.getString(spot,"id",true),
														this.reader.getBoolean(spot,"enabled"),
														this.reader.getFloat(spot,"angle"),
														this.reader.getFloat(spot,"exponent"));


  	var target = spot.getElementsByTagName("target")[0];
		ret.target.push(this.reader.getFloat(target,"x"));
		ret.target.push(this.reader.getFloat(target,"y"));
		ret.target.push(this.reader.getFloat(target,"z"));

	  var location = spot.getElementsByTagName("location")[0];
		ret.location.push(this.reader.getFloat(location,"x"));
		ret.location.push(this.reader.getFloat(location,"y"));
		ret.location.push(this.reader.getFloat(location,"z"));

		var ambient = spot.getElementsByTagName("ambient")[0];
		ret.ambient.push(this.reader.getFloat(ambient,"r"));
		ret.ambient.push(this.reader.getFloat(ambient,"g"));
		ret.ambient.push(this.reader.getFloat(ambient,"b"));
		ret.ambient.push(this.reader.getFloat(ambient,"a"));

		var diffuse = spot.getElementsByTagName("diffuse")[0];
		ret.diffuse.push(this.reader.getFloat(diffuse,"r"));
		ret.diffuse.push(this.reader.getFloat(diffuse,"g"));
		ret.diffuse.push(this.reader.getFloat(diffuse,"b"));
		ret.diffuse.push(this.reader.getFloat(diffuse,"a"));

		var specular = spot.getElementsByTagName("specular")[0];
		ret.specular.push(this.reader.getFloat(specular,"r"));
		ret.specular.push(this.reader.getFloat(specular,"g"));
		ret.specular.push(this.reader.getFloat(specular,"b"));
		ret.specular.push(this.reader.getFloat(specular,"a"));
}

MySceneGraph.prototype.parseTextures = function(rootElement){

	var textures = rootElement.getElementsByTagName('textures');

	if (textures == null  || textures.length==0) {
		onXMLError("textures element is missing.");
	}

	this.textureList=[];

	var numText = textures[0].children.length;

	if(numText <= 0)
		onXMLError("texture elements are missing");

	for (var i = 0; i < numText; i++)
	{
		var e = textures[0].children[i];
		// process each element and store its information
		this.textureList[e.id] = e.attributes.getNamedItem("id").value;
		this.textureList[e.file] = e.attributes.getNamedItem("file").value;
		this.textureList[e.s] = e.attributes.getNamedItem("length_s").value;
		this.textureList[e.t] = e.attributes.getNamedItem("length_t").value;

		console.log("Texture read from file: ID = " + this.textureList[e.id] + ", File = " + this.textureList[e.file] + ",S Length = " + this.textureList[e.s] + ",T Length = " + this.textureList[e.t]);
	};
}

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	elems = rootElement.getElementsByTagName('materials')

	if (!elems) {
      return "materials missing!";
  }

	var materials = elems[0];

	this.materials = [];
	var arrMaterials = materials.getElementsByTagName('material');

	for (var i = 0; i < arrMaterials.length; i++) {
		this.materials.push(this.parseMaterial(arrMaterials[i]));
	}


}

MySceneGraph.prototype.parseMaterial= function(material) {
	var ret = new Material(this.reader.getString(material,"id",true));

	var emission = material.getElementsByTagName("emission")[0];
	var ambient = material.getElementsByTagName("ambient")[0];
	var diffuse = material.getElementsByTagName("diffuse")[0];
	var specular = material.getElementsByTagName("specular")[0];
	var shininess = material.getElementsByTagName("shininess")[0];

	ret.emission.push(this.reader.getFloat(emission,"r"));
	ret.emission.push(this.reader.getFloat(emission,"g"));
	ret.emission.push(this.reader.getFloat(emission,"b"));
	ret.emission.push(this.reader.getFloat(emission,"a"));

	ret.ambient.push(this.reader.getFloat(ambient,"r"));
	ret.ambient.push(this.reader.getFloat(ambient,"g"));
	ret.ambient.push(this.reader.getFloat(ambient,"b"));
	ret.ambient.push(this.reader.getFloat(ambient,"a"));

	ret.diffuse.push(this.reader.getFloat(diffuse,"r"));
	ret.diffuse.push(this.reader.getFloat(diffuse,"g"));
	ret.diffuse.push(this.reader.getFloat(diffuse,"b"));
	ret.diffuse.push(this.reader.getFloat(diffuse,"a"));

	ret.specular.push(this.reader.getFloat(specular,"r"));
	ret.specular.push(this.reader.getFloat(specular,"g"));
	ret.specular.push(this.reader.getFloat(specular,"b"));
	ret.specular.push(this.reader.getFloat(specular,"a"));

	ret.shininess = this.reader.getFloat(shininess,"value")
	;

	return ret;
}

MySceneGraph.prototype.parseTransformations= function(rootElement) {
	elems = rootElement.getElementsByTagName('transformations')
	if (!elems) {
      return "transformations missing!";
  }

	var transformations = elems[0];

	this.transformations = [];
	var arrTransformations = transformations.getElementsByTagName('transformation');

	for (var i = 0; i < arrTransformations.length; i++) {
		this.transformations.push(this.parseTransformation(arrTransformations[i]));
	}
}

MySceneGraph.prototype.parseTransformation= function(transformation) {
	var ret = new Transformation(this.reader.getString(transformation,"id",true));
	var children = transformation.children;

	console.log("ID: " + ret.getID() + "\n");

	for (var i = children.length-1; i >= 0; i--) {
		console.log(ret.matrix[0]);
		console.log(ret.matrix[1]);
		console.log(ret.matrix[2]);
		console.log(ret.matrix[3]);
		ret.matrix = MultipleMatrix(ret.matrix,this.parseTransChild(children[i]));
	}
		console.log(ret.matrix[0]);
		console.log(ret.matrix[1]);
		console.log(ret.matrix[2]);
		console.log(ret.matrix[3]);

	;
	return ret;
}

MySceneGraph.prototype.parseTransChild= function(child){
	if(child.nodeName == "translate"){
		var tx = this.reader.getFloat(child,"x");
		var ty = this.reader.getFloat(child,"y");
		var tz = this.reader.getFloat(child,"z");

		return [[1,0,0,tx],
						[0,1,0,ty],
						[0,0,1,tz],
						[0,0,0,1]];

	}else if(child.nodeName == "rotate"){
		var rAxis = this.reader.getFloat(child,"axis");
		var rAngle = this.reader.getFloat(child,"angle");
		rAngle *= (Math.PI/180);

		if (rAxis = "x") {
			return [[1,0,0,0],
							[0,Math.cos(rAngle),-Math.sin(rAngle),0],
							[0,Math.sin(rAngle),Math.cos(rAngle),0],
							[0,0,0,1]];

		}else if (rAxis = "y") {
			return [[Math.cos(rAngle),0,-Math.sin(rAngle),0],
							[0,1,0,0],
							[Math.sin(rAngle),0,Math.cos(rAngle),0],
							[0,0,0,1]];

		}else if (rAxis = "z") {
			return [[Math.cos(rAngle),-Math.sin(rAngle),0,0],
							[Math.sin(rAngle),Math.cos(rAngle),0,0],
							[0,0,1,0],
							[0,0,0,1]];
		}
	}else if(child.nodeName == "scale"){
		var sx = this.reader.getFloat(child,"x");
		var sy = this.reader.getFloat(child,"y");
		var sz = this.reader.getFloat(child,"z");

		return [[sx,0,0,0],
						[0,sy,0,0],
						[0,0,sz,0],
						[0,0,0,1]];
	}
}

MySceneGraph.prototype.parsePrimitives = function (rootElement) {

};

MySceneGraph.prototype.parseComponents= function(rootElement) {

	var components = rootElement.getElementsByTagName('components');

	if (components == null  || components.length==0) {
		return "components element is missing.";
	}

	var compLength = components[0].children.length;
	for(var i = 0; i < compLength; i++)
	{
		var component = components[0].children[i];

		var componentID = this.reader.getString(component, 'id');
		console.log("componemt " + componentID);
		var transformation = component.getElementsByTagName('transformation');

		if(transformation == null) {
			return "transformation element is missing on Components";
		}

		transformation = transformation[0];
		var transformationRef = transformation.getElementsByTagName('transformationref');
		var transformationListID = [];
		if(transformationRef != null && transformationRef.length != 0)
		{
			transformationListID[0] = this.reader.getString(transformationRef[0], 'id');
			console.log("Transformation Ref ID = " +  transformationListID[0]);
		}
		else
		{
			transformationList = this.parseTransformationElements(transformation);
		}


		var material = component.getElementsByTagName('materials');

		if (material.length == 0) {
			return "materials element is missing com Components";
		}

		var materialLength = material[0].children.length;
		var materialID = [];

		for(var j = 0; j < materialLength; j++)
		{
			materialID[j] = this.reader.getString(material[0].children[j], 'id');
			console.log("Material ID = " +  materialID[j]);
		}

		var texture = component.getElementsByTagName('texture');
		if(texture == null || texture.length == 0) {
			return "texture element is missing on Components";
		}

		texture = this.reader.getString(texture[0], 'id');

		console.log("Texture = " + texture);


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
		var childrenIDs = [];

		for(var j = 0; j < componentref.length; j++)
		{
			componentRefs[j] = this.reader.getString(componentref[j], 'id');
			console.log("componentref = " + componentRefs[j]);
		}
		console.log("tamanho primitiveref                         " + primitiveref.length);
		for(var j = 0; j < primitiveref.length; j++)
		{
			primitiveRefs[j] = this.reader.getString(primitiveref[j], 'id');
			console.log("primitiveref = " + primitiveRefs[j]);
		}
		var x = componentRefs;
		var childrenIDs = x.concat(primitiveRefs);
		console.log("tamanho dos filhos" + childrenIDs.length);
		var component = new Component(this.scene, materialID, transformationListID, texture, primitiveRefs, componentRefs, childrenIDs);

		this.componentsList[componentID] = component;
		this.componentsIDs[i] = componentID;
		this.nodes[componentID] = component;
	}

	console.log(this.nodes);
}


MySceneGraph.prototype.parseTransformationElements = function(rootElement)
{
	var transformationList = [];

	var translate = rootElement.getElementsByTagName('translate');
	if (translate[0] != null)
	{
		transformationList[0] = translate[0].attributes.getNamedItem("x").value;
		transformationList[1] = translate[0].attributes.getNamedItem("y").value;
		transformationList[2] = translate[0].attributes.getNamedItem("z").value;
	}
	else
	{
		transformationList[0] = 0;
		transformationList[1] = 0;
		transformationList[2] = 0;
	}

	var rotate = rootElement.getElementsByTagName('rotate');
	if (rotate[0] != null)
	{
		transformationList[3] = rotate[0].attributes.getNamedItem("axis").value;
		transformationList[4] = rotate[0].attributes.getNamedItem("angle").value;
	}
	else
	{
		transformationList[3] = 0;
		transformationList[4] = 0;
	}


	var scale = rootElement.getElementsByTagName('scale');
	if (scale[0] != null)
	{
		transformationList[5] = scale[0].attributes.getNamedItem("x").value;
		transformationList[6] = scale[0].attributes.getNamedItem("y").value;
		transformationList[7] = scale[0].attributes.getNamedItem("z").value;
	}
	else
	{
		transformationList[5] = 0;
		transformationList[6] = 0;
		transformationList[7] = 0;
	}

	console.log("Transformation read from file (component): " +  " TX = " + transformationList[0] +  " TY = " + transformationList[1] +  " TZ = " + transformationList[2]
	+ " Rotation axis: " + transformationList[3] + " R Angle " + transformationList[4]
	+ " SX = " + transformationList[5] + " SY = " +  transformationList[6] + " SZ = " + transformationList[7]);

	return transformationList;

}

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

	return new Rectangle(this.scene,coord.x1, coord.x2, coord.y1, coord.y2);
}

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

	return new Triangle(this.scene,coord.x1, coord.y1, coord.z1 ,coord.x2, coord.y2, coord.z2,coord.x3, coord.y3, coord.z3);
}

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

	return new Cylinder(this.scene,coord.base, coord.top, coord.height ,coord.slices, coord.stacks);

}


MySceneGraph.prototype.parserSphere = function(element){

	var coord ={
		radius: 0,
		slices: 0,
		stacks: 0
	}

	coord.radius = this.reader.getFloat(element, 'radius');
	coord.slices = this.reader.getInteger(element, 'slices');
	coord.stacks = this.reader.getInteger(element, 'stacks');


	return new Sphere(this.scene, coord.radius, coord.slices, coord.stacks);

}

