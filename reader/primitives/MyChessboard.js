function MyChessboard(scene,du,dv,texture, c1,c2,cs,su = -1,sv = -1) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.texture = texture;
    this.plane = new MyPlane(this.scene,1,1, 100, 100);

    this.initBuffers();
}

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.initBuffers=function () {

};

MyChessboard.prototype.setFillMode=function () {
		this.indices=this.indicesTris;
		this.primitiveType=this.scene.gl.TRIANGLES;
}

MyChessboard.prototype.setLineMode=function () {
		this.indices=this.indicesLines;
		this.primitiveType=this.scene.gl.LINES;
}
