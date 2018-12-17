const THREE = require('three');
const TWEEN = require('tween');
const config_project = require('./config_file');

THREE.FlyControls = function ( object, domElement ) {

    this.object = object;

    this.domElement = ( domElement !== undefined ) ? domElement : document;
    if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

    // API

    this.movementSpeed = 1.0;
    this.rollSpeed = 0.005;

    this.dragToLook = false;
    this.autoForward = false;

    // disable default target object behavior

    // internals

    this.tmpQuaternion = new THREE.Quaternion();

    this.mouseStatus = 0;

    this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
    this.moveVector = new THREE.Vector3( 0, 0, 0 );
    this.rotationVector = new THREE.Vector3( 0, 0, 0 );

    this.keydown = function ( event ) {

        if ( event.altKey ) {

            return;

        }

        //event.preventDefault();

        switch ( event.keyCode ) {

            case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

            case 87: /*W*/ this.moveState.forward = 1; break;
            case 83: /*S*/ this.moveState.back = 1; break;

            case 65: /*A*/ this.moveState.left = 1; break;
            case 68: /*D*/ this.moveState.right = 1; break;

            case 82: /*R*/ this.moveState.up = 1; break;
            case 70: /*F*/ this.moveState.down = 1; break;

            case 38: /*up*/ this.moveState.pitchUp = 1; break;
            case 40: /*down*/ this.moveState.pitchDown = 1; break;

            case 37: /*left*/ this.moveState.yawLeft = 1; break;
            case 39: /*right*/ this.moveState.yawRight = 1; break;

            case 81: /*Q*/ this.moveState.rollLeft = 1; break;
            case 69: /*E*/ this.moveState.rollRight = 1; break;

        }

        this.updateMovementVector();
        this.updateRotationVector();

    };

    this.keyup = function ( event ) {

        switch ( event.keyCode ) {

            case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

            case 87: /*W*/ this.moveState.forward = 0; break;
            case 83: /*S*/ this.moveState.back = 0; break;

            case 65: /*A*/ this.moveState.left = 0; break;
            case 68: /*D*/ this.moveState.right = 0; break;

            case 82: /*R*/ this.moveState.up = 0; break;
            case 70: /*F*/ this.moveState.down = 0; break;

            case 38: /*up*/ this.moveState.pitchUp = 0; break;
            case 40: /*down*/ this.moveState.pitchDown = 0; break;

            case 37: /*left*/ this.moveState.yawLeft = 0; break;
            case 39: /*right*/ this.moveState.yawRight = 0; break;

            case 81: /*Q*/ this.moveState.rollLeft = 0; break;
            case 69: /*E*/ this.moveState.rollRight = 0; break;

        }

        this.updateMovementVector();
        this.updateRotationVector();

    };

    this.mousedown = function ( event ) {

        if ( this.domElement !== document ) {

            this.domElement.focus();

        }

        event.preventDefault();
        event.stopPropagation();

        if ( this.dragToLook ) {

            this.mouseStatus ++;

        } else {

            switch ( event.button ) {

                case 0: this.moveState.forward = 1; break;
                case 2: this.moveState.back = 1; break;

            }

            this.updateMovementVector();

        }

    };

    this.mousemove = function ( event ) {

        if ( ! this.dragToLook || this.mouseStatus > 0 ) {

            var container = this.getContainerDimensions();
            var halfWidth = container.size[ 0 ] / 2;
            var halfHeight = container.size[ 1 ] / 2;

            this.moveState.yawLeft = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth ) / halfWidth;
            this.moveState.pitchDown = ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

            this.updateRotationVector();

        }

    };

    this.mouseup = function ( event ) {

        event.preventDefault();
        event.stopPropagation();

        if ( this.dragToLook ) {

            this.mouseStatus --;

            this.moveState.yawLeft = this.moveState.pitchDown = 0;

        } else {

            switch ( event.button ) {

                case 0: this.moveState.forward = 0; break;
                case 2: this.moveState.back = 0; break;

            }

            this.updateMovementVector();

        }

        this.updateRotationVector();

    };

    this.update = function ( delta ) {

        var moveMult = delta * this.movementSpeed;
        var rotMult = delta * this.rollSpeed;

        this.object.translateX( this.moveVector.x * moveMult );
        this.object.translateY( this.moveVector.y * moveMult );
        this.object.translateZ( this.moveVector.z * moveMult );

        this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
        this.object.quaternion.multiply( this.tmpQuaternion );

        // expose the rotation vector for convenience
        this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );


    };

    this.updateMovementVector = function () {

        var forward = ( this.moveState.forward || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;

        this.moveVector.x = ( - this.moveState.left + this.moveState.right );
        this.moveVector.y = ( - this.moveState.down + this.moveState.up );
        this.moveVector.z = ( - forward + this.moveState.back );

        //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

    };

    this.updateRotationVector = function () {

        this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
        this.rotationVector.y = ( - this.moveState.yawRight + this.moveState.yawLeft );
        this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );

        //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

    };

    this.getContainerDimensions = function () {

        if ( this.domElement != document ) {

            return {
                size: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
                offset: [ this.domElement.offsetLeft, this.domElement.offsetTop ]
            };

        } else {

            return {
                size: [ window.innerWidth, window.innerHeight ],
                offset: [ 0, 0 ]
            };

        }

    };

    function bind( scope, fn ) {

        return function () {

            fn.apply( scope, arguments );

        };

    }

    function contextmenu( event ) {

        event.preventDefault();

    }

    this.dispose = function () {

        this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
        this.domElement.removeEventListener( 'mousedown', _mousedown, false );
        this.domElement.removeEventListener( 'mousemove', _mousemove, false );
        this.domElement.removeEventListener( 'mouseup', _mouseup, false );

        window.removeEventListener( 'keydown', _keydown, false );
        window.removeEventListener( 'keyup', _keyup, false );

    };

    var _mousemove = bind( this, this.mousemove );
    var _mousedown = bind( this, this.mousedown );
    var _mouseup = bind( this, this.mouseup );
    var _keydown = bind( this, this.keydown );
    var _keyup = bind( this, this.keyup );

    this.domElement.addEventListener( 'contextmenu', contextmenu, false );

    this.domElement.addEventListener( 'mousemove', _mousemove, false );
    this.domElement.addEventListener( 'mousedown', _mousedown, false );
    this.domElement.addEventListener( 'mouseup', _mouseup, false );

    window.addEventListener( 'keydown', _keydown, false );
    window.addEventListener( 'keyup', _keyup, false );

    this.updateMovementVector();
    this.updateRotationVector();

};


