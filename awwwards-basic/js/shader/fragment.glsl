varying float vNoise;
varying vec2 vUv;
// grab image to use as UV Texture
uniform sampler2D oceanTexture;
uniform float time;

void main() {
	vec3 blue = vec3(1.,0.,0.);
	vec3 green = vec3(0.,1.,1.);
	vec3 finalColor = mix(blue, green, 0.5*(vNoise + 1.));

	vec2 newUV = vUv;

	newUV = vec2(newUV.x, newUV.y + 0.01*sin(newUV.x*10. + time));


	vec4 oceanView = texture2D(oceanTexture, newUV);

//	gl_FragColor = vec4(finalColor,1.);
	gl_FragColor = vec4(vUv,0.,1.);
//	gl_FragColor = oceanView + vec4(vNoise);
	gl_FragColor = vec4(vNoise);
	}