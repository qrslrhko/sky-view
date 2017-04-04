## Sky view performance

There are two different scenes: sunny and cloudy sky. 

The basic ideas in this performacne is like this, a shining sun, and few coulds. It is Elegant! In order to make sun vivic, I divided sun into three layers: white layer( it is the most brightest part), yellow layer(compass the brightest part) and solor halo layer:<br /> 

![idea](https://cloud.githubusercontent.com/assets/16565587/24595498/f0c3f6e0-17eb-11e7-8441-a6809c5c4667.jpg)<br />
<br /> 
<br /> 
There are four objects in my performacne, inculding one rectangular, and three circles.<br /> 
<br /> 
![origional](https://cloud.githubusercontent.com/assets/16565587/24595553/60bed6ae-17ec-11e7-8ef3-5c2d26110bf5.png)
<br />



### Make Objects
Let me introduce this user interface [glman](http://web.engr.oregonstate.edu/~mjb/glman/). It is helpful and easy to adjuct parameters or variables in code. Glman needs threes files, glib, vertex shader, and fragment shader. 

- glib file <br />

```glsl
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

```glsl
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
Take the advantage of [bilinear interpolation](https://en.wikipedia.org/wiki/Bilinear_interpolation) in wiki. In the upper figure, the green Point P which is we want to interpolate. The lower figure is an example of bilinear interpolation on the unit square. The erea of z = 1 has the same red color.<br /> 
<br />
<br />
<img width="247" alt="screen shot 2017-04-03 at 8 08 58 pm" src="https://cloud.githubusercontent.com/assets/16565587/24640137/6aeba7d4-18a9-11e7-99ce-05ce3b6eb08c.png">

<br />

If we want to do linear interpolation with two colors, we can divided a unit square into two section of colors.<br />
(0,1)~(x,y) and (x,y) ~(1,0) have the same color. It is like the previous figure, the eare of z =1 has the same red color.<br />  

```glsl
                          
                (0,1)           (1,1)
 		o---------------o
		.               .
		.       .       .
		.      (x,y)    .
		.               .
		o---------------o
	       (0,0)            (1,0)
	  
	    	    
	    
```
Take a part of idea in wiki, we use this formula to get the precentage of point (x,y) in unit square. The idea is also from [stackoverflow](http://stackoverflow.com/questions/5359258/opengl-how-to-render-perfect-rectangular-gradient) <br /> 
<br />
<img width="994" alt="screen shot 2017-04-03 at 2 07 46 am" src="https://cloud.githubusercontent.com/assets/16565587/24602637/8a26463c-1812-11e7-8126-96f9ca0fe5ce.png"> 
<br />
<br />
```glsl

color_1 : point(0,0)~(x,y) and point(x,y)~(1,1)
color_2 : pont(0,1)~(x,y)  and point(x,y)~(1,0)

=> color_1*(1-x)(1-y)_xy  + color_2*(1-x)y+(1-x)y
=> color_1*-1+x+y-2xy  + color_2*(x+y-2xy)

```
We can take x+y-2xy or -1+x+y-2xy as precentage of two colors in rectangular.According to [linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation):  <br />
** a  = color_1 * precentage + color_2 * (1 - precentage)** <br />
 <br />
In OpenGl, the mix function can help us do linear interpoliation. <br />
**mix( genType x , genType y , genType a)** <br />
=> x and y are the ranges that we want to interpolate. Here x is `vec4(light_blue,1)` and y is `vec4(navy_blue,1)`     <br />
=> value a is used to interpolate x and y. Here a is `x+y-2xy` or `1-x-y+2xy`.Because I named `uv = new_vST`, `uv` represnets xy  <br />
 The left picture is used by `x+y-2xy`, and the right picture is used by `1-x-y+2xy`. They perform the same figure.  <br />
![compare](https://cloud.githubusercontent.com/assets/16565587/24640813/ffbf070c-18ae-11e7-96fc-14f8a7844fd7.jpg) <br />

```glsl 
vec4  gradient_sky = vec4 (mix(vec4(light_blue,1) , vec4(navy_blue,1),  uv.y + uv.y  - 1* uv.y * uv.y)  );
 

```
In my program, I didn't use `x+y-2xy` or `1-x-y+2xy` becuase I don't want the same precentage of two colors. Thus, I use `x+y-1xy` or `1-x-y+1xy`.Here is my background:<br />

![iwant](https://cloud.githubusercontent.com/assets/16565587/24640969/43a6a122-18b0-11e7-86a1-ea51b763c2f2.png)





- **circle**

### Make coulds



### Apply lighting 






