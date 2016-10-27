/**
 @constructor animation
 @abstract
 */
var Animation = function(tempo) {
	this.tempo=tempo;
    if (this.constructor === Animation) {
      throw new Error("Can't instantiate abstract class!");
    }
};
