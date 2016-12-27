/**
 * Trippples
 * @param scene
 * @param mode
 */


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
var game = this;

  this.client.getPrologRequest("board", function(data) {
    console.log('chegou aqui');
    game.boardProlog = data.target.responseText;

    //console.log(game.boardProlog);

    console.log('e aqui');
  });

  if (typeof game.boardProlog === null){
      console.log("sim");
  }

  console.log("nao");
};

Trippples.prototype.getBoard = function(){
    var game = this;

    console.log("Board ");
    console.log(game.boardProlog);
    return this.boardProlog;
};

