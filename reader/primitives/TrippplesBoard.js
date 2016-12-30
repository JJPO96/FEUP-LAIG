/**
 * TrippplesBoard
 * @constructor
 * @param
 * scene: XMLscene where the chessboard will be created
 * du: number X parts of the base plane
 * dv: number Y parts of the base plane
 * texture: texture to be applied to the base plane
 * su: number of interpolations to be made between U points
 * sv: number of interpolations to be made between V points
 * c1: color 1
 * c2: color 2
 * cs: color of the selected square
 */
function TrippplesBoard(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.move = true;
    this.movePC = true;
    this.player1won = false;
    this.player2won = false;

    this.ambient = 'Wood';
    this.difficulty = 'Easy';
    this.mode = 'Player vs Player';
    this.currentDifficulty = 'Easy';
    this.currentMode = 'Player vs Player';
    this.displayDifficulty = this.currentDifficulty;
    this.displayMode = this.currentMode;

    this.restart = function() {

    };

    this.undo = function() {

    };

    this.restart = function() {
        this.difficulty = this.currentDifficulty;
        this.mode = this.currentMode;
        this.displayDifficulty = this.currentDifficulty;
        this.displayMode = this.currentMode;
        this.restartBoard();
    };

    this.newGame = function() {
        this.scene.trippples.init();
        this.currentDifficulty = this.difficulty;
        this.currentMode = this.mode;
        this.displayDifficulty = this.currentDifficulty;
        this.displayMode = this.currentMode;
        this.pieces = this.scene.trippples.board;
        this.restartBoard();
    };

    //this.pieces = this.scene.trippples.board;

    this.pieces = [
        [2, 5, 6, 7, 8, 9, 10, 3],
        [11, 12, 13, 14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23, 24, 25, 26],
        [27, 28, 29, 0, 30, 44, 31, 32],
        [33, 34, 35, 0, 0, 36, 37, 38],
        [39, 40, 41, 42, 43, 0, 45, 46],
        [47, 48, 49, 50, 51, 52, 53, 54],
        [4, 55, 56, 57, 58, 59, 60, 1]
    ];


    this.lastPlay = 2;
    this.piecesText = this.loadPiecesText(this.pieces);
    this.timerText = this.loadTimerText();

    this.quad = new MyPlane(this.scene, 1, 1, 10, 10),
        this.bottom = new MyPlane(this.scene, 9, 9, 10, 10);
    this.side = new MyPlane(this.scene, 9, 0.5, 10, 10);
    this.timer = new Timer(this.scene, this.timerText);

    this.defaultApp = new CGFappearance(this.scene);
    this.defaultApp.setAmbient(0.3, 0.3, 0.3, 1);
    this.defaultApp.setDiffuse(0.2, 0.2, 0.2, 1);
    this.defaultApp.setSpecular(0.2, 0.2, 0.2, 1);
    this.defaultApp.setShininess(20);

    this.boardQuad = new CGFappearance(this.scene);
    this.boardQuad.setAmbient(0, 0, 0, 1);
    this.boardQuad.setDiffuse(0.6, 0.6, 0.6, 1);
    this.boardQuad.setSpecular(0.6, 0.6, 0.6, 1);
    this.boardQuad.setShininess(100);

    this.woodSideBoard = new CGFappearance(this.scene);
    this.woodSideBoard.setAmbient(0, 0, 0, 1);
    this.woodSideBoard.setDiffuse(0.5, 0.3, 0.1, 1);
    this.woodSideBoard.setSpecular(0.5, 0.3, 0.1, 1);
    this.woodSideBoard.setShininess(20);
    this.woodSideBoard.loadTexture("textures/boardPieces/woodSide.png");

    this.woodBottomBoard = new CGFappearance(this.scene);
    this.woodBottomBoard.setAmbient(0, 0, 0, 1);
    this.woodBottomBoard.setDiffuse(0.5, 0.3, 0.1, 1);
    this.woodBottomBoard.setSpecular(0.5, 0.3, 0.1, 1);
    this.woodBottomBoard.setShininess(20);
    this.woodBottomBoard.loadTexture("textures/boardPieces/woodBottom.png");

    this.marbleSideBoard = new CGFappearance(this.scene);
    this.marbleSideBoard.setAmbient(0, 0, 0, 1);
    this.marbleSideBoard.setDiffuse(0.2, 0.2, 0.2, 1);
    this.marbleSideBoard.setSpecular(0.2, 0.2, 0.2, 1);
    this.marbleSideBoard.setShininess(50);
    this.marbleSideBoard.loadTexture("textures/boardPieces/marbleSide.png");


    this.marbleBottomBoard = new CGFappearance(this.scene);
    this.marbleBottomBoard.setAmbient(0, 0, 0, 1);
    this.marbleBottomBoard.setDiffuse(0.2, 0.2, 0.2, 1);
    this.marbleBottomBoard.setSpecular(0.2, 0.2, 0.2, 1);
    this.marbleBottomBoard.setShininess(50);
    this.marbleBottomBoard.loadTexture("textures/boardPieces/marbleBottom.png");

    this.piece1 = new MyPiece(this.scene, new coord2D(0, 0), 0, 101);
    this.p1log = [];

    this.piece2 = new MyPiece(this.scene, new coord2D(7, 0), 1, 102);
    this.p2log = [];
};


