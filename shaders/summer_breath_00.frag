//
//  Summer Breath
//	http://www.alexeyrudenko.com/
//
//  Created by Alexey Roudenko on 07/06/15.
//  Copyright (c) 2015 Alexey Roudenko. All rights reserved.
//

//	uniform float u_time;: shader playback time (in seconds)
//	uniform vec2 u_resolution;: viewport resolution (in pixels)
//	uniform vec2 u_mouse;: mouse pixel coords (xy: pos, zw: buttons)
//	varying vec2 v_texcoord: UV of the billboard ( normalized )

uniform vec2 u_resolution;
uniform float u_time;

void main()	{
	vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / u_resolution.xy;
	float aspect = u_resolution.x / u_resolution.y;
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	vec2 position = 0.5 - uv;			
    vec2 uva = vec2(position.x, position.y / aspect);
    vec2 uvd = uva;
	uvd.x += .1 * cos(10. * uvd.y + 0.08 * u_time);
	uvd.y += .1 * sin(10. * uvd.x + 0.08 * u_time);
	float r = 10.0 * sqrt(dot(uvd, uvd));
	float value = (1.0 * sin(20.0 * r - 10.0 * u_time));
	float col = smoothstep(0.01, 0.5, value);
	vec3 color = vec3(col, col, col);
	gl_FragColor = vec4(color, 1.0);
}