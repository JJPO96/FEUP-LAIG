/**
 * Trippples
 * @param scene
 * @param mode
 */

function Trippples(scene, mode){
  this.scene=scene;

  this.client = new Client();
  this.board;
  this.player1;
  this.player2;

  this.init();
}

Trippples.prototype.constructor = Trippples;

Trippples.prototype.init = function (){


};

Trippples.prototype.getPrologBoard = function(){
    var game = this;

  this.client.getPrologRequest("board", function(data) {
    game.board = data.target.responseText;
  });  
};

Trippples.prototype.getPlayerPosition = function(player){
    var game = this;

  this.client.getPrologRequest(player, function(data) {
    game.board = data.target.responseText;
  });  
};