TrippplesBoard.prototype = Object.create(CGFobject.prototype);
TrippplesBoard.prototype.constructor = TrippplesBoard;

TrippplesBoard.prototype.restartBoard = function() {
    this.move = true;
    this.movePC = true;
    this.ambient = 'Wood';
    this.lastPlay = 2;
    this.player1won = false;
    this.player2won = false;
    this.p1log = [];
    this.p2log = [];

    this.piecesText = this.loadPiecesText(this.pieces);
    this.timer.time = 0;
    this.timer.score = 0;
    this.piece1 = new MyPiece(this.scene, new coord2D(0, 0), 0, 101);
    this.p1log = [];
    this.piece2 = new MyPiece(this.scene, new coord2D(7, 0), 1, 102);
    this.p2log = [];
}

TrippplesBoard.prototype.loadPiecesText = function() {
    var ret = new Array(8);
    var x = 0;
    for (var i = 0; i < ret.length; i++) {
        ret[i] = new Array(8);
        for (var j = 0; j < ret.length; j++) {
            var tempApp = new CGFappearance(this.scene);
            tempApp.setAmbient(0, 0, 0, 1);
            tempApp.setDiffuse(0.5, 0.5, 0.5, 1);
            tempApp.setSpecular(0.5, 0.5, 0.5, 1);
            tempApp.setShininess(120);
            tempApp.loadTexture("textures/boardPieces/" + this.pieces[i][j] + ".png");
            ret[i][j] = tempApp;
        }
    }
    return ret;
}

TrippplesBoard.prototype.loadTimerText = function() {
    var ret = new Array(11);
    var x = 0;
    for (var i = 0; i < ret.length - 1; i++) {
        var tempApp = new CGFappearance(this.scene);
        tempApp.setAmbient(0, 0, 0, 1);
        tempApp.setDiffuse(0.5, 0.5, 0.5, 1);
        tempApp.setSpecular(0.5, 0.5, 0.5, 1);
        tempApp.setShininess(120);
        tempApp.loadTexture("textures/boardPieces/timer" + i + ".png");
        ret[i] = tempApp;
    }

    var tempApp = new CGFappearance(this.scene);
    tempApp.setAmbient(0, 0, 0, 1);
    tempApp.setDiffuse(0.5, 0.5, 0.5, 1);
    tempApp.setSpecular(0.5, 0.5, 0.5, 1);
    tempApp.setShininess(120);
    tempApp.loadTexture("textures/boardPieces/timerDots.png");
    ret[10] = tempApp;

    return ret;
}

