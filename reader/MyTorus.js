function MyTorus(scene, iRadius, oRadius, slices, loops) {
    CGFobject.call(this, scene);

    this.iRadius = iRadius;
    this.oRadius = oRadius;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
};

MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

MyTorus.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (var st = 0; st <= this.stacks; st++) {
        var ang = st * Math.PI / this.stacks;
        var sinAng = Math.sin(ang);
        var cosAng = Math.cos(ang);

        for (var sl = 0; sl <= this.slices; sl++) {
            var alp = sl * 2 * Math.PI / this.slices;
            var sinAlp = Math.sin(alp);
            var cosAlp = Math.cos(alp);
          }
        }

};
