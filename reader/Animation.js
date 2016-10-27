/**
 @constructor animation
 @abstract
 */
var Animation = function() {
    if (this.constructor === Animation) {
      throw new Error("Can't instantiate abstract class!");
    }
};
