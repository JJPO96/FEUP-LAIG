/*
 * 
 */
function SceneAtr(root, axis_length) {
    this.root = root;
    this.axis_length = axis_length;
}

/*
 * class Illumination
 */
function Illumination(doublesided, local) {
    this.doublesided = doublesided;
    this.local = local;
    this.ambient; // [r,g,b,a]
    this.background; // [r,g,b,a]
}

/*
 * class Views
 */
function Views(dflt) {
    this.default = dflt;
    this.perspectives = []; // array that will contain the perspetive(s) available
}

/*
 * class Perspective
 */
function Perspective(id, near, far, angle) {
    this.id = id;
    this.near = near;
    this.far = far;
    this.angle = angle;
    this.from = []; // [x,y,z]
    this.to = []; // [x,y,z]
}
/*
 * class Camera
 */
function MyCamera(id, camera) {
    this.id = id;
    this.camera = camera;
}
/*
 * class Texture
 */
function Texture(scene, id, file, length_s, length_t) {
    this.id = id;
    this.text = new CGFappearance(scene);
    this.text.loadTexture(file);
    this.length_s = length_s;
    this.length_t = length_t;
}
/*
 * class material
 */
function Material(scene, id) {
    this.id = id;
    this.material = new CGFappearance(scene);
}
/*
 * class Primitive
 */
function Primitive(id) {
    this.id = id;
    this.primitive;
}
/*
 * function to search in an array some id
 */
function searchByID(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id)
            return array[i];
    }
}
