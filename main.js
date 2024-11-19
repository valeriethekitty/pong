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

// create ball
const ball_geometry = new THREE.CircleGeometry( 10 );
const ball_material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, side: THREE.DoubleSide });
const ball = new THREE.Mesh (ball_geometry, ball_material);

// add ball to scene
scene.add(ball);

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
let maxSpeed = 15;

// init acceleration variables
let acceleration = null;
let acceleration2 = null;

// init pause variable
let pause = true;

// init direction variables and constants
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;
let dirX = LEFT;
let dirY = UP;

// init ball velocity variables
let ballVelocityX = 10;
let ballVelocityY = 0;

// track when keys are pressed
window.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
    let keyCode = event.keyCode;
    switch(keyCode) {
        case 32: // space key
            pause = !pause;
            break;
        case 37: // left arrow key
            acceleration2 = false;
            break;
        case 38: // up arrow key
            key2 = UP;
            break;
        case 39: // right arrow key
            acceleration2 = true;
            break;
        case 40: // down arrow key
            key2 = DOWN;
            break;
        case 65: // A key
            acceleration = false;
            break;
        case 68: // D key
            acceleration = true;
            break;
        case 83: // S key
            key1 = DOWN;
            break;
        case 87: // W key
            key1 = UP;
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

// reset ball function
function resetBall() {
    pause = true;
    ball.position.set(0, 0, 0);
    ballVelocityX = 10;
    ballVelocityY = 0;
}

// check collision

function checkCollision( object, object2 ) {
    object.updateMatrixWorld();
    object2.updateMatrixWorld();

    const box = new THREE.Box3().setFromObject(object);
    const box2 = new THREE.Box3().setFromObject(object2);

    return box.intersectsBox(box2);
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
        if (key1 == UP) {
            if (paddle.position.y + paddle.geometry.parameters.height/2 + moveAmount <= window.innerHeight/2) { // check if out of bounds
                paddle.position.y += moveAmount; // add moveAmount to Y value
            }
        }
        else if (key1 == DOWN) {
            if (paddle.position.y - paddle.geometry.parameters.height/2 - moveAmount >= -window.innerHeight/2) { // check if out of bounds
                paddle.position.y -= moveAmount; // subtract moveAmount from Y value
            }
        }
    }
    if (key2 != null) {
        if (key2 == UP) {
            if (paddle2.position.y + paddle2.geometry.parameters.height/2 + moveAmount <= window.innerHeight/2) { // check if out of bounds
                paddle2.position.y += moveAmount2; // add moveAmount2 to Y value
            }
        }
        else if (key2 == DOWN) {
            if (paddle2.position.y - paddle2.geometry.parameters.height/2 - moveAmount >= -window.innerHeight/2) { // check if out of bounds
                paddle2.position.y -= moveAmount2; // subtract moveAmount2 from Y value
            }
        }
    }

    // move ball
    if (!pause) { // if game not paused
        // update X position
        if (dirX == LEFT) {
            ball.position.x -= ballVelocityX;
        }
        else if (dirX == RIGHT) {
            ball.position.x += ballVelocityX;
        }
        // update Y position
        if (dirY == DOWN) {
            // check for ball collision with wall
            if (ball.position.y - ball.geometry.parameters.radius - ballVelocityY >= -window.innerHeight/2) {
                ball.position.y -= ballVelocityY;
            }
            else {
                dirY = UP;
            }
        }
        else if (dirY == UP) {
            // check for ball collision with wall
            if (ball.position.y + ball.geometry.parameters.radius + ballVelocityY <= window.innerHeight/2) {
                ball.position.y += ballVelocityY;
            }
            else {
                dirY = DOWN;
            }
        }
    }

    // check for goal scoring 
    if (ball.position.x >= window.innerWidth/2 + ball.geometry.parameters.radius || ball.position.x <= -window.innerWidth/2 - ball.geometry.parameters.radius) {
        resetBall();
    }

    // check for ball collision with paddle
    if (dirX == LEFT) {
        if (checkCollision(ball, paddle)) { // if collide, change dirX and angle
            dirX = RIGHT;

            let offset = (ball.position.y + ball.geometry.parameters.radius*2 - paddle.position.y)/(paddle.geometry.parameters.height + ball.geometry.parameters.radius*2);
            let phi = 0.25 * Math.PI * (2 * offset - 1);

            ballVelocityY = Math.sqrt(ballVelocityX**2 + ballVelocityY**2) + Math.sin(phi);
        }
    }
    else if (dirX == RIGHT) {
        if (checkCollision(ball, paddle2)) { // if collide, change dirX and angle
            dirX = LEFT;

            let offset = (ball.position.y + ball.geometry.parameters.radius*2 - paddle2.position.y)/(paddle2.geometry.parameters.height + ball.geometry.parameters.radius*2);
            let phi = 0.25 * Math.PI * (2 * offset - 1);

            ballVelocityY = Math.sqrt(ballVelocityX**2 + ballVelocityY**2) + Math.sin(phi);
        }
    }

    renderer.render( scene, camera );
}