TrippplesBoard.prototype.highlightTiles = function(tiles) {
    for (var i = 0; i < tiles.length; i++) {
        var tempX = tiles[i].x;
        var tempY = tiles[i].y;

        var tempApp = new CGFappearance(this.scene);
        tempApp.setAmbient(0.2, 0.2, 0.2, 1);
        tempApp.setDiffuse(0.5, 0.5, 0.5, 1);
        tempApp.setSpecular(0.5, 0.5, 0.5, 1);
        tempApp.setShininess(120);
        tempApp.loadTexture("textures/boardPieces/" + this.pieces[tempY][tempX] + ".png");
        this.piecesText[tempY][tempX] = tempApp;
    }
}

TrippplesBoard.prototype.restoreTiles = function(tiles) {
    for (var i = 0; i < tiles.length; i++) {
        var tempX = tiles[i].x;
        var tempY = tiles[i].y;

        var tempApp = new CGFappearance(this.scene);
        tempApp.setAmbient(0, 0, 0, 1);
        tempApp.setDiffuse(0.5, 0.5, 0.5, 1);
        tempApp.setSpecular(0.5, 0.5, 0.5, 1);
        tempApp.setShininess(120);
        tempApp.loadTexture("textures/boardPieces/" + this.pieces[tempY][tempX] + ".png");
        this.piecesText[tempY][tempX] = tempApp;
    }
}

TrippplesBoard.prototype.makePlay = function() {
    this.tempCoord;
    this.tempCh;
    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj) {
                    var customId = this.scene.pickResults[i][1];
                    if (obj.type == "piece1" && this.lastPlay == 2 && this.move) {
                        this.tempCoord = new coord2D(this.piece1.coord.x, this.piece1.coord.y);
                        this.tempCh = changeTo(2, this.pieces[this.piece2.coord.x][this.piece2.coord.y]);
                        this.highlightTiles(getAvaiPos(this.tempCoord, this.tempCh, this.pieces));
                        this.lastPlay = 1;
                        this.move = false;
                        this.movePC = true;
                    } else if (obj.type == "piece2" && this.lastPlay == 1 && this.move && this.currentMode == "Player vs Player") {
                        this.tempCoord = new coord2D(this.piece2.coord.x, this.piece2.coord.y);
                        this.tempCh = changeTo(2, this.pieces[this.piece1.coord.x][this.piece1.coord.y]);
                        this.highlightTiles(getAvaiPos(this.tempCoord, this.tempCh, this.pieces));
                        this.lastPlay = 2;
                        this.move = false;
                    } else if (this.currentMode == "Player vs PC" && this.currentDifficulty == "Easy" && this.lastPlay == 1 && this.move && this.movePC) {
                        this.timer.updateScore(this.p1log.length);
                        this.scene.trippples.moveCompPlayer(2, 1, 2);
                        this.piece2.movePiece(this.scene.trippples.player2.line - 1, this.scene.trippples.player2.col - 1);
                        this.p2log.push(new coord2D(getTileCoords(customId).x, getTileCoords(customId).y));
                          if (this.piece2.coord.x == 0 && this.piece2.coord.y == 7) {
                              this.player2won = true;
                              this.timer.stop = true;
                          }
                        this.scene.updateView(1);
                        this.lastPlay = 2;
                        this.movePC = false;
                    } else if (this.currentMode == "Player vs PC" && this.currentDifficulty == "Hard" && this.lastPlay == 1 && this.move && this.movePC) {
                        this.timer.updateScore(this.p1log.length);
                        this.scene.trippples.moveCompPlayer(2, 1, 3);
                        this.piece2.movePiece(this.scene.trippples.player2.line - 1, this.scene.trippples.player2.col - 1);
                        this.p2log.push(new coord2D(getTileCoords(customId).x, getTileCoords(customId).y));
                          if (this.piece2.coord.x == 0 && this.piece2.coord.y == 7) {
                              this.player2won = true;
                              this.timer.stop = true;
                          }
                        this.scene.updateView(1);
                        this.lastPlay = 2;
                        this.movePC = false;
                  } else if (obj.type != "piece1" && obj.type != "piece2" && (customId < 64) && !(this.move)) {
                        var tempArr = getAvaiPos(this.tempCoord, this.tempCh, this.pieces);
                        if (isIn(getTileCoords(customId), tempArr)) {
                            if (this.lastPlay == 1) {
                                this.scene.trippples.updatePlayer(1, getTileCoords(customId).x + 1, getTileCoords(customId).y + 1);
                                this.piece1.movePiece(getTileCoords(customId).x, getTileCoords(customId).y);
                                this.p1log.push(new coord2D(getTileCoords(customId).x, getTileCoords(customId).y));
                                if (this.piece1.coord.x == 7 && this.piece1.coord.y == 7) {
                                    this.player1won = true;
                                    this.timer.stop = true;
                                }
                                this.timer.updateScore(this.p2log.length);
                                this.scene.updateView(2);
                            } else if (this.lastPlay == 2) {
                                this.scene.trippples.updatePlayer(2, getTileCoords(customId).x + 1, getTileCoords(customId).y + 1);
                                this.piece2.movePiece(getTileCoords(customId).x, getTileCoords(customId).y);
                                this.p2log.push(new coord2D(getTileCoords(customId).x, getTileCoords(customId).y));
                                if (this.piece2.coord.x == 0 && this.piece2.coord.y == 7) {
                                    this.player2won = true;
                                    this.timer.stop = true;
                                }
                                this.timer.updateScore(this.p1log.length);
                                this.scene.updateView(1);
                            }
                            this.move = true;
                            this.restoreTiles(getAvaiPos(this.tempCoord, this.tempCh, this.pieces));

                        }
                    }
                    console.log("pick id " + customId);
                }
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
        }
    }
}

