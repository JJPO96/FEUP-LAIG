
function MyRectangle(scene,x1,x2,y1,y2,minS = 0,minT = 0,maxS = 1,maxT = 1) {
	CGFobject.call(this, scene);

  this.x1 = x1;
  this.x2 = x2;
  this.y1 = y1;
  this.y2 = y2;

  this.minS = minS;
	this.minT = minT;
	this.maxS = maxS;
	this.maxT = maxT;

	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
		this.x1, this.y1, 0,
	  this.x2, this.y1, 0,
	  this.x1, this.y2, 0,
  	this.x2, this.y2, 0
	];

	this.indices = [
	    0, 1, 2,
		  2, 1, 3
	];

	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
  ];

	this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.minS, this.minT,
		this.maxS, this.minT
	];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype.updateTexCoords = function (ampS, ampT) {
	this.texCoords = [
			0.0, 1.0,
			this.diffX/ampS, 1.0,
			this.diffX/ampS, 1.0 - (this.diffY/ampT),
			0.0, 1.0 - (this.diffY/ampT)
	    ];

			 this.updateTexCoordsGLBuffers();
}
