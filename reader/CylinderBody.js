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

	for (var stack = 0; stack <= this.stacks; stack++) {
		var z = stack * hRt;
		var radius = this.top - stack * radRt;

		for (var slice = 0; slice <= this.slices; slice++) {
			var x = radius * Math.cos(slice * angRt);
			var y = radius * Math.sin(slice * angRt);
			var s = 1 - (stack / this.stacks);
			var t = 1 - (slice / this.slices);

			this.vertices.push(x, y, z);
			this.normals.push(x, y, 0);
			this.texCoords.push(s, t);
		}
	}


	for (var stack = 0; stack < this.stacks; stack++) {
		for (var slice = 0; slice < this.slices; slice++) {
			var p1 = (stack * (this.slices + 1)) + slice;
			var p2 = p1 + this.slices + 1;

			this.indices.push(p1, p2 + 1, p2);
			this.indices.push(p1, p1 + 1, p2 + 1);
		}
	}


	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
