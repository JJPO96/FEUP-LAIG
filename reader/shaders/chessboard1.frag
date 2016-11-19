#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float dU;
uniform float dV;

uniform float sU;
uniform float sV;

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cS;



vec4 colorSeclect(vec2 tex, vec4 c1, vec4 c2) {
				if(((tex.x > (sU/dU)) && (tex.x < (sU+1.0)/dU)) && ((tex.y > (sV/dV)) && (tex.y < (sV+1.0)/dV)) ){
							return cS;
				}else{

	         if ((mod(dU*tex.x, 2.0) < 1.0) ^^ (mod(dV*tex.y, 2.0) < 1.0))
	         {
	            return c1;
	         }
	         else
	         {
	            return c2;
	         }
			 }
}

void main() {

  vec4 finalColor = texture2D(uSampler, vTextureCoord);

  vec4 colorToMix = colorSeclect(vTextureCoord,c1,c2);

  finalColor.rgba *= colorToMix;

  gl_FragColor = finalColor;
}