/****** CONFIG STARTS ******/
var config = [];

function stars_config() {
    var i = 0;
    for (project of config_project.project) {
        config.push({id: i++, file: project.image, text: project.name});
        i++;
    }
}



/****** MAIN ******/
if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var camera, scene, renderer, stats, material, controls;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var sprite;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var clock = new THREE.Clock();
var sprites = [];


function create_star(star, index) {
    var spriteMap = new THREE.TextureLoader().load(star.file);
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    sprites[index] = new THREE.Sprite(spriteMaterial);
    sprites[index].name = star.id.toString();
    sprites[index].position.x = 20 * Math.random() - 10;
    sprites[index].position.y = 20 * Math.random() - 10;
    sprites[index].position.z = 20 * Math.random() - 10;

    scene.add(sprites[index]);
}

function create_star_p(index) {
    var spriteMap = new THREE.TextureLoader().load("star.png");
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    sprites[index] = new THREE.Sprite(spriteMaterial);
    //sprites[index].name = index.toString();
    sprites[index].position.x = 50 * Math.random() - 25;
    sprites[index].position.y = 50 * Math.random() - 25;
    sprites[index].position.z = 50 * Math.random() - 25;
    scene.add(sprites[index]);
}

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000);
    camera.position.z = 75;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.001 );
    /*
    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    for ( var i = 0; i < 100; i ++ ) {
        vertices.push( THREE.Math.randFloatSpread( 100 ) ); // x
        vertices.push( THREE.Math.randFloatSpread( 100 ) ); // y
        vertices.push( THREE.Math.randFloatSpread( 100 ) ); // z
    }
    */

    for ( var x = 0; x < 400; x++ ) {
        create_star_p(x + sprites.length)
    }

    //geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3) );

    // var sprite = new THREE.TextureLoader().load("star.png");

    //material = new THREE.PointsMaterial( { size: 1000, sizeAttenuation: false, map: sprite, alphaTest: 0.99, transparent: true } );

    //var particles = new THREE.Points( geometry, material );

    //scene.add( particles );

    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    scene.add(light)


    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    for(var i =0; config.length !== i; i++) {
        create_star(config[i], i);
    }


    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 1000;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'click', onDocumentClick, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    window.addEventListener( 'resize', onWindowResize, false );
    // window.addEventListener( 'mousemove', onMouseMove, false );
    //   window.requestAnimationFrame(render);
}

