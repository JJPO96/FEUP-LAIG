function MyPlane(scene, dimX, dimY, partsX, partsY) {
  var knots1 = this.getKnotsVector(1); // to be built inside webCGF in later versions ()
	var knots2 = this.getKnotsVector(1); // to be built inside webCGF in later versions

  controlPoints = [	// U = 0
    [ // V = 0..1;
       [-dimX/2, -dimY/2, 0.0, 1 ],
       [-dimX/2,  dimY/2, 0.0, 1 ]

    ],
    // U = 1
    [ // V = 0..1
       [ dimX/2, -dimY/2, 0.0, 1 ],
       [ dimX/2,  dimY/2, 0.0, 1 ]
    ]
  ];

  this.plane = new MyPatch(scene, 1, 1, partsX, partsY, controlPoints);
};

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.getKnotsVector = function(degree) {

	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

MyPlane.prototype.display = function() {
  this.plane.display();
}
