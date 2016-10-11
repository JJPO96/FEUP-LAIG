function SceneAtr(root, axis_length){
  this.root = root;
  this.axis_length = axis_length;
}

function Illumination(doublesided,local){
  this.doublesided = doublesided;
  this.local = local;
  this.ambient; // [r,g,b,a]
  this.background; // [r,g,b,a]
}

function Views(dflt){
  this.default = dflt;
  this.perspectives = []; // array that will contain the perspetive(s) available
}

function Perspective(id,near,far,angle){
  this.id = id;
  this.near = near;
  this.far = far;
  this.angle = angle;
  this.from = []; // [x,y,z]
  this.to = []; // [x,y,z]
}

function Texture(id,file,length_s,length_t){
  this.id = id;
  this.file = file;
  this.length_s = length_s;
  this.length_t = length_t;
}

function Material(id){
  this.id = id;
  this.emission; // [r,g,b,a]
  this.ambient; // [r,g,b,a]
  this.diffuse; // [r,g,b,a]
  this.specular; // [r,g,b,a]
  this.shininess;
}
