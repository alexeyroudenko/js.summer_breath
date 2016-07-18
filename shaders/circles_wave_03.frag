//
//  Circles
//	http://www.alexeyrudenko.com/
//
//  Created by Alexey Roudenko on 17/07/15.
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

    float circle = smoothstep(0.5 - 0.01, 0.5, 0.1 / sqrt(dot(uva, uva)));
    
    float value = 0.05 + (1.0 * (.5 + sin(u_time / .5 + uva.y * 2.0)) * 0.03);
    vec2 uvd = mod(uva, value) - value / 2.0;
    float c = 40.0 * sqrt(dot(uvd, uvd));

	float summ = smoothstep(0.5 - 0.01, 0.45, c);
	vec3 color = vec3(summ, summ, summ);
	gl_FragColor = vec4(color, 1.0);
}