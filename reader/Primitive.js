function Rectangle(id){
  this.id = id;
  this.x1;
  this.x2;
  this.y1;
  this.y2;
}

function Triangle(id){
  this.id = id;
  this. x1;
  this. y1;
  this. z1;
  this. x2;
  this. y2;
  this. z2;
  this. x3;
  this. y3;
  this. z3;
}

function Cylinder(id){
  this.id = id;
  this.base;
  this.top;
  this.height;
  this.slices;
  this.stacks;
}

function Sphere(id){
  this.id = id;
  this.radius;
  this.slices;
  this.stacks;
}

function Torus(id){
  this.id = id;
  this.inner;
  this.outer;
  this.slices;
  this.loops;
}
