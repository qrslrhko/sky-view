#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;


out vec2 vST;

out vec3 vNf;
out vec3 vNs;
out vec3 vLf;
out vec3 vLs;
out vec3 vEf;
out vec3 vEs;

out float vLightIntensity; 

out vec2 resolution;
// clouds
out vec3  vMCposition;
out vec3  vECposition;
uniform vec3  uLightPos;
uniform float uScale;





vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

const vec3  LIGHTPOS = vec3( 5., 10., 10. );


void main()
{
	vST = gl_MultiTexCoord0.st;
	resolution = gl_MultiTexCoord0.xy;

	vec4 ECposition_sun = gl_ModelViewMatrix * gl_Vertex;
	
	vMCposition = uScale * vec3( gl_Vertex );
	vECposition = vec3( gl_ModelViewMatrix * gl_Vertex );

	vNf = normalize( gl_NormalMatrix * gl_Normal );	// surface normal vector
	vNs = vNf;

	vLf = eyeLightPosition - ECposition_sun.xyz;		// vector from the point
	//to the lighti position
	vLs = vLf;
	
	vEf = vec3( 0., 0., 0. ) - ECposition_sun.xyz;		// vector from the point
	// to the eye position
	vEs = vEf;
	

	// lighting
	vec3 tnorm = normalize( vec3(gl_NormalMatrix * gl_Normal));
	vec3 xxxECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
    vLightIntensity  = abs( dot( normalize(LIGHTPOS - xxxECposition), tnorm ) );
	

	if( vLightIntensity < 0.2 )
		vLightIntensity = 0.2;

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;






}