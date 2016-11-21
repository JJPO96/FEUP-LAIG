/**
 * MyChessboard
 * @constructor
 */
function MyChessboard(scene,du,dv,texture,su,sv,c1,c2,cs) {
    CGFobject.call(this, scene);
    this.scene=scene;

    this.shader = new CGFshader(scene.gl, "shaders\\chessboard1.vert", "shaders\\chessboard1.frag");
    this.plane = new MyPlane(this.scene, 1, 1, du*5, dv*5);


    this.texture = texture;
    
    console.log("c1" + c1.r);

    sv=dv-(sv+1);

    this.shader.setUniformsValues({uSampler : 0,
                                  color1 : [c1[0], c1[1], c1[2], c1[3]],
                                  color2 : [c2[0], c2[1], c2[2], c2[3]],
                                  colorMark : [cs[0], cs[1], cs[2], cs[3]],
                                  divU:parseInt(du)*1.0,divV:parseInt(dv)*1.0,
                                  sU:parseInt(su)*1.0,sV:parseInt(sv)*1.0
                                  });

};

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.display = function() {
	
	var mat = new CGFappearance(this.scene);
	mat.setTexture(this.texture);
    mat.apply();
  
    this.texture.bind(0);

    this.scene.setActiveShader(this.shader);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);

};