
function MyCylinder(scene,base,top,height,slices,stacks) {
	GFobject.call(this,scene);

  this.base = base;
	this.top = top;
	this.height = height;
	this.slices = slices;
	this.stacks = stacks;

	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor=MyCylinder;

MyCylinder.prototype.initBuffers = function () {
	this.baseDraw = new Circle(this.scene,this.base,this.slices);
	this.topDraw = new Circle(this.scene,this.top,this.slices);
	this.bodyDraw = new CylinderBody(this.scene,this.base,this.top,this.height,this.slices,this.stacks);

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
