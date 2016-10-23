function SceneAtr(root, axis_length) {
    this.root = root;
    this.axis_length = axis_length;
}

function Illumination(doublesided, local) {
    this.doublesided = doublesided;
    this.local = local;
    this.ambient; // [r,g,b,a]
    this.background; // [r,g,b,a]
}

function Views(dflt) {
    this.default = dflt;
    this.perspectives = []; // array that will contain the perspetive(s) available
}

function Perspective(id, near, far, angle) {
    this.id = id;
    this.near = near;
    this.far = far;
    this.angle = angle;
    this.from = []; // [x,y,z]
    this.to = []; // [x,y,z]
}

function MyCamera(id, camera) {
    this.id = id;
    this.camera = camera;
}

function Texture(scene, id, file, length_s, length_t) {
    this.id = id;
    this.text = new CGFappearance(scene);
    this.text.loadTexture(file);
    this.length_s = length_s;
    this.length_t = length_t;
}

function Material(scene, id) {
    this.id = id;
    this.material = new CGFappearance(scene);
}

function Primitive(id) {
    this.id = id;
    this.primitive;
}

function searchByID(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id)
            return array[i];
    }
}
