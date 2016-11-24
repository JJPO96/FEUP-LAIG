/**
* MyVehicle
* @constructor
* @param
* scene: XMLscene where the vehicle will be created
*/
function MyVehicle(scene) {
  this.scene = scene;

    this.front = new MyPatch(scene,3,3,20,20,[	// U = 0
        [ // V = 0..3;
          [ -2, -2, 0, 1 ],
          [ -10, -.3, 0, 1 ],
          [ -10, .3, 0, 1 ],
          [ -2, 2, 0, 1 ]

        ],
        // U = 1
        [ // V = 0..3
          [ -2, -2, 0, 1 ],
          [ -5, -2, 3, 1 ],
          [ -5, 2, 3, 1 ],
          [ -2, 2, 0, 1 ]
        ],
        // U = 2
        [ // V = 0..3
          [ -2, -1, 0, 1 ],
          [ 10, -2, 5, 1 ],
          [ 10, 2, 5, 1 ],
          [ -2, 1, 0, 1 ]
        ],
        // U = 3
        [ // V = 0..3
          [ -2, -2, 0, 1 ],
          [ 5, -.3, 0, 1 ],
          [ 5, .3, 0, 1 ],
          [ -2, 2, 0, 1 ]
        ]
      ])

      this.back = new MyPatch(scene,2,3,20,20,[	// U = 0
          [ // V = 0..3;
            [ -2, -2, 0, 1 ],
            [ -10, -.3, 0, 1 ],
            [ -10, .3, 0, 1 ],
            [ -2, 2, 0, 1 ]

          ],
          // U = 1
          [ // V = 0..3
            [ -2, -2, 0, 1 ],
            [ -5, -2, 3, 1 ],
            [ -5, 2, 3, 1 ],
            [ -2, 2, 0, 1 ]
          ],
          // U = 2
          [ // V = 0..3
            [ -2, -2, 0, 1 ],
            [ 5, -.3, 0, 1 ],
            [ 5, .3, 0, 1 ],
            [ -2, 2, 0, 1 ]
          ]
        ])

  this.topWing = new MyPatch(scene,2,3,20,20,[	// U = 0
      [ // V = 0..3;
        [ -1, -10, 0, 1 ],
        [ -1, -0, 0, 1 ],
        [ -1, 0, 0, 1 ],
        [ -1, 10, 0, 1 ]

      ],
      // U = 1
      [ // V = 0..3
        [ -0.1, -3, 0.3, 1 ],
        [ -0.1, 0, 0.5, 1 ],
        [ -0.1, 0, 0.5, 1 ],
        [ -0.1, 3, 0.3, 1 ]
      ],
      // U = 2
      [ // V = 0..3
        [ -1, -10, 0, 1 ],
        [ 1, 0, 0, 1 ],
        [ 1, 0, 0, 1 ],
        [ -1, 10, 0, 1 ]
      ]
    ])

  this.bottomWing = new MyPatch(scene,2,3,20,20,[	// U = 0
    [ // V = 0..3;
      [ 1, -10, 0.0, 1 ],
      [ -1, -2.0, 0.0, 1 ],
      [ -1,  2.0, 0.0, 1 ],
      [ 1,  10, 0.0, 1 ]

    ],
    // U = 1
    [ // V = 0..3
       [ 0, -0, 0.0, 1 ],
       [ -0, -0, 0.0, 1],
       [ -0,  0, 0.0, 1 ],
       [ 0,  0, 0.0, 1 ]
    ],
    // U = 2
    [ // V = 0..3
      [ 1, -10, 0.0, 1 ],
      [ 1, -0.0, 0.0, 1 ],
      [ 1,  0.0, 0.0, 1 ],
      [ 1,  10, 0.0, 1 ]
    ]
  ]);

  this.bottom = new MyPlane(scene,14,2,20,20);
  this.fuselage = new MyPatch(scene,2,1,20,20,	[	// U = 0
      [ // V = 0..1;
         [ -1, -7, 0.0, 1 ],
         [ -1,  7, 0.0, 1 ]

      ],
      // U = 1
      [ // V = 0..1
         [ 0, -8.5, 3.0, 1 ],
         [ 0,  1.5, 3.0, 1 ]
      ],
      // U = 2
      [ // V = 0..1
        [ 1, -7, 0.0, 1 ],
        [ 1,  7, 0.0, 1 ]
      ]
    ])
  };

MyVehicle.prototype = Object.create(CGFnurbsObject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI/2, 1, 0, 0);
	this.scene.rotate(Math.PI, 0,1,0);
	this.scene.rotate(Math.PI/2, 0, 0, -1);
	
	this.scene.pushMatrix();
    this.scene.translate(-2,0,0);
		this.scene.rotate(Math.PI, 0 ,0, 1);
    this.topWing.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(-2,0,0);
		this.scene.rotate(Math.PI, 1 ,0, 0);
    this.bottomWing.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(3,0,1.2);
		this.scene.rotate(Math.PI, 0 ,0, 1);
    this.scene.scale(0.5,0.5,0.5);
    this.topWing.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(3,0,1.2);
		this.scene.rotate(Math.PI, 1 ,0, 0);
    this.scene.scale(0.5,0.5,0.5);
    this.bottomWing.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.front.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.rotate(Math.PI,1,0,0);
    this.back.display();
  this.scene.popMatrix();
  
  this.scene.popMatrix();
}
