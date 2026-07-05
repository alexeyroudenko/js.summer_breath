//
//  Summer Breath
//	http://www.alexeyrudenko.com/
//
//  Created by Alexey Roudenko on 07/06/15.
//  Copyright (c) 2015 Alexey Roudenko. All rights reserved.
//

if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer;
var uniforms;

var material, stokeMaterial;
var mesh, stokeMesh;

var shaders = [];
var current = 0;
var fadeFrames = 100;
var currentFade = 0;

function getSource(url, callback) {
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.onload = function () {
		callback(req.status === 200 ? req.responseText : null);
	};
	req.onerror = function () {
		callback(null);
	};
	req.send(null);
}

function withFragmentPrecision(source) {
	if (!source) return source;
	if (/precision\s+(lowp|mediump|highp)\s+float/.test(source)) return source;
	return "precision mediump float;\n" + source;
}

function select(fileName, callback) {
	getSource("plain.vert", function (vertexShader) {
		getSource(fileName, function (fragmentShader) {
			if (!vertexShader || !fragmentShader) {
				console.error("Failed to load shader:", fileName);
				if (callback) callback(false);
				return;
			}

			material = new THREE.ShaderMaterial({
				uniforms: uniforms,
				vertexShader: vertexShader,
				fragmentShader: withFragmentPrecision(fragmentShader)
			});

			if (mesh) mesh.material = material;
			if (callback) callback(true);
		});
	});
}

function loadCurrentShader(callback) {
	shaders = [
		"summer_breath_00.frag",
		"summer_breath_01.frag",
		"summer_breath_02.frag",
		"summer_breath_03.frag",
		"reflect_00.frag",
		"reflect_01.frag",
		"circles_wave_01.frag",
		"circles_wave_02.frag",
		"circles_wave_03.frag"
	];
	var fileName = shaders[current];
	select("shaders/" + fileName, callback);
}

function getCurrentFromHash() {
	var hashIndex = window.location.href.indexOf("#");
	if (hashIndex === -1) return 0;
	var hash = window.location.href.substring(hashIndex + 1);
	var value = parseInt(hash, 10);
	return isNaN(value) ? 0 : value;
}

function init() {
	current = getCurrentFromHash();

	container = document.getElementById("container");
	camera = new THREE.Camera();
	camera.position.z = 1;
	scene = new THREE.Scene();
	var geometry = new THREE.PlaneBufferGeometry(2, 2);

	uniforms = {
		u_time: { type: "f", value: 1.0 },
		u_resolution: { type: "v2", value: new THREE.Vector2() }
	};

	loadCurrentShader(function () {
		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		stokeMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: 0x000000, opacity: 0.0 });
		stokeMesh = new THREE.Mesh(geometry, stokeMaterial);
		scene.add(stokeMesh);

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		container.appendChild(renderer.domElement);
		stats = new Stats();
		stats.domElement.style.position = "absolute";
		stats.domElement.style.top = "0px";

		onWindowResize();
		window.addEventListener("resize", onWindowResize, false);

		document.addEventListener("touchstart", touchMove, false);
		document.addEventListener("touchstart", touchStart, false);
		document.addEventListener("touchmove", touchMove, false);
		document.addEventListener("touchend", touchMove, false);
		document.addEventListener("touchcancel", touchMove, false);
		document.addEventListener("click", onClick, false);

		window.addEventListener("hashchange", onHashChange, false);

		window.scrollTo(0, 1);
		setTimeout(function () { window.scrollTo(0, 1); }, 1000);

		startFade();
		animate();
	});
}

function startFade() {
	currentFade = fadeFrames;
	if (stokeMaterial) stokeMaterial.opacity = currentFade / fadeFrames;
}

function onHashChange() {
	current = getCurrentFromHash();
	loadCurrentShader(function () {
		startFade();
	});
}

function nextShader() {
	current = (current + 1) % shaders.length;
	window.location.hash = "#0" + current;
	loadCurrentShader(function () {
		startFade();
	});
}

function onClick(event) {
	nextShader();
}

function touchStart(event) {
	if (event.touches[0].pageY > 9.0 * renderer.domElement.height / 10.0 / 2 &&
		event.touches[0].pageX > 7.0 * renderer.domElement.width / 10.0 / 2) {
		document.location.href = "/";
	} else {
		nextShader();
	}
}

function touchMove(event) {
	event.preventDefault();
}

function onWindowResize(event) {
	if (!renderer) return;
	renderer.setSize(window.innerWidth, window.innerHeight);
	uniforms.u_resolution.value.x = renderer.domElement.width;
	uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
	requestAnimationFrame(animate);
	if (!renderer || !mesh) return;
	render();
	stats.update();
	currentFade -= 3;

	if (currentFade >= 0 && stokeMaterial) {
		stokeMaterial.opacity = currentFade / 100.0;
	}
}

function render() {
	uniforms.u_time.value += 0.015;
	renderer.render(scene, camera);
}

init();
