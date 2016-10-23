function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;
	
	this.rgba = ['r', 'g', 'b', 'a'];
	this.xyzw = ['x', 'y', 'z', 'w'];
	this.xyz = ['x', 'y', 'z'];

	this.sceneAtr;
	this.views;
	this.illumination;
	this.omniLights = [];
	this.spotLights = [];


	this.nodes = {};

	this.texturesList = {};
	this.texturesID = [];

	this.materialsList = {};
	this.materialsIDs = [];

	this.primitivesList = {};
	this.primitivesIDs = [];

	this.componentsList = {};
	this.componentsIDs = [];

	this.transformationList = {};
	this.transformationsIDs = [];
	
	this.primitivesList = {};
	this.primitivesIDs = [];


	// File reading
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/submissionDSX.xml', this);
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
	this.parseTextures(rootElement);
	this.parseMaterials(rootElement);
	this.parseTransformations(rootElement);
	this.parsePrimitives(rootElement);
	this.parseComponents(rootElement);

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
	
	this.root = this.reader.getString(scene, 'root');

	this.axis_length = this.reader.getFloat(scene, 'axis_length');
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
	var temp = new Perspective(this.reader.getString(perspective,"id",true),
														this.reader.getFloat(perspective,"near"),
														this.reader.getFloat(perspective,"far"),
														this.reader.getFloat(perspective,"angle"));

	var fr = perspective.getElementsByTagName("from")[0];
	var to = perspective.getElementsByTagName("to")[0];

	temp.from.push(this.reader.getFloat(fr,"x"));
	temp.from.push(this.reader.getFloat(fr,"y"));
	temp.from.push(this.reader.getFloat(fr,"z"));

	temp.to.push(this.reader.getFloat(to,"x"));
	temp.to.push(this.reader.getFloat(to,"y"));
	temp.to.push(this.reader.getFloat(to,"z"));

	return new MyCamera(temp.id,
												new CGFcamera(temp.angle * Math.PI/180,
																			temp.near,
																			temp.far,
																			vec3.fromValues(temp.from[0],
																											temp.from[1],
																											temp.from[2]),
																			vec3.fromValues(temp.to[0],
																											temp.to[1],
 																											temp.to[2])));
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

		ambient = ambient[0];
	var amb = [this.reader.getFloat(ambient, 'r'),
						 this.reader.getFloat(ambient, 'g'),
						 this.reader.getFloat(ambient, 'b'),
						 this.reader.getFloat(ambient, 'a')];

	this.illumination.ambient = amb;

	background = background[0];
	var bg = [this.reader.getFloat(background, 'r'),
						this.reader.getFloat(background, 'g'),
						this.reader.getFloat(background, 'b'),
						this.reader.getFloat(background, 'a')];

	this.illumination.background = bg;

	}

MySceneGraph.prototype.parseLights = function(rootElement){
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

		return ret;
}

MySceneGraph.prototype.parseTextures = function(rootElement){

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

		var text = new Texture(this.scene,id, file,length_s,length_t);
		this.texturesList[id] = text;
		this.texturesList[id + "s"] = length_s;
		this.texturesList[id + "t"] = length_t;
		this.texturesID[i] = id;
		
	};
}

