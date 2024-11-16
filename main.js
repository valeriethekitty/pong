import * as THREE from 'three';

// create scene
const scene = new THREE.Scene();

// set background color to black
let color = new THREE.Color( 0x000000 );
scene.background = color;

// create camera
/* orthographic for rendering a 2D scene */
const camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/-2, window.innerHeight/2, 1, 1000);

// add camera to scene
scene.add(camera);

// create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

function animate() {
    renderer.render( scene, camera );
}