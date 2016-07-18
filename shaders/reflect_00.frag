//
//  Reflect
//	http://www.alexeyrudenko.com/
//
//  Created by Alexey Roudenko on 07/06/15.
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

    float speed = 0.09;
    float summ = 0.0;
    for (int i = 0; i < int(6); ++i) {
    	vec2 uvt = uva;
    	float deltaX = mod(speed * u_time * sin(0.4 * float(i) - 1.0) + float(i) / 5.0, 2.0);
		deltaX = abs(deltaX - 1.0);
		uvt.x += deltaX;

		float deltaY = mod(speed * u_time * sin(0.4 * float(i) + 1.0) + float(i) / 5.0, 2.0 / aspect);
		deltaY = abs(deltaY - 1.0 / aspect);
		uvt.y += deltaY;

		summ = summ + 1.0 / max(sqrt(dot(uvt, uvt)), .02);
	}  
	summ = smoothstep(0.5 - 0.1, 0.5, sin(summ));
	
	vec3 color = vec3(summ, summ, summ);
	gl_FragColor = vec4(color, 1.0);
}