var CircularAnimation = function() {
    Animation.apply(this, arguments);
    // Circular Animation initialization...
};
CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

