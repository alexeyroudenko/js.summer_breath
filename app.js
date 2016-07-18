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
init();
animate();

function getSourceSynch(url) {
  var req = new XMLHttpRequest();
  req.open("GET", url, false);
  req.send(null);
  return (req.status == 200) ? req.responseText : null;
}

function select(fileName) {
	console.log(fileName);
	var vertexShader = getSourceSynch("plain.vert");
	var fragmentShader = getSourceSynch(fileName);
	material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	});
	if (mesh) mesh.material = material;
}

function loadCurrentShader() {
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
	select("shaders/" + fileName);
}

function getCurrentFromHash() {
	var hash = window.location.href.substring(window.location.href.indexOf("#")+1);
	var value = parseInt(hash) == NaN ? 0 : parseInt(hash)
	if (!value) value = 0;
	return value;
}

function init() {

	current = getCurrentFromHash(); 

	container = document.getElementById('container');
	camera = new THREE.Camera();
	camera.position.z = 1;
	scene = new THREE.Scene();
	var geometry = new THREE.PlaneBufferGeometry(2, 2);

	uniforms = {
		u_time: { type: "f", value: 1.0 },
		u_resolution: { type: "v2", value: new THREE.Vector2() }
	};

	loadCurrentShader();

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);


	stokeMaterial = new THREE.MeshBasicMaterial({transparent:true,color:0x000000,opacity: 0.0});
	stokeMesh = new THREE.Mesh(geometry, stokeMaterial);
	scene.add(stokeMesh);


	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';

	//container.appendChild(stats.domElement);

	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);
	
	document.addEventListener("touchstart", touchMove, false);
	document.addEventListener("touchstart", touchStart, false);
	document.addEventListener("touchmove", touchMove, false);
	document.addEventListener("touchend", touchMove, false);
	document.addEventListener("touchcancel", touchMove, false);
	document.addEventListener("click", onClick, false);
	
	window.scrollTo(0, 1); 
	setTimeout(function () {   window.scrollTo(0, 1); }, 1000);

	window.addEventListener('popstate', function(event) {
		ofChangePage();
	});

	startFade();
}

function startFade() {
	currentFade = fadeFrames;
	stokeMaterial.opacity = currentFade / fadeFrames;
}

// event if back/forward browser button
function ofChangePage() {
	current = getCurrentFromHash(); 
	loadCurrentShader();
	startFade();

}

// click or tap do the same
function nextShader() {
	current++;
	current = current % shaders.length;
	window.location.href = "#0" + current;
}

function onClick(event) {
	nextShader();
}

function touchStart(event) {
	if (event.touches[0].pageY > 9.0 * renderer.domElement.height / 10.0 / 2 && 
		event.touches[0].pageX > 7.0 * renderer.domElement.width / 10.0 / 2) {
		// hack for bottom link pressing
		document.location.href = "/";
	} else {
		nextShader();
	}
}

function touchMove(event) {
	event.preventDefault();
	//touches = event.touches;
}

function onWindowResize(event) {
	renderer.setSize(window.innerWidth, window.innerHeight);
	uniforms.u_resolution.value.x = renderer.domElement.width;
	uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
	requestAnimationFrame(animate);
	render();
	stats.update();
	currentFade-=3;

	if (currentFade >= 0) {
		stokeMaterial.opacity = currentFade / 100.0;
	}
}

function render() {
	uniforms.u_time.value += 0.015;
	renderer.render(scene, camera);
}
