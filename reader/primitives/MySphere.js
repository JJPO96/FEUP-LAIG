/**
 * MySphere
 * @constructor
 * @param
 * scene: XMLscene where the sphere will be created
 * radius: radius of the sphere
 * slices: number of slices used to draw the sphere
 * loops: number of loops used to draw the sphere
 */
function MySphere(scene, radius, slices, stacks) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function() {
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

            var x = this.radius * cosAlp * sinAng;
            var y = this.radius * cosAng;
            var z = this.radius * sinAlp * sinAng;
            var s = 1 - (st / this.stacks);
            var t = 1 - (sl / this.slices);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);
            this.texCoords.push(s, t);
        }
    }

    for (var st = 0; st < this.stacks; st++) {
        for (var sl = 0; sl < this.slices; sl++) {
            var first = (st * (this.slices + 1)) + sl;
            var second = first + this.slices + 1;

            this.indices.push(first, second + 1, second);
            this.indices.push(first, first + 1, second + 1);
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
