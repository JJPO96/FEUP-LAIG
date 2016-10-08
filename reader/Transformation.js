/*
<!-- Deve existir um ou mais blocos "transformation" -->
<!-- Os identificadores "id" nao podem ser repetidos -->
<transformation id="ss">
   <!-- instrucoes a usar sem limite nem ordem -->
   <!-- deve existir pelo menos uma transformacao -->
   <translate x="ff" y="ff" z="ff" />
   <rotate axis="cc" angle="ff" />
   <scale x="ff" y="ff" z="ff" />
</transformation>
*/

function Translation(id){
  this.id = id;
  this.x;
  this.y;
  this.z
}

function Rotation(id){
  this.id = id;
  this.axis;
  this.angle;
}

function Scalation(id){
  this.id = id;
  this.x;
  this.y;
  this.z
}