function onDocumentClick() {
    if(INTERSECTED) {
        var position = INTERSECTED.position;
        var from = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

        var to = {
            x: position.x,
            y: position.y,
            z: position.z - 3
        };
        var tween = new TWEEN.Tween(from)
            .to(to, 600)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                camera.position.set(this.x, this.y, this.z);
                lookATmeNow(position);
            })
            .onComplete(function () {
                controls.target = position;
                camera.lookAt(position)
            })
            .start();
    }
}
var animate = function () {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    render();
};

/*** Render ***/
var INTERSECTED;



function lookATmeNow(position) {
    var startRotation = new THREE.Euler().copy( camera.rotation );
    camera.lookAt(position);
    var endRotation = new THREE.Euler().copy( camera.rotation );
    camera.rotation.copy( startRotation );
    new TWEEN.Tween( camera ).to( { rotation: endRotation }, 100 ).start();
}


function render() {
    var time = Date.now() * 0.00005;
    TWEEN.update();

    var delta = clock.getDelta();
    controls.movementSpeed = 10 ;
    controls.update( delta );

    //camera.position.x = 0;
    //camera.position.y = 5 ;
    //camera.lookAt( scene.position );
    //console.log(camera.position);
    //  console.log("scene position", scene.position);
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children );
    //  for ( var i = 0; i < intersects.length; i++ ) {
    //intersects[i].object.material.color.set( 0xff0000 );
    //     console.log("trouvé ==>", intersects[i].object)
    // }

    if ( intersects.length > 0 ) {
        //   var targetDistance = intersects[ 0 ].distance;
        //      camera.focusAt( targetDistance ); // using Cinematic camera focusAt method
        if (intersects[ 0 ].object && intersects[ 0 ].object.name) {
            INTERSECTED = intersects[ 0 ].object;
            console.log("touch: ", INTERSECTED.name);
            //   zoom_camera(INTERSECTED);
        }
    } else {
        if ( INTERSECTED ) {
            // default_camera();
        }
        INTERSECTED = null;
    }

    renderer.render( scene, camera );
}

stars_config();
init();
animate();
splashScreen();

function splashScreen() {
	var from = {
			x: camera.position.x,
			y: camera.position.y,
			z: camera.position.z
	};
	var to = {
			x: camera.position.x,
			y: camera.position.y,
			z: 25
	};
	var tween = new TWEEN.Tween(from)
			.to(to, 3000)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
					camera.position.set(this.x, this.y, this.z);
					// lookATmeNow(camera.position);
			})
			.onComplete(function () {
					// controls.target = position;
					// camera.lookAt(position)
			})
			.start();
			window.addEventListener( 'mousemove', onMouseMove, false );
}

/*** listener ***/
function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentTouchStart( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
}
function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
}
