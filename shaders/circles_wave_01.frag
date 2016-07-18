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

    float value = 0.035 + (1.0 / sin(u_time * 4.0 + uva.x * 10.0 * sin(uva.y * 10.0) - 10.0 * uva.y * sin(uva.x * 10.0))) * 0.01;
    vec2 uvd = mod(uva, value) - value / 2.0;
    float c = .005 / sqrt(dot(uvd, uvd));

	float summ = smoothstep(0.5 - 0.02, 0.55, c);
	vec3 color = vec3(summ, summ, summ);
	gl_FragColor = vec4(color, 1.0);
}