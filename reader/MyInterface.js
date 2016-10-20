function MyInterface(){
  CGFinterface.call(this);
}


MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) {

    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();

    this.spot = this.gui.addFolder("Spot Lights");

    this.omni = this.gui.addFolder("Omni Lights");


    return true;
};

/*
Type:
  - 0 -> spot
  - 1 -> omni
ID:
  - id of the light
Status:
  - 0 -> disabled
  - 1 -> enabled
*/
MyInterface.prototype.addLight = function(type, id, status) {

}
