## Sky view performance

There are two different scenes: sunny and cloudy sky. 

The basic ideas in this performacne is like this:<br /> 
![idea](https://cloud.githubusercontent.com/assets/16565587/24592942/a7fd5302-17d2-11e7-96b5-2ea9586766a5.jpg)
There are four objects in my performacne, inculding one rectangular, and three circle. <br /> 
![origional](https://cloud.githubusercontent.com/assets/16565587/24593365/9cb0d37a-17d7-11e7-9626-e0796c442eb6.png)

In order to make sun vivic, I divided sun into three layers: white layer, yellow layer nad solor halo layer. In addition, applythree types of lighting such as ambient specular diffuse in sun.  


### Make Objects
Let me introduce this user interface [glman](http://web.engr.oregonstate.edu/~mjb/glman/). It is helpful and easy to adjuct parameters, variables in code. Glman needs threes files, glib, vertex shader, and fragment shader. 
```markdown
##OpenGL GLIB
Ortho -5. 5.   -5. 5.
LookAt 0 0 2  0 0 0  0 1 0


Vertex   sun_sky.vert
Fragment sun_sky.frag
Program  Sun_sky					\
	uShininess <2. 3.15 800.>		\
    uLightX <-20. -.78 20.>                   \
    uLightY <-20. -.2559 20.>          \
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
glib file is like a menu, it lists all of uniform variables in fragment and vertex shader. Each uniform variable will show on user interface. We don't need to go back to compile the code again and again for adjusting variables, just adjust variables through user interface.     





-Rectangular

-circle

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
