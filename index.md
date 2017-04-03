## Sky view performance

There are two different scenes: sunny and cloudy sky. 

The basic ideas in this performacne is like this:<br /> 
![idea](https://cloud.githubusercontent.com/assets/16565587/24595498/f0c3f6e0-17eb-11e7-8441-a6809c5c4667.jpg)<br />
<br /> 
<br /> 
There are four objects in my performacne, inculding one rectangular, and three circle.<br /> 
![origional](https://cloud.githubusercontent.com/assets/16565587/24595553/60bed6ae-17ec-11e7-8ef3-5c2d26110bf5.png)
<br />

In order to make sun vivic, I divided sun into three layers: white layer, yellow layer nad solor halo layer. In addition, applythree types of lighting such as ambient specular diffuse in sun.  


### Make Objects
Let me introduce this user interface [glman](http://web.engr.oregonstate.edu/~mjb/glman/). It is helpful and easy to adjuct parameters or variables in code. Glman needs threes files, glib, vertex shader, and fragment shader. 

- glib file <br />
```glib
##OpenGL GLIB
Ortho -5. 5.   -5. 5.
LookAt 0 0 2  0 0 0  0 1 0


Vertex   sun_sky.vert
Fragment sun_sky.frag
Program  Sun_sky					\
	uShininess <2.0 3.15 800.0>		\
    uLightX <-20.0 -.78 20.>                   \
    uLightY <-20.0 -.2559 20.>          \
    uLightZ <-20. 2.93 20.>          \
   	uKa <0. 0.49 1.0>			\
	uKd <0. 0.611 1.0>			\
	uKs <0. 0.9329 3.0>			\
	uTol <0. .0356 .080>						\
	uTol_halo <0. .0754 .080>						\
	uAfewClouds <false>						\
	uTol_cloud <0. .0774 .080>						\
	uNoiseAmp_A <0. 0.8027 10.>  uNoiseFreq_A <0. 1.2485 10.>   \
	uNoiseAmp_B <0. 0.9835 10.>  uNoiseFreq_B <0. 1.1376 10.>   \
	uNoiseAmp_C <0. 0.9835 10.>  uNoiseFreq_C <0. 1.1376 10.>   \
	uCloudColor {0.9 0.9 0.9 1.} 			\
	uScale <0. .17 .3> 						 \
	uBias <0. .3 .9> 							\
	uSpecularColor {1. 1. 1. 1.}

//Color 1 .3 0
QuadXY .2 4. 100 100 
```

Glib file is like a menu, it lists all of uniform variables from fragment and vertex shader. Each uniform variable will be showed on user interface. We don't need to go back to compile the code again and again for adjusting variables, just adjust variables through user interface. It is so convenient!  

<img width="544" alt="screen shot 2017-04-02 at 7 29 13 pm" src="https://cloud.githubusercontent.com/assets/16565587/24593692/b77726a2-17da-11e7-8ee1-2b880926db0b.png">


- Rectangular

In OpenGl`glBegin(GL_QUADS)`, `glDrawArrays()`, `glDrawElements()` are several method to create rectangular. In glman, We have another  method `QuadXY` or` QuadXZ` in glib file to create a rectangular object.<br />
Here I use `QuadXY` to create a XY plane, passing through (Z = 0.2) Z=z.<br /> 
4.0 is the dimension od XY plane from (-4.0,-4.0) to (4.0,4.0) in X and Y. <br />    
nx and xy are the number of sub-quads in this plane is brken into. More inforimation in this [link](http://web.engr.oregonstate.edu/~mjb/glman/Doc/glman.pdf) 

```glib
QuadXY 0.2 4.0 100 100    \\ QuadXY z size nx ny
```


- Gradient color 

In the plane, I use two `navy_blue` and `navy_blue` to make gradient color. Here is a part of code in fragment shader. Input `vST` to   into fragment shader.

In vertex shader:<br /> 
```glsl

 out vec2 new_vST;
 ...
 new_vST = gl_MultiTexCoord0.st;
 ...
```
My idea is to take vertical gradient color. Here I take y axis `uv.y` to do gradient color with r,g,b color. linearly interpolate  three values.  

In fragment shader:<br />  
```glsl
   in vec2 new_vST;
   ...
   ...
   vec2 uv = new_vST;
   vec3 color; 
   vec3  navy_blue = vec3( 0.137255, 0.137255, 0.556863 );
   vec3 light_blue = vec3(28./255., 169./255., 178./255.);  

   vec4  gradient_sky = vec4 (mix(vec4(light_blue,1) , vec4(navy_blue,1),  uv.y + uv.y  - 1* uv.y * uv.y)  );


```
According to [bilinear interpolation](https://en.wikipedia.org/wiki/Bilinear_interpolation) in wiki,
<img width="994" alt="screen shot 2017-04-03 at 2 07 46 am" src="https://cloud.githubusercontent.com/assets/16565587/24602637/8a26463c-1812-11e7-8126-96f9ca0fe5ce.png">. It shows a gradient color on a square with four colors. In my project, I only need two colors on rectangular, so let's change the formular a little bit different... <br />

```          (1-x)(y)             xy
                (0,1)           (1,1)
 		o---------------o
		.               .
		.       .       .
		.      (x,y)    .
		.               .
		o---------------o
	       (0,0)            (1,0)
	    (1-x)(1-y)         (1-y)x  
	    	    
	    
```

An example on [Wiki](https://en.wikipedia.org/wiki/Bilinear_interpolation).The point (1,0) and (0,1) have the same navy_blue color; (0,0) and (1,1) have the same light_blue color.<br />
<br />
<img width="250" alt="screen shot 2017-04-03 at 2 51 18 am" src="https://cloud.githubusercontent.com/assets/16565587/24604140/7d7d6c34-1818-11e7-878d-5382fae2645a.png"> <br />
<br />

```  
   (1-x)(y)*Color_1 + (1-y)x*Color_1   and  (1-x)(1-y)*Color_2 + xy*Color_2
 =  y-xy+x-xy*Color_1  and  1-y-x+xy+xy*Color_2
 =  (x+y-2xy)Color_1   and  (1-x-y+2xy)*Color_2 
 =  (x+y-2xy)Color_1   and  (-1+x+y-2xy)*Color_2
 
```  
We can take x+y-2xy or -1+x+y-2xy as precentage of two colors in rectangular. Here, I prefer `x+y-2xy` as the precentage of two colors.        

- **circle**

### Make coulds



### Apply lighting 






