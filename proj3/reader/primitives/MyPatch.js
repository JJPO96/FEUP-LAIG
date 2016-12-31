/**
 * MyPatch
 * @constructor
 * @param
 * scene: XMLscene where the patch will be created
 * orderU: order of the U side
 * orderV: order of the V side
 * partsX: number of parts in which the plane is divided in relation to X
 * partsY: number of parts in which the plane is divided in relation to Y
 * controlPoints: array with the control points used to draw the patch
 */
function MyPatch(scene, orderU, orderV, partsX, partsY, controlPoints) {
    var knots1 = this.getKnotsVector(orderU); // to be built inside webCGF in later versions ()
    var knots2 = this.getKnotsVector(orderV); // to be built inside webCGF in later versions

    var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knots1, knots2, controlPoints);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    this.plane = new CGFnurbsObject(scene, getSurfacePoint, partsX, partsY);

};

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.getKnotsVector = function(degree) {

    var v = new Array();
    for (var i = 0; i <= degree; i++) {
        v.push(0);
    }
    for (var i = 0; i <= degree; i++) {
        v.push(1);
    }
    return v;
}

MyPatch.prototype.display = function() {
    this.plane.display();
}
