function Circle(scene, slices) {
	CGFobject.call(this,scene);

	this.radius = radius;
	this.slices = slices;

	this.initBuffers();
};

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.initBuffers = function() {
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];


	var angle = (2*Math.PI) / this.slices;
	var ind = 1;

	this.vertices.push(0, 0, 0);
	this.normals.push(0, 0, 1);
	this.texCoords.push(0.5, 0.5);

	for (i = 0; i <= this.slices; i++) {
		var x = this.radius * Math.cos(i*ang);
		var y = this.radius * Math.sin(i*ang);

		this.vertices.push(x, y, 0);
		this.normals.push(0, 0, 1);

		this.texCoords.push(0.5 + 0.5 * x, 0.5 - 0.5 * y);

		if (i > 1) {
			this.indices.push(ind++, ind, 0);
		}
	}

	this.indices.push(0, ind, 1);


	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
