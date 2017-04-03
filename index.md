## Sky view performance

There are two different scenes: sunny and cloudy sky. 

The basic ideas in this performacne is like this:<br /> 
![idea](https://cloud.githubusercontent.com/assets/16565587/24595467/b2130440-17eb-11e7-8438-7e02708710b8.jpg)
There are four objects in my performacne, inculding one rectangular, and three circle. <br /> 
![origional](https://cloud.githubusercontent.com/assets/16565587/24593365/9cb0d37a-17d7-11e7-9626-e0796c442eb6.png)

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


- **Rectangular and gradient color **

In OpenGl`glBegin(GL_QUADS)`, `glDrawArrays()`, `glDrawElements()` are several method to create rectangular. In glman, We have another  method `QuadXY` or` QuadXZ` in glib file to create a rectangular object.<br />
Here I use `QuadXY` to create a XY plane, passing through (Z = 0.2) Z=z. .<br /> 
4.0 is the dimension od XY plane from (-4.0,-4.0) to (4.0,4.0) in X and Y. .<br />    
nx and xy are the number of sub-quads in this plane is brken into. More inforimation in this [link](http://web.engr.oregonstate.edu/~mjb/glman/Doc/glman.pdf) 

```glib
QuadXY 0.2 4.0 100 100    \\ QuadXY z size nx ny
```





```glsl
  vec3 color;
 
    vec3  navy_blue = vec3( 0.137255, 0.137255, 0.556863 );

    vec3 light_blue = vec3(28./255., 169./255., 178./255.);  // good mint color


    color.r = new_vST.y * (navy_blue.r - light_blue.r) + light_blue.r;
    color.g = new_vST.y * (navy_blue.g - light_blue.g) + light_blue.g;
    color.b = new_vST.y * (navy_blue.b - light_blue.b) + light_blue.b;


    vec4  gradient_sky = vec4 (mix(vec4(light_blue,1) , vec4(navy_blue,1),  uv.y + uv.y  - 1* uv.y * uv.y)  );


```


- **circle**

### Make coulds



### Apply lighting 






Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```
