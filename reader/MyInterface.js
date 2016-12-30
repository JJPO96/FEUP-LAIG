/**
 * MyInterface
 * @constructor
 */
function MyInterface() {
    CGFinterface.call(this);
}


MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/*
 * init of the interface
 */
MyInterface.prototype.init = function(application) {

    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();

    this.spot = this.gui.addFolder("Spot Lights");

    this.omni = this.gui.addFolder("Omni Lights");


    this.gui.add(this.scene.board, 'ambient', ['Wood', 'Marble']).name("Select Ambient");

    this.gui.add(this.scene.board, 'undo').name("Undo");

    this.gui.add(this.scene.board, 'displayDifficulty').name("Current Difficulty");

    this.gui.add(this.scene.board, 'displayMode').name("Current Mode");

    this.gui.add(this.scene.board, 'restart').name("Restart");

    this.gui.add(this.scene.board, 'difficulty', ['Easy', 'Hard']).name("New Game Difficulty");

    this.gui.add(this.scene.board, 'mode', ['Player vs Player', 'Player vs PC', 'PC vs PC']).name("New Game Mode");

    this.gui.add(this.scene.board, 'newGame').name("New Game");

    return true;
};

/*
 * adds a light to the menu
 */
MyInterface.prototype.addLight = function(type, i, id) {
    if (type == "omni") {
        this.omni.add(this.scene.lightsArray, i, this.scene.lightsArray[i]).name(id);
    } else if (type == "spot") {
        this.spot.add(this.scene.lightsArray, i, this.scene.lightsArray[i]).name(id);
    } else {
        console.log("Unknown type of light!!");
    }
}

/*
 * reads the keys processed
 */
MyInterface.prototype.processKeyDown = function(event) {
    switch (event.keyCode) {
        case (77): //M
            this.scene.updateMaterial();
            break;
        case (86): //V
            this.scene.updateView();
            break;
    };
};

MyInterface.prototype.processMouseDown = function(event) {

};
