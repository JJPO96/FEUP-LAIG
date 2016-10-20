function CylinderBody(scene, base, top, height, slices, stacks) {
	CGFobject.call(this,scene);

	this.base = base;
	this.top = top;
	this.height = height;
	this.slices = slices;
	this.stacks = stacks;

	this.initBuffers();
};

CylinderBody.prototype = Object.create(CGFobject.prototype);
CylinderBody.prototype.constructor = CylinderBody;

CylinderBody.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var angRt = (2*Math.PI) / this.slices;
	var hRt = this.height / this.stacks;
	var radRt = (this.top - this.base) / this.stacks;

	for (var st = 0; st <= this.stacks; st++) {
		var z = st * hRt;
		var radius = this.top - st * radRt;

		for (var sl = 0; sl <= this.slices; sl++) {
			var x = radius * Math.cos(sl * angRt);
			var y = radius * Math.sin(sl * angRt);
			var s = 1 - (st / this.stacks);
			var t = 1 - (sl / this.slices);

			this.vertices.push(x, y, z);
			this.normals.push(x, y, 0);
			this.texCoords.push(s, t);
		}
	}


	for (var st = 0; st < this.stacks; st++) {
		for (var sl = 0; sl < this.slices; sl++) {
			var a = (st * (this.slices + 1)) + sl;
			var b = a + this.slices + 1;

			this.indices.push(a, b + 1, b);
			this.indices.push(a, a + 1, b + 1);
		}
	}


	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
