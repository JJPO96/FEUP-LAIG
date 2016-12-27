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
  this.player2 = {line: 8, col: 1};

  this.init();
}

Trippples.prototype.constructor = Trippples;

Trippples.prototype.init = function (){


};

Trippples.prototype.getPrologBoard = function(){
    var game = this;

    this.client.getPrologRequest("board", function(data) {
      game.board = JSON.parse(data.target.responseText);
    });  
};

Trippples.prototype.getPlayerPosition = function(player){
    var game = this;

    this.client.getPrologRequest(player, function(data) {
        var result = JSON.parse(data.target.responseText);
        game.player1['line'] = result[0];
        game.player1['col'] = result[1];
    });  
};
