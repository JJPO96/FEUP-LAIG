/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.passoangular=(360.0/slices)*(Math.PI / 180.0);

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/
	this.vertices=[];
	this.indices=[];
	this.normals=[];
 	this.anguloatual=0;
 	this.andaratual=0;

 	for (var k = 0; k < this.stacks; k=k+1) {
		for (var i = 0; i < this.slices; i=i+1) {
			this.anguloatual=i*this.passoangular;

			this.vertices.push(Math.cos(this.anguloatual));
			this.vertices.push(Math.sin(this.anguloatual));
			this.vertices.push(k);

			this.normals.push(Math.cos(this.anguloatual));
			this.normals.push(Math.sin(this.anguloatual));
			this.normals.push(0);
		}
 	}

 	for (var m = 1; m < this.stacks; m = m + 1) {
 		this.andaratual = m;
		for (var j = 0; j < this.slices; j = j + 1) {
			this.indices.push((this.andaratual - 1) * this.slices + j);
			this.indices.push((this.andaratual - 1) * this.slices + ((j + 1) % this.slices));
			this.indices.push(this.andaratual * this.slices + j);
			// var a = (this.andaratual - 1) * this.slices + j;
			// var b = this.andaratual * this.slices + j;
			// var c = (this.andaratual - 1) * this.slices + ((j + 1) % this.slices);
			// console.log(a + ", " + b + ", " + c);
			
			this.indices.push((this.andaratual - 1) * this.slices + ((j + 1) % this.slices));
			this.indices.push(this.andaratual * this.slices + ((j + 1) % this.slices));
			this.indices.push(this.andaratual * this.slices + j);
			// var d = (this.andaratual - 1) * this.slices + ((j + 1) % this.slices);
			// var e = this.andaratual * this.slices + j;
			// var f = this.andaratual * this.slices + ((j + 1) % this.slices);
			// console.log(d + ", " + e + ", " + f);
		}
 	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };