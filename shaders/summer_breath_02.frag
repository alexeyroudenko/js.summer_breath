//
//  Summer Breath
//	http://www.alexeyrudenko.com/
//
//  Created by Alexey Roudenko on 07/06/15.
//  Copyright (c) 2015 Alexey Roudenko. All rights reserved.
//

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main()	{
	vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / u_resolution.xy;
	float aspect = u_resolution.x / u_resolution.y;
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	
	vec2 position = 0.5 - uv;
    vec2 uva = vec2(position.x, position.y / aspect);
    vec2 uvd = uva;

	uvd.x += .06 * cos(10. * uvd.y + 1.4 * u_time + u_mouse.x / u_resolution.x);
	uvd.y += .05 * sin(10. * uvd.x + 1.4 * u_time + u_mouse.y / u_resolution.y);


	float r = 20.0 * sqrt(dot(uvd, uvd)) + 30.0 * sin(-0.01 * u_time);
	float value = (1.0 * sin(10.0 * r));
	float col = smoothstep(0.5 - 0.2, 0.5, value);



	float line = cos(-.5 * u_resolution.x * uvd.x + 14.1 * u_time);
	line = smoothstep(0.4 - 0.2, 0.5, line);
	
	float dcircle = smoothstep(0.5 - 0.01, 0.5, .2 / sqrt(dot(uvd, uvd)));


	float circle = smoothstep(0.5 - 0.01, 0.5, .1 / sqrt(dot(uva, uva)));	

	float summ = 1.0 * (dcircle * line + col * (1.0 - dcircle)) + 1.0 * circle * sin(u_time * 1.5);




	vec3 color = vec3(summ, summ, summ);
	gl_FragColor = vec4(color, 1.0);
}