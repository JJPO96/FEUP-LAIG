function Animation() {

}

Animation.prototype.constructor = Animation;

Animation.prototype.init = function(id) {
    this.id = id;
}

Animation.prototype.getTranslationMatrix = function(x, y, z) {
    var mat = mat4.create();
    var trans = [x, y, z];
    mat4.translate(mat, mat, trans);
    return mat;
}

Animation.prototype.getRotationMatrix = function(axis, deg) {
    var mat = mat4.create();
    switch (axis) {
        case "x":
            mat4.rotateX(mat, mat, deg);
            break;
        case "y":
            mat4.rotateY(mat, mat, deg);
            break;
        case "z":
            mat4.rotateZ(mat, mat, deg);
            break;
    }
    return mat;
}