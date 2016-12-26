function Trippples(scene, mode){
  this.scene=scene;


  this.client = new Client();

  // COLOCAR AQUI CONSTRUTOR
  this.board;

  this.boardProlog = null;

  this.init();
}

Trippples.prototype.constructor=Trippples;




Trippples.prototype.init = function (){


};

Trippples.prototype.getPrologBoard = function(){
  var game=this;

  this.client.getPrologRequest("board", function(data) {
    game.boardProlog = data.target.responseText;
  });
};
