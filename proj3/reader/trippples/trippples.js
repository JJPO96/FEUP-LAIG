
// There are 4 different modes of game:
// - Mode 1: Player vs Player
// - Mode 2: Player vs Computer lvl Begginer
// - Mode 3: Player vs Computer lvl Advanced
// - Mode 4: Computer vs Computer
// In mode Player vs Computer, Player will be player 1 and Computer player 2

/**
 * Trippples
 * @param scene
 * @param mode
 */

function Trippples(scene, mode){
  this.scene=scene;

  this.client = new Client();
  this.board;
  this.player1 = {line: 1, col: 1};
  this.player2 = {line: 8, col: 1};
  this.gameStatus = 0;
  this.canMove = 0;
}

Trippples.prototype.constructor = Trippples;

// Resets values and initializes variables
Trippples.prototype.init = function (){
    var game = this;

    this.client.getPrologRequest("newboard", function(data) {
      game.board = JSON.parse(data.target.responseText);
    });
};

// Returns game board
Trippples.prototype.getPrologBoard = function(){
    var game = this;

    this.client.getPrologRequest("board", function(data) {
      game.board = JSON.parse(data.target.responseText);
    });
};

// Updates player position
Trippples.prototype.updatePlayer= function(player, line, col){
    var game = this;

    this.client.getPrologRequest("updatePlayer("+player+","+line+","+col+")", function(data) {
        var result = JSON.parse(data.target.responseText);

        if (player == "1"){
            game.player1['line'] = result[0];
            game.player1['col'] = result[1];
        }

        else { // Player 2
            game.player2['line'] = result[0];
            game.player2['col'] = result[1];
        }
    });
};

// Moves computer player. Player must be always player 1 in mode 4 to use this function
// Use only for first move
Trippples.prototype.compFirstMove= function(player){
    var game = this;

    this.client.getPrologRequest("compFirstMove("+player+","+4+")", function(data) {
        var result = JSON.parse(data.target.responseText);

        if (player == "1"){
            game.player1['line'] = result[0];
            game.player1['col'] = result[1];
        }

        else { // Player 2
            game.player2['line'] = result[0];
            game.player2['col'] = result[1];
        }
    });
};

// Moves the player (computer)
// There are 4 different modes of game:
// - Mode 2: Player vs Computer lvl Begginer
// - Mode 3: Player vs Computer lvl Advanced
// - Mode 4: Computer vs Computer
// In mode Player vs Computer, Player will be player 1 and Computer player 2
// Example: trippples.moveCompPlayer(2, 1, 2) // In Mode 2 and 3, player1 must be always 2 and
// player2 must be 1
// In mode 4 (comp vs comp) player1 and player 2 can be both 1 or 2
Trippples.prototype.moveCompPlayer= function(player1, player2, mode){
    var game = this;

    this.client.getPrologRequest("moveComp("+player1+","+player2+","+mode+")", function(data) {
        var result = JSON.parse(data.target.responseText);

        if (player1 == "1"){
            game.player1['line'] = result[0];
            game.player1['col'] = result[1];
        }

        else { // Player 2
            game.player2['line'] = result[0];
            game.player2['col'] = result[1];
        }
    });
};

// Verifies is the game can to an end
// 0 - Not finished
// 1 - Player 1 wins
// 2 - Player 2 wins
// 3 - Tie
Trippples.prototype.isGameOver = function(player1, player2){
    var game = this;

    this.client.getPrologRequest("gameover("+player1+","+player2+")", function(data) {

      game.gameStatus = data.target.responseText;
    });
};

// Verifies if a player can move: 1 true, 0 false
Trippples.prototype.playerCanMove = function(player1, player2){
    var game = this;

    this.client.getPrologRequest("canmove("+player1+","+player2+")", function(data) {
      game.canMove = data.target.responseText;
    });
};


// Returns players position
Trippples.prototype.getPlayerPosition = function(player){
    var game = this;

    this.client.getPrologRequest(player, function(data) {
        var result = JSON.parse(data.target.responseText);

        if (player == "1"){
            game.player1['line'] = result[0];
            game.player1['col'] = result[1];
        }

        else { // Player 2
            game.player2['line'] = result[0];
            game.player2['col'] = result[1];
        }
    });
};
