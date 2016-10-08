function omniLight(id,enabled) {
  this.id = id;
  this.enabled = enabled;
  this.location; // [x,y,z,w]
  this.ambient; // [r,g,b,a]
  this.diffuse; // [r,g,b,a]
  this.specular; // [r,g,b,a]
}

function spotLight(id,enabled) {
  this.id = id;
  this.enabled = enabled;
  this.target; // [x,y,z]
  this.location; // [x,y,z]
  this.ambient; // [r,g,b,a]
  this.diffuse; // [r,g,b,a]
  this.specular; // [r,g,b,a]
}
