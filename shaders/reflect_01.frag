//
//  Reflect
//	http://www.alexeyrudenko.com/
//
//  Created by Alexey Roudenko on 17/07/15.
//  Copyright (c) 2015 Alexey Roudenko. All rights reserved.
//

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main()	{
	float aspect = u_resolution.x / u_resolution.y;
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;	
	vec2 position = -uv;
    vec2 uva = vec2(position.x, position.y / aspect);

    float cycleTime = 10000.0 * sin(u_time * 0.0001);

    float speed = 0.05;
    float summ = 0.0;
    for (int i = 0; i < int(5); ++i) {
    	vec2 uvt = uva;
		uvt += abs(mod(speed * cycleTime / cos(.5 * float(i) + 1.01 * uva + cycleTime * .000001) + float(i) / 1.0, 2.0) - 1.510);
		summ += 1.0 / max(sqrt(dot(uvt, uvt)), .02);
	}  
	summ = smoothstep(0.5 - 0.1, 0.5, sin(summ));
	
	vec3 color = vec3(summ, summ, summ);
	gl_FragColor = vec4(color, 1.0);
}