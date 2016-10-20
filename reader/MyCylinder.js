function MyCylinder(scene, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
    this.baseDraw = new Circle(this.scene, this.base, this.slices);
    this.topDraw = new Circle(this.scene, this.top, this.slices);
    this.bodyDraw = new CylinderBody(this.scene, this.base, this.top, this.height, this.slices, this.stacks);

    this.bodyDraw.display();

    this.scene.pushMatrix();
      this.scene.translate(0, 0, 1);
      this.topDraw.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.rotate(Math.PI, 0, 1, 0);
      this.baseDraw.display();
    this.scene.popMatrix();

    this.primitiveType = this.scene.gl.TRIANGLES;
};