TrippplesBoard.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.registerForPick(200, this);
    if (this.ambient == 'Wood') {
        this.woodBottomBoard.apply();
    } else if (this.ambient == 'Marble') {
        this.marbleBottomBoard.apply();
    }
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.bottom.display();
    this.scene.popMatrix();

    //sides
    this.scene.pushMatrix();
    if (this.ambient == 'Wood') {
        this.woodSideBoard.apply();
    } else if (this.ambient == 'Marble') {
        this.marbleSideBoard.apply();
    }
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4.5);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4.5);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4.5);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, 4.5);
    this.side.display();
    this.scene.popMatrix();

    //inner sides
    this.scene.pushMatrix();
    if (this.ambient == 'Wood') {
        this.woodSideBoard.apply();
    } else if (this.ambient == 'Marble') {
        this.marbleSideBoard.apply();
    }
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, -4);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, -4);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, -4);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.25, -4);
    this.side.display();
    this.scene.popMatrix();

    //top sides
    this.scene.pushMatrix();
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.5, 4.25);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(8/9,1,1);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.5, 4.25);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.5, 4.25);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(8/9,1,1);
    this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.registerForPick(200, this);
    this.scene.translate(0, 0.5, 4.25);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.side.display();
    this.scene.popMatrix();

    this.defaultApp.apply();

    if (this.player1won) {
        this.scene.pushMatrix();
        this.scene.translate(0, 0.25, 0);
        this.scene.scale(8, 0, 8);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.piece1.texture.apply();
        this.quad.display();
        this.scene.popMatrix();
    } else if (this.player2won) {
        this.scene.pushMatrix();
        this.scene.translate(0, 0.25, 0);
        this.scene.scale(8, 0, 8);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.piece2.texture.apply();
        this.quad.display();
        this.scene.popMatrix();
    } else {
        this.scene.pushMatrix();
        this.scene.translate(0, 0.25, 0);
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                this.scene.pushMatrix();
                this.scene.translate(-3.5 + i, 0, -3.5 + j);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.registerForPick(i * 8 + j, this);
                this.piecesText[j][i].apply();
                this.quad.display();
                this.scene.popMatrix();
            }
        }
        this.scene.popMatrix();
    }

    this.scene.pushMatrix();
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.translate(0, 2, 15);
    this.timer.display();
    this.scene.popMatrix();

    this.piece1.display();
    this.piece2.display();

    for (var i in this.scene.interface.gui.__controllers) {
        this.scene.interface.gui.__controllers[i].updateDisplay();
    }

};
