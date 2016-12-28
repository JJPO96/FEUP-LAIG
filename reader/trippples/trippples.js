/**
 * Trippples
 * @param scene
 * @param mode
 */

function Trippples(scene, mode){
  this.scene=scene;

  this.client = new Client();
  this.board;
  this.player1 = {line: 9, col: 9};
  this.player2 = {line: 3, col: 1};
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

    this.client.getPrologRequest("updatePlayer("+player+","+line+","+col+")", function(data) {});  
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
