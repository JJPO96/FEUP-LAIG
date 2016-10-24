function Component(scene, materialListIDs, transformationsID, transformations, texture, primitivesRefs, componentRefs){
	
	this.materialListIDs = materialListIDs;
	this.materialIndex = 0;
	this.transformationsID = transformationsID;
	this.transformations = transformations;
	this.texture = texture;
	this.primitivesRefs = primitivesRefs;
	this.componentRefs = componentRefs;

}

Component.prototype.updateMaterial = function () {
    if(this.materialIndex < this.materialListIDs.length - 1)
        this.materialIndex++;
    else
        this.materialIndex = 0;
};