MySceneGraph.prototype.parseMaterials= function(rootElement) {
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

MySceneGraph.prototype.parseMaterial= function(material) {
	var ret = new Material(this.reader.getString(material,"id",true));

	var emission = material.getElementsByTagName("emission")[0];
	var ambient = material.getElementsByTagName("ambient")[0];
	var diffuse = material.getElementsByTagName("diffuse")[0];
	var specular = material.getElementsByTagName("specular")[0];
	var shininess = material.getElementsByTagName("shininess")[0];

	ret.material.setEmission(
						this.reader.getFloat(emission, "r"),
						this.reader.getFloat(emission, "g"),
						this.reader.getFloat(emission, "b"),
						this.reader.getFloat(emission, "a"));

	ret.material.setAmbient(
						this.reader.getFloat(ambient, "r"),
						this.reader.getFloat(ambient, "g"),
						this.reader.getFloat(ambient, "b"),
						this.reader.getFloat(ambient, "a"));

	ret.material.setDiffuse(
						this.reader.getFloat(diffuse, "r"),
						this.reader.getFloat(diffuse, "g"),
						this.reader.getFloat(diffuse, "b"),
						this.reader.getFloat(diffuse, "a"));

	ret.material.setSpecular(
						this.reader.getFloat(specular, "r"),
						this.reader.getFloat(specular, "g"),
						this.reader.getFloat(specular, "b"),
						this.reader.getFloat(specular, "a"));

	ret.material.setShininess(this.reader.getFloat(shininess, "value"));
var id = material.attributes.getNamedItem("id").value;
	this.materialsList[id] = ret;

	return ret;
}

/*MySceneGraph.prototype.parseTransformations= function(rootElement) {
	elems = rootElement.getElementsByTagName('transformations')
	if (!elems) {
      return "transformations missing!";
  }

	var transformations = elems[0];

	var arrTransformations = transformations.getElementsByTagName('transformation');
	for (var i = 0; i < arrTransformations.length; i++) {

		this.transformations.push(this.parseTransformation(arrTransformations[i]));
	}

	for (var i = 0; i < arrTransformations.length; i++) {
		this.transformationsIDs[i] = this.transformations[this.transformations.length-1].id;
		this.transformationList[this.transformationsIDs[i]] = transformations;
	}
}

MySceneGraph.prototype.parseTransformation= function(transformation) {
	var ret = new Transformation(this.reader.getString(transformation,"id",true));
	var children = transformation.children;


	for (var i = children.length-1; i >= 0; i--) {
			ret.matrix = MultiplyMatrix(ret.matrix,this.parseTransChild(children[i]));
	}

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
}*/

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
}


MySceneGraph.prototype.parsePrimitives = function (rootElement) {


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
};

MySceneGraph.prototype.parsePrimitive= function(primitive) {
	var ret = new Primitive(this.reader.getString(primitive,"id",true));

	if (primitive.children[0].nodeName == "rectangle") {
		ret.primitive = this.parserRectangle(primitive.children[0]);
	} else if (primitive.children[0].nodeName == "triangle"){
		ret.primitive = this.parserTriangle(primitive.children[0]);
	} else if (primitive.children[0].nodeName == "cylinder"){
		ret.primitive = this.parserCylinder(primitive.children[0]);
	} else if (primitive.children[0].nodeName == "sphere"){
		ret.primitive = this.parserSphere(primitive.children[0]);
	} else if (primitive.children[0].nodeName == "torus"){
		ret.primitive = this.parserTorus(primitive.children[0]);
	}

	this.primitivesList[this.reader.getString(primitive,"id",true)] = ret.primitive;

	return ret;
}


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


		var component = new Component(this.scene, materialID, transformationID, transfList, texture, primitiveRefs, componentRefs);

		this.componentsList[componentID] = component;
		this.componentsIDs[i] = componentID;

	}

}

MySceneGraph.prototype.getTransformationValues = function(transformation){
//	console.log(transformation);
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
	return new MyRectangle(this.scene,
														this.reader.getFloat(element, 'x1'),
														this.reader.getFloat(element, 'x2'),
														this.reader.getFloat(element, 'y1'),
														this.reader.getFloat(element, 'y2'));
}

MySceneGraph.prototype.parserTriangle = function(element){

	return new MyTriangle(this.scene,
													this.reader.getFloat(element, 'x1'),
													this.reader.getFloat(element, 'x2'),
													this.reader.getFloat(element, 'x3'),
													this.reader.getFloat(element, 'y1'),
													this.reader.getFloat(element, 'y2'),
													this.reader.getFloat(element, 'y3'),
													this.reader.getFloat(element, 'z1'),
													this.reader.getFloat(element, 'z2'),
													this.reader.getFloat(element, 'z3') );
}

MySceneGraph.prototype.parserCylinder = function(element){

	return new MyCylinder(this.scene,
												this.reader.getFloat(element, 'base'),
		 										this.reader.getFloat(element, 'top'),
												this.reader.getFloat(element, 'height'),
												this.reader.getInteger(element, 'slices'),
												this.reader.getInteger(element, 'stacks'));

}

MySceneGraph.prototype.parserSphere = function(element){

	return new MySphere(this.scene,
												this.reader.getFloat(element, 'radius'),
												this.reader.getInteger(element, 'slices'),
												this.reader.getInteger(element, 'stacks'));
}

MySceneGraph.prototype.parserTorus = function(element){

	return new MyTorus(this.scene,
												this.reader.getFloat(element, 'inner'),
												this.reader.getInteger(element, 'outer'),
												this.reader.getInteger(element, 'stacks'),
												this.reader.getInteger(element, 'loops'));

}
