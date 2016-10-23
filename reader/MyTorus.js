function MyTorus(scene, inner, outer, slices, loops) {
 CGFobject.call(this,scene);
 this.inner = inner;
 this.outer = outer;
 this.slices = slices;
 this.loops = loops;

 this.initBuffers();
};

MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

MyTorus.prototype.initBuffers = function() {

 this.radius = this.outer - this.inner;
 this.radiusCenter = this.outer;

 this.sigma = (Math.PI * 2)/this.slices;
 this.teta = (Math.PI * 2)/this.loops;

 this.vertices = [];
 this.indices = [];
 this.normals = [];
 this.texCoords = [];

 for(var i = 0 ; i <= this.loops ; i++){
   for(var j = 0 ; j <= this.slices; j++){

     var x = (this.radiusCenter + this.radius * Math.cos(j * this.sigma)) * Math.cos(i * this.teta);
     var y = (this.radiusCenter + this.radius * Math.cos(j * this.sigma)) * Math.sin(i * this.teta);
     var z = this.radius * Math.sin(j * this.sigma);

     this.vertices.push(x,y,z);
     this.normals.push(x,y,z);
     this.texCoords.push(1- i/this.loops, 1 - j/this.slices);

   }
 }


 for(var loop = 0 ; loop < this.loops ; ++loop){
   for(var slice = 0; slice < this.slices ; ++slice){
     this.indices.push(loop * (this.slices + 1) + slice, (loop + 1) * (this.slices + 1) + slice, (loop + 1) * (this.slices + 1) + slice + 1);
     this.indices.push(loop * (this.slices + 1) + slice, (loop + 1) * (this.slices + 1) + slice + 1, loop * (this.slices + 1) + slice + 1);
   }
 }



 this.primitiveType = this.scene.gl.TRIANGLES;
 this.initGLBuffers();
};
