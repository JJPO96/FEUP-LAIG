/**
 * MyCylinder
 * @constructor
 * @param
 * scene: XMLscene where the cyllinder will be created
 * base: radius of the base of the cyllinder
 * top: radius of the top of the cyllinder
 * top: height of the cyllinder
 * slices: number of slices used to draw the sphere
 * loops: number of loops used to draw the sphere
 */
function MyCylinder(scene, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.coverBase = new Circle(this.scene, base, slices);
    this.coverTop = new Circle(this.scene, top, slices);
    this.side = new MyCylinderSide(this.scene, base, top, height, slices, stacks);

    this.slices = slices;
    this.height = height;
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.display = function() {


    this.side.display();


    this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height);
    this.coverTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI * this.slices, 0, 0, 1);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.coverBase.display();
    this.scene.popMatrix();



};
