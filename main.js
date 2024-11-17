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

// window resize
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    // update camera bounds
    camera.left = window.innerWidth/-2;
    camera.right = window.innerWidth/2;
    camera.top = window.innerHeight/2;
    camera.bottom = window.innerHeight/-2;
    // update projection matrix
    camera.updateProjectionMatrix();

    // resize renderer
    renderer.setSize( window.innerWidth, window.innerHeight );

    // change paddle position
    paddle.position.set(-window.innerWidth/2 + window.innerWidth/10, 0, 0);
    paddle2.position.set(window.innerWidth/2 - window.innerWidth/10, 0, 0);
}

// init key variables
let key1 = null; // key for player 1
let key2 = null; // key for player 2

// init movement variables
let moveAmount = 1;
let moveAmount2 = 1;
let maxSpeed = 5;

// init acceleration variables
let acceleration = null;
let acceleration2 = null;

// track when keys are pressed
window.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
    let keyCode = event.keyCode;
    switch(keyCode) {
        case 37: // left arrow key
            acceleration2 = false;
            break;
        case 38: // up arrow key
            key2 = "UP";
            break;
        case 39: // right arrow key
            acceleration2 = true;
            break;
        case 40: // down arrow key
            key2 = "DOWN";
            break;
        case 65: // A key
            acceleration = false;
            break;
        case 68: // D key
            acceleration = true;
            break;
        case 83: // S key
            key1 = "DOWN";
            break;
        case 87: // W key
            key1 = "UP";
            break;
    }
}

// track when keys are de-pressed
window.addEventListener("keyup", onKeyUp);

function onKeyUp(event) {
    let keyCode = event.keyCode;
    switch(keyCode) {
        case 37: // left arrow key
            acceleration2 = null;
            break;
        case 38: // up arrow key
            key2 = null;
            break;
        case 39: // right arrow key
            acceleration2 = null;
            break;
        case 40: // down arrow key
            key2 = null;
            break;
        case 65: // A key
            acceleration = null;
            break;
        case 68: // D key
            acceleration = null;
            break;
        case 83: // S key
            key1 = null;
            break;
        case 87: // W key
            key1 = null;
            break;
    }
}

function animate() {
    // change velocity
    if (acceleration == false) {
        if (moveAmount > 1) {
            moveAmount -= 0.1; // decelerate
        }
    }
    else if (acceleration == true) {
        if (moveAmount < maxSpeed) {
            moveAmount += 0.1; // accelerate
        }
    }
    if (acceleration2 == false) {
        if (moveAmount2 > 1) {
            moveAmount2 -= 0.1; // decelerate
        }
    }
    else if (acceleration2 == true) {
        if (moveAmount2 < maxSpeed) {
            moveAmount2 += 0.1; // accelerate
        }
    }

    // change position
    if (key1 != null) {
        if (key1 == "UP") {
            if (paddle.position.y + paddle.geometry.parameters.height/2 + moveAmount <= window.innerHeight/2) { // check if out of bounds
                paddle.position.y += moveAmount; // add moveAmount to Y value
            }
        }
        else if (key1 == "DOWN") {
            if (paddle.position.y - paddle.geometry.parameters.height/2 - moveAmount >= -window.innerHeight/2) { // check if out of bounds
                paddle.position.y -= moveAmount; // subtract moveAmount from Y value
            }
        }
    }
    if (key2 != null) {
        if (key2 == "UP") {
            if (paddle2.position.y + paddle2.geometry.parameters.height/2 + moveAmount <= window.innerHeight/2) { // check if out of bounds
                paddle2.position.y += moveAmount2; // add moveAmount2 to Y value
            }
        }
        else if (key2 == "DOWN") {
            if (paddle2.position.y - paddle2.geometry.parameters.height/2 - moveAmount >= -window.innerHeight/2) { // check if out of bounds
                paddle2.position.y -= moveAmount2; // subtract moveAmount2 from Y value
            }
        }
    }

    renderer.render( scene, camera );
}