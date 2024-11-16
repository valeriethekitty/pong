import * as THREE from 'three';

// create scene
const scene = new THREE.Scene();

// set background color to black
let color = new THREE.Color( 0x000000 );
scene.background = color;

// create camera
/* orthographic for rendering a 2D scene */
const camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 1000);

// set camera position and lookAt
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 0);

// add camera to scene
scene.add(camera);

// create paddles
const paddle_geometry = new THREE.PlaneGeometry( 10, 70 );
const paddle_material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, side: THREE.DoubleSide });
const paddle = new THREE.Mesh (paddle_geometry, paddle_material);
const paddle2 = new THREE.Mesh (paddle_geometry, paddle_material);

// set starting positions for paddles
paddle.position.set(-window.innerWidth/2 + window.innerWidth/10, 0, 0);
paddle2.position.set(window.innerWidth/2 - window.innerWidth/10, 0, 0);

// add paddles to scene
scene.add(paddle);
scene.add(paddle2);

// create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

function animate() {
    renderer.render( scene, camera );
}