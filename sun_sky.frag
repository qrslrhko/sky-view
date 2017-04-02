#version 330 compatibility
uniform sampler2D uSkyUnit;


uniform float uTol;
uniform float uTol_cloud;
uniform float uTol_halo;
uniform float uMaxAlpha;
uniform float uDensity;
//uniform float uBlend;

uniform float uShininess;
uniform float uKa, uKd, uKs;
//uniform vec4 uColor;
uniform vec4 uSpecularColor;
uniform sampler3D Noise3;
uniform vec4  uSkyColor;
uniform vec4  uCloudColor;
uniform float uBias;

// only a few clouds
uniform float uNoiseAmp_A;
uniform float uNoiseFreq_A;
uniform float uNoiseAmp_B;
uniform float uNoiseFreq_B;
uniform float uNoiseAmp_C;
uniform float uNoiseFreq_C;
uniform bool uAfewClouds;


in float vLightIntensity;

in vec3 vNf,vLf,vEf;
in vec3 vNs,vLs,vEs;
in vec3  vMCposition;
in vec3  vECposition;

in vec2 vST;
in vec2 resolution;

void main()
{

     vec2 new_vST  = vST;

    
    vec4 back_color = texture2D(uSkyUnit,vec2(new_vST.s , new_vST.t));
    vec4 goal;
    vec4 sun_goal;
    vec4 circle_sun;

    vec4 top_color = vec4(1,2,1,1);
    vec4 bottom_color = vec4(28./255., 169./255., 178./255. ,1 );
    vec4 white_color = vec4(1. ,1. , 1. ,1);

    vec3 Normal;
    vec3 Light;
    vec3 Eye;

    vec4 white = vec4(1.,1.,1.,1.);
    vec4 Color = vec4(1 , .7, 0. ,1.);
    Normal = normalize(vNs);
    Light = normalize(vLs);
    Eye = normalize(vEs);


    vec2 uv = new_vST;

// gradient sky color ----------------------ok 
    
    vec3 color;
 
    vec3  navy_blue = vec3( 0.137255, 0.137255, 0.556863 );

    vec3 light_blue = vec3(28./255., 169./255., 178./255.);  // good mint color


    color.r = new_vST.y * (navy_blue.r - light_blue.r) + light_blue.r;
    color.g = new_vST.y * (navy_blue.g - light_blue.g) + light_blue.g;
    color.b = new_vST.y * (navy_blue.b - light_blue.b) + light_blue.b;

   //vec4 gradient_sky = vec4(color,1);
  
    vec4  gradient_sky = vec4 (mix(vec4(light_blue,1) , vec4(navy_blue,1),  uv.y + uv.y  - 1* uv.y * uv.y)  );


  // gl_FragColor = gradient_sky;

//----------------------------//


// for sun------------------- 
   // vec4 halo = vec4(1.0 ,0.25, 0 ,1);
   vec4 halo = vec4( 0.8 , 0.498039,0.196078,1);   
    vec3 to_sun  = normalize(vEf);
    vec3 to_eye  = normalize(vLf);


    vec4 vColor = vec4(1 , .7, 0. ,1.);
    new_vST -= vec2(.5 , .5);
 
    float dist = sqrt( dot(new_vST,new_vST) );
    float t =smoothstep(.08 + uTol , .08 - uTol, dist); 
 
   
   // sun_goal = mix(vColor,vec4(1,1,1,1), t);
    vec4 gold_sun;  // gold 
    gold_sun = mix(vec4(1,1,1,1),vColor, t);

    //halo
    vec2 new_vST_halo = vST;
    vec3 halo_color;
    
    vec4 orange_sun;
    new_vST_halo -= vec2(.5, .5);
    float dist_halo = sqrt( dot(new_vST_halo,new_vST_halo) );
    float t_h =smoothstep(.1 + uTol_halo , .1 - uTol_halo, dist_halo); 
    orange_sun = mix(vec4(1,1,1,1),halo, t_h);

    sun_goal = mix(orange_sun, gold_sun, t_h );
   // vColor = vec4(color * vLightIntensity,1);


// clouds--------
    vec4  noisevec  = texture3D( Noise3, vMCposition );

    float intensity = noisevec.r + noisevec.g + noisevec.b + noisevec.a;
    intensity -= 2;     // -1 to 1

    vec3 cloud_color   = mix( gradient_sky.rgb, uCloudColor.rgb, clamp( uBias+intensity, 0., 1. ) ) * vLightIntensity;
    vec4 abundant_color = vec4(cloud_color, 1.);


//----a few of clouds
    if(uAfewClouds)
    {
        //coloud 1
        vec3 stp = uNoiseFreq_A * vMCposition;
        vec4 nv = texture( Noise3, stp );   //the textures units, sampler variable
        vec2 st_cloud = new_vST;
        st_cloud -= vec2(-.2 , -.2);    //coordinate of cloud 1     // vec2(.2 , -.35);  
        float dist_c = sqrt( dot(st_cloud,st_cloud) );
        
        float sum = nv.r + nv.g + nv.b + nv.a; 
        sum = ( sum - 2. ) * uNoiseAmp_A;  
        dist_c += sum;
        
        float tt =smoothstep(.1 + uTol_cloud , .1 - uTol_cloud, dist_c); 
        vec4 cloud_1 = mix(gradient_sky,white_color, tt);

        // cloud 2

        vec3 stp_2 = uNoiseFreq_B * vMCposition;
        vec4 nv_2 = texture( Noise3, stp_2 );   //the textures units, sampler variable
        vec2 st_cloud_2 = new_vST;
        st_cloud_2 -= vec2(.2 , -.35);    //coordinate of cloud 1     // vec2(.2 , -.35);  
        float dist_c_2 = sqrt( dot(st_cloud_2,st_cloud_2) );
        
        float sum_2 = nv_2.r + nv_2.g + nv_2.b + nv_2.a; 
        sum_2 = ( sum_2 - 2. ) * uNoiseAmp_B;  
        dist_c_2 += sum_2;
        
        float ttt =smoothstep(.1 + uTol_cloud , .1 - uTol_cloud, dist_c_2); 
        vec4 cloud_2 = mix(gradient_sky,white_color, ttt);

        // combime cloud1 and cloud 2
         vec4 combime_cloud =  mix(  cloud_1, cloud_2, ttt);

       //coloud 3
        vec3 stp_3 = uNoiseFreq_C * vMCposition;
        vec4 nv_3 = texture( Noise3, stp_3 );   //the textures units, sampler variable
        vec2 st_cloud_3 = new_vST;
        st_cloud_3 -= vec2(.2 , 0.);    //coordinate of cloud 1     // vec2(.2 , -.35);  
        float dist_c_3 = sqrt( dot(st_cloud_3,st_cloud_3) );
        
        float sum_3 = nv_3.r + nv_3.g + nv_3.b + nv_3.a; 
        sum_3 = ( sum_3 - 2. ) * uNoiseAmp_C;  
        dist_c_3 += sum_3;
        
        float tttt =smoothstep(.1 + uTol_cloud , .1 - uTol_cloud, dist_c_3); 
        vec4 cloud_3 = mix(gradient_sky,white_color, tttt);


        // combime cloud1 ,cloud 2 and cloud 3 
         vec4 three_clouds =  mix(  combime_cloud, cloud_3, tttt);


         circle_sun =  mix(three_clouds,sun_goal,t);


      //    gl_FragColor = circle_sun;
    }
//----


// lighting-------------  
     else{
    
        circle_sun =  mix(abundant_color,sun_goal,t);
    
     }

   // gl_FragColor = circle_sun;

    vec4 vsun_Color = circle_sun;        

    vec4 ambient = uKa * vsun_Color;

    float d = max( dot(Normal,Light), 0. );
    vec4 diffuse = uKd * d * vsun_Color;

    float s = 0.;

    if( dot(Normal,Light) > 0. )        // only do specular if the light can see the point
        {
            vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
            s = pow( max( dot(Eye,ref),0. ), uShininess );
    }

    vec4 specular = uKs * s * uSpecularColor;
    sun_goal =  vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );

       

     gl_FragColor =  vLightIntensity * sun_goal;    




}