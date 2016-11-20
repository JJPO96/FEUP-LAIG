function MySceneGraph(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

    this.root;

    this.rgba = ['r', 'g', 'b', 'a'];
    this.xyzw = ['x', 'y', 'z', 'w'];
    this.xyz = ['x', 'y', 'z'];
    
    this.allTagNames = ['scene', 'views', 'illumination', 'lights', 'textures', 'materials','transformations','primitives', 'components', 'animations'];

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
MySceneGraph.prototype.onXMLReady = function() {
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseLoadOk(rootElement);

    if (error != null) {
        this.onXMLError(error);
        return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};

/*
 * Callback to be executed on any read error
 */

//Function to verify the status of the loading parser
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

//Programed function to any error on dsx
MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};

MySceneGraph.prototype.checkOrder = function(rootElement){

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


//Loading of the scene from dsx
MySceneGraph.prototype.parseScene = function(rootElement) {
    var elems = rootElement.getElementsByTagName('scene');
    if (elems == null) {
        return "scene element is missing.";
    }

    if (elems.length != 1) {
        return "either zero or more than one 'scene' element found.";
    }

    var scene = elems[0];

    this.root = this.reader.getString(scene, 'root');

    this.axis_length = this.reader.getFloat(scene, 'axis_length');

}

//Loading of the views from dsx
MySceneGraph.prototype.parseViews = function(rootElement) {
    elems = rootElement.getElementsByTagName('views')

    if (!elems) {
        return "views missing!";
    }

    var views = elems[0];

    this.views = new Views(this.reader.getString(views, 'default', true));

    var arrViews = views.getElementsByTagName('perspective');

    for (var i = 0; i < arrViews.length; i++) {
        this.views.perspectives.push(this.parsePerspective(arrViews[i]));
    }
}

//Loading of the perspective from dsx
MySceneGraph.prototype.parsePerspective = function(perspective) {
    var temp = new Perspective(this.reader.getString(perspective, "id", true),
        this.reader.getFloat(perspective, "near"),
        this.reader.getFloat(perspective, "far"),
        this.reader.getFloat(perspective, "angle"));

    var fr = perspective.getElementsByTagName("from")[0];
    var to = perspective.getElementsByTagName("to")[0];

    temp.from.push(this.reader.getFloat(fr, "x"));
    temp.from.push(this.reader.getFloat(fr, "y"));
    temp.from.push(this.reader.getFloat(fr, "z"));

    temp.to.push(this.reader.getFloat(to, "x"));
    temp.to.push(this.reader.getFloat(to, "y"));
    temp.to.push(this.reader.getFloat(to, "z"));

    return new MyCamera(temp.id,
        new CGFcamera(temp.angle * Math.PI / 180,
            temp.near,
            temp.far,
            vec3.fromValues(temp.from[0],
                temp.from[1],
                temp.from[2]),
            vec3.fromValues(temp.to[0],
                temp.to[1],
                temp.to[2])));
}

//Loading of the illumination from dsx
MySceneGraph.prototype.parseIllumination = function(rootElement) {
    var elems = rootElement.getElementsByTagName('illumination');
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
        this.reader.getFloat(ambient, 'a')
    ];

    this.illumination.ambient = amb;

    background = background[0];
    var bg = [this.reader.getFloat(background, 'r'),
        this.reader.getFloat(background, 'g'),
        this.reader.getFloat(background, 'b'),
        this.reader.getFloat(background, 'a')
    ];

    this.illumination.background = bg;

}

//Loading of the lights from dsx
MySceneGraph.prototype.parseLights = function(rootElement) {
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

//Loading of the omni lights from dsx
MySceneGraph.prototype.parseOmniLight = function(omni) {
    var ret = new omniLight(this.reader.getString(omni, "id", true),
        this.reader.getBoolean(omni, "enabled"));

    var location = omni.getElementsByTagName("location")[0];
    ret.location.push(this.reader.getFloat(location, "x"));
    ret.location.push(this.reader.getFloat(location, "y"));
    ret.location.push(this.reader.getFloat(location, "z"));
    ret.location.push(this.reader.getFloat(location, "w"));

    var ambient = omni.getElementsByTagName("ambient")[0];
    ret.ambient.push(this.reader.getFloat(ambient, "r"));
    ret.ambient.push(this.reader.getFloat(ambient, "g"));
    ret.ambient.push(this.reader.getFloat(ambient, "b"));
    ret.ambient.push(this.reader.getFloat(ambient, "a"));

    var diffuse = omni.getElementsByTagName("diffuse")[0];
    ret.diffuse.push(this.reader.getFloat(diffuse, "r"));
    ret.diffuse.push(this.reader.getFloat(diffuse, "g"));
    ret.diffuse.push(this.reader.getFloat(diffuse, "b"));
    ret.diffuse.push(this.reader.getFloat(diffuse, "a"));

    var specular = omni.getElementsByTagName("specular")[0];
    ret.specular.push(this.reader.getFloat(specular, "r"));
    ret.specular.push(this.reader.getFloat(specular, "g"));
    ret.specular.push(this.reader.getFloat(specular, "b"));
    ret.specular.push(this.reader.getFloat(specular, "a"));

    return ret;
}

//Loading of the spot lights from dsx
MySceneGraph.prototype.parseSpotLight = function(spot) {

    var ret = new spotLight(this.reader.getString(spot, "id", true),
        this.reader.getBoolean(spot, "enabled"),
        this.reader.getFloat(spot, "angle"),
        this.reader.getFloat(spot, "exponent"));


    var target = spot.getElementsByTagName("target")[0];
    ret.target.push(this.reader.getFloat(target, "x"));
    ret.target.push(this.reader.getFloat(target, "y"));
    ret.target.push(this.reader.getFloat(target, "z"));

    var location = spot.getElementsByTagName("location")[0];
    ret.location.push(this.reader.getFloat(location, "x"));
    ret.location.push(this.reader.getFloat(location, "y"));
    ret.location.push(this.reader.getFloat(location, "z"));

    var ambient = spot.getElementsByTagName("ambient")[0];
    ret.ambient.push(this.reader.getFloat(ambient, "r"));
    ret.ambient.push(this.reader.getFloat(ambient, "g"));
    ret.ambient.push(this.reader.getFloat(ambient, "b"));
    ret.ambient.push(this.reader.getFloat(ambient, "a"));

    var diffuse = spot.getElementsByTagName("diffuse")[0];
    ret.diffuse.push(this.reader.getFloat(diffuse, "r"));
    ret.diffuse.push(this.reader.getFloat(diffuse, "g"));
    ret.diffuse.push(this.reader.getFloat(diffuse, "b"));
    ret.diffuse.push(this.reader.getFloat(diffuse, "a"));

    var specular = spot.getElementsByTagName("specular")[0];
    ret.specular.push(this.reader.getFloat(specular, "r"));
    ret.specular.push(this.reader.getFloat(specular, "g"));
    ret.specular.push(this.reader.getFloat(specular, "b"));
    ret.specular.push(this.reader.getFloat(specular, "a"));

    return ret;
}

//Loading of the textures from dsx
MySceneGraph.prototype.parseTextures = function(rootElement) {

    var textures = rootElement.getElementsByTagName('textures');

    if (textures == null || textures.length == 0) {
        return "textures element is missing.";
    }

    var numText = textures[0].children.length;

    if (numText <= 0)
        return "texture elements are missing";

    for (var i = 0; i < numText; i++) {
        var e = textures[0].children[i];
        // process each element and store its information
        var id = e.attributes.getNamedItem("id").value;
        var file = e.attributes.getNamedItem("file").value;
        var length_s = e.attributes.getNamedItem("length_s").value;
        var length_t = e.attributes.getNamedItem("length_t").value;


        if (this.texturesList.hasOwnProperty(id))
            console.warn("texture " + id + " repeated");

        var text = new CGFtexture(this.scene, file);
        this.texturesList[id] = text;
        this.texturesList[id + "s"] = length_s;
        this.texturesList[id + "t"] = length_t;
        this.texturesID[i] = id;
    };

}

//Loading of the materials from dsx
MySceneGraph.prototype.parseMaterials = function(rootElement) {
        var component = ['emission', 'ambient', 'diffuse', 'specular'];

        var materials = rootElement.getElementsByTagName('materials');

        if (materials == null || materials.length == 0) {
            return "materials element is missing.";
        }


        var ltMaterial = materials[0].getElementsByTagName('material');

        for (var i = 0; i < ltMaterial.length; i++) {

            var id = ltMaterial[i].attributes.getNamedItem("id").value;

            if (id === null)
                continue;

            var material = [];

            var x = ltMaterial[i].getElementsByTagName('shininess')[0];
            material[4] = x.getAttribute("value");

            for (var j = 0; j < component.length; j++) {

                var att = ltMaterial[i].getElementsByTagName(component[j]);

                material[j] = [];
                for (var k = 0; k < this.rgba.length; k++) {
                    material[j][k] = att[0].getAttribute(this.rgba[k]);
                   
                }

            }
            if (this.materialsList.hasOwnProperty(id))
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

//Loading of the transformations from dsx
MySceneGraph.prototype.parseTransformations = function(rootElement) {

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

//Function to calculate the values from transformations
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

}


//Loading of the primitives from dsx
MySceneGraph.prototype.parsePrimitives = function(rootElement) {


    var elems = rootElement.getElementsByTagName('primitives');

    if (elems == null || elems.length != 1) {
        return "primitives element is missing or more than one element";
    }

    var prim = elems[0];

    if (prim.children == null || prim.children.length == 0) {
        return "Should have one or more primitives";
    }

    var nnodes = prim.children.length;

    for (var i = 0; i < nnodes; i++) {
        var child = prim.children[i];

        if (child.tagName != 'primitive') {
            return "error got < " + child.tagName + " > instead of <primitive>";
        }

        if (child.children == null | child.children.length != 1) {
            return "there must be just only one primitive";
        }

        var primitiveChild = child.children[0];
        var primitve;

        var id = this.reader.getString(child, 'id');

        if (this.primitivesList.hasOwnProperty(id))
            return "primitive " + id + " repeated";

        switch (primitiveChild.tagName) {
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
                primitive = this.parserSphere(primitiveChild);
                break;
            case "torus":
                primitive = this.parserTorus(primitiveChild);
                break;
            case "chessboard":
            	primitive = this.parserChessboard(primitiveChild);
            	break;

        }
        this.primitivesIDs[i] = id;
        this.primitivesList[child.id] = primitive;
    }
};

//Loading of the components from dsx
MySceneGraph.prototype.parseComponents = function(rootElement) {

	//-----------------------------------------------------
	//----------------------COMPONENT----------------------
	//-----------------------------------------------------
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
		
		//----------------------------------------------------------
		//----------------------TRANSFORMATION----------------------
		//----------------------------------------------------------
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
		
		//-----------------------------------------------------
		//----------------------ANIMATION----------------------
		//-----------------------------------------------------
		var animationList = [];

		var animation = component.getElementsByTagName('animation');

		if(animation.length != 0){
		for(var j = 0; j < animation[0].children.length; j++)
			animationList[j] = this.reader.getString(animation[0].children[j], 'id');
		}

		//----------------------------------------------------	
		//----------------------MATERIAL----------------------
		//----------------------------------------------------
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
		
		//---------------------------------------------------
		//----------------------TEXTURE----------------------
		//---------------------------------------------------
		var texture = component.getElementsByTagName('texture');
		if(texture == null || texture.length == 0) {
			return "texture element is missing on Components";
		}

		texture = this.reader.getString(texture[0], 'id');
		
		//----------------------------------------------------
		//----------------------CHILDREN----------------------
		//----------------------------------------------------
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


		var component = new Component(this.scene, materialID, transformationID, transfList, texture, primitiveRefs, componentRefs, animationList);

		this.componentsList[componentID] = component;
		this.componentsIDs[i] = componentID;

	}

}



//Loading of the rectangle from dsx
MySceneGraph.prototype.parserRectangle = function(element) {
    var coord = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0
    }

    coord.x1 = this.reader.getFloat(element, 'x1');
    coord.x2 = this.reader.getFloat(element, 'x2');
    coord.y1 = this.reader.getFloat(element, 'y1');
    coord.y2 = this.reader.getFloat(element, 'y2');

    return new MyRectangle(this.scene, coord.x1, coord.x2, coord.y1, coord.y2);
}

//Loading of the triangle from dsx
MySceneGraph.prototype.parserTriangle = function(element) {

    var coord = {
        x1: 0,
        x2: 0,
        x3: 0,
        y1: 0,
        y2: 0,
        y3: 0,
        z1: 0,
        z2: 0,
        z3: 0
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

    return new MyTriangle(this.scene, coord.x1, coord.y1, coord.z1, coord.x2, coord.y2, coord.z2, coord.x3, coord.y3, coord.z3);
}

//Loading of the cylinder from dsx
MySceneGraph.prototype.parserCylinder = function(element) {

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

MySceneGraph.prototype.getNvalues = function(rootElement, type){

	if(rootElement == null)
	return "error geting values";

	var tmp = [];

	for(var i = 0; i< type.length; i++){
		tmp[i] = this.reader.getFloat(rootElement,type[i]);
	}

	return tmp;
}

MySceneGraph.prototype.parserChessBoard = function(element){
	var textureRef = this.reader.getString(element, 'textureref');
	var texture = this.texturesList[textureRef];

	var du = this.reader.getInteger(element, 'du');
	var dv = this.reader.getInteger(element, 'dv');
	var su = this.reader.getInteger(element, 'su');
	var sv = this.reader.getInteger(element, 'sv');

	var c1 = this.getNvalues(element.getElementsByTagName('c1')[0], this.rgba);
	var c2 = this.getNvalues(element.getElementsByTagName('c2')[0], this.rgba);
	var cs = this.getNvalues(element.getElementsByTagName('cs')[0], this.rgba);

	/*console.log("texture= "+ textureRef + "  du= " + du + " dv = " + dv + " su= " + su + " sv = " + sv  );
	console.log(c1);
	console.log(c2);
	console.log(cs);*/


	return new MyChessboard(this.scene, du, dv, texture, su, sv, c1, c2, cs);

}

//Loading of the sphere from dsx
MySceneGraph.prototype.parserSphere = function(element) {

    return new MySphere(this.scene,
        this.reader.getFloat(element, 'radius'),
        this.reader.getInteger(element, 'slices'),
        this.reader.getInteger(element, 'stacks'));
}

//Loading of the torus from dsx
MySceneGraph.prototype.parserTorus = function(element) {

    return new MyTorus(this.scene,
        this.reader.getFloat(element, 'inner'),
        this.reader.getInteger(element, 'outer'),
        this.reader.getInteger(element, 'slices'),
        this.reader.getInteger(element, 'loops'));

}

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

MySceneGraph.prototype.getControlPoints = function (element, variables){

	var controlPoints = [];

	var control = element.getElementsByTagName('controlpoint');
	
	/*for (var j = 0; j < control.length; j++) {
		var x = this.reader.getFloat(control[j],variables[0]);
		var y = this.reader.getFloat(control[j],variables[1]);
		var z = this.reader.getFloat(control[j],variables[2]);

		controlPoints.push([x,y,z,1]);
	}*/

	return controlPoints;
}
	