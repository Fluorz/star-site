const THREE = require('three');
const TWEEN = require('tween');
const dat = require('dat.gui');
const config_project = require('./config_file');
require('three-fly-controls')(THREE);
var TrackballControls = require('three-trackballcontrols');

// An object to hold all the things needed for our loading screen
var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
};

var loadingManager = null;
var RESOURCES_LOADED = false;
var CAN_DISPLAY_SCENE = false;
var SPLASH_SCREEN = false;


/****** CONFIG STARTS ******/
var config = [];

async function stars_config() {
    var i = 0;
    for (project of config_project.project) {
        config.push({id: i++, file: project.src, text: project.name, description: project.description, isVideo : project.video, miniature : project.miniature});
    }
}

/****** MAIN ******/
if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var camera, scene, renderer, stats, material, controls;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var clock = new THREE.Clock();
var sprites = [];
var spacesphere;
var range = config_project.config.range;


async function create_star(star, index) {
		var spriteMap = new THREE.TextureLoader(loadingManager).load(star.file);

		// spriteMap.minFilter = THREE.LinearFilter;
		// spriteMap.magFilter = THREE.LinearFilter;
    var materialArray = [];
    materialArray.push(new THREE.MeshBasicMaterial( {color: 0xFFC2AA}));
    materialArray.push(new THREE.MeshBasicMaterial( {color: 0xFFC2AA}));
    materialArray.push(new THREE.MeshBasicMaterial( {color: 0xFFC2AA}));
    materialArray.push(new THREE.MeshBasicMaterial( {color: 0xFFC2AA}));
    materialArray.push(new THREE.MeshBasicMaterial( { map: spriteMap }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: spriteMap }));
    var DiceBlueMaterial = new THREE.MeshFaceMaterial(materialArray);
    var DiceBlueGeom = new THREE.BoxGeometry(4, 5, 0.3, 1, 1, 1 );
    sprites[index] = new THREE.Mesh( DiceBlueGeom, DiceBlueMaterial );
    sprites[index].name = star.id.toString();
    sprites[index].position.x = (range * 2) * Math.random() - range;
    sprites[index].position.y = (range * 2) * Math.random() - range;
    sprites[index].position.z = (range * 2) * Math.random() - range - 20;
    scene.add(sprites[index]);
}

var movieScreen = [];

async function create_video(star, index) {
	video = document.createElement( 'video' );

	video.src = star.file;
	video.load(loadingManager); // must call after setting/changing source
	// video.play();

	videoImage = document.createElement( 'canvas' );
	videoImage.width = 480;
	videoImage.height = 204;
	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#FFFFFF';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	let newVideoTexture = new THREE.Texture()
	// let newVideoCover =  new THREE.ImageUtils.loadTexture( star.miniature );
	let newVideoCover = new THREE.TextureLoader(loadingManager).load(star.miniature);
	var movieMaterial = new THREE.MeshBasicMaterial( { map: newVideoCover} );
	config[index].material = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	var movieGeometry = new THREE.PlaneGeometry( 4, 1.5, 4, 4 );
	movieScreen[index] = new THREE.Mesh( movieGeometry, movieMaterial );
	let x = 20 * Math.random() - 10;
	let y = 20 * Math.random() - 10;
	let z = 20 * Math.random() - 10;
	movieScreen[index].position.set(x, y, z);
	movieScreen[index].name = "v" + index;
	scene.add(movieScreen[index]);
}

async function create_star_p(index) {
    var spriteMap = new THREE.TextureLoader(loadingManager);
		spriteMap = spriteMap.load(config_project.star);
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    sprites[index] = new THREE.Sprite(spriteMaterial);
    sprites[index].position.x = 100 * Math.random() - 50;
    sprites[index].position.y = 100 * Math.random() - 50;
    sprites[index].position.z = 150 * Math.random() - 50;
    scene.add(sprites[index]);
}

async function loadProject() {
	for ( var x = 0; x < 350; x++ ) {
			create_star_p(x + sprites.length)
	}

	for(var i =0; config.length !== i; i++) {
		if (config[i].isVideo != true) {
			create_star(config[i], i);
		}
		else {
			create_video(config[i], i);
		}
	}
	return ;
}

function myWaiter() {
  setTimeout(function(){
		CAN_DISPLAY_SCENE = true;
		SPLASH_SCREEN = true;
	}, 0);
}

function ctrl_trackball() {
    controls = new TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
}

function ctrl_fly(){
    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 0.1;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 2000;
    controls.autoForward = false;
    controls.dragToLook = false;
}

async function init() {
		myWaiter();
		scene = new THREE.Scene();
    container = document.querySelector( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000);
    camera.position.z = 75;

		loadingManager = new THREE.LoadingManager();
		loadProject();

		loadingManager.onProgress = function(item, progress, result){
			var _loadingScreen = document.getElementById( 'loading-screen' );
			_loadingScreen.classList.add( 'fade-out' );
		};

		loadingManager.onLoad = function(){
			const _loadingGif = document.getElementById( 'loader' );
			_loadingGif.remove();
			RESOURCES_LOADED = true;
		};

    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    scene.add(light)


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    var spacetex = new THREE.TextureLoader(loadingManager).load(config_project.background_image);
    var spacesphereGeo = new THREE.SphereGeometry(100,100,100);
    var spacesphereMat = new THREE.MeshMatcapMaterial();
    spacesphereMat.map = spacetex;

    spacesphere = new THREE.Mesh(spacesphereGeo,spacesphereMat);
    spacesphere.material.side = THREE.DoubleSide;
    spacesphere.material.map.wrapS = THREE.RepeatWrapping;
    spacesphere.material.map.wrapT = THREE.RepeatWrapping;
    spacesphere.material.map.repeat.set( 5, 3);
    scene.add(spacesphere);

    ctrl_trackball();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'click', onDocumentClick, false );
    window.addEventListener( 'resize', onWindowResize, false );
}

var last_star = null;

function onDocumentClick() {
    if(INTERSECTED) {
        animation = true;
        var position = INTERSECTED.position;


       // camera.lookAt(position);
        var from = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

        var to = {
            x: position.x,
            y: position.y,
            z: position.z + 6
        };

        if(last_star === INTERSECTED) {
            console.log("back");
            to.x = 0;
            to.y = 0;
            to.z = range + 3;
            last_star = null;
            ctrl_trackball();
        } else {
            last_star = INTERSECTED;
            ctrl_fly();
        }

        var tween = new TWEEN.Tween(from)
            .to(to, 300)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                camera.position.set(this.x, this.y, this.z);
                camera.lookAt(position);
            })
            .onComplete(function () {
              //  camera.target(position);
               // controls.target.set( 0, 0, 0 );
                console.log("rotation: ", camera.rotation);
                console.log("position: ",camera.position);
                animation = false;
                INTERSECTED = null;
            })
            .start();
    }
}

var animate = function () {
	if( RESOURCES_LOADED == false || CAN_DISPLAY_SCENE == false){
		requestAnimationFrame(animate);
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}
	else {
		if (SPLASH_SCREEN) {

			SPLASH_SCREEN = false;
			splashScreen();
		}
		if ( video.readyState === video.HAVE_ENOUGH_DATA )
		{
			videoImageContext.drawImage( video, 0, 0 );
			if ( videoTexture )
			videoTexture.needsUpdate = true;
		}
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		render();
	}
};

/*** Render ***/
var INTERSECTED;
var video_playing = false;

function render() {
    TWEEN.update();
    let delta = clock.getDelta();
    spacesphere.rotation.y += 0.0001;

    if(!animation) {
        controls.update( delta );
        raycaster.setFromCamera(mouse, camera);
        var childrens = scene.children;
        let intersects = raycaster.intersectObjects(childrens);
        childrens.forEach(object => {
            if(object.name)
            {
                if(object !== last_star)
                    object.rotation.y += 0.02;
                else
                    object.rotation.y = 0;

            }
        });

        camera.rotation.y = 0;
        camera.rotation.z = 0;


        if ( intersects.length !== 0 ) {
            if (intersects[ 0 ].object && intersects[ 0 ].object.name) {
                INTERSECTED = intersects[ 0 ].object;
								if (video_playing && INTERSECTED.name.charAt(0) !== 'v') {
									video.pause();
								}
								if (INTERSECTED.name.charAt(0) === 'v') {
									var index_id_video = parseInt(INTERSECTED.name.slice(1, INTERSECTED.name.length))
									INTERSECTED.material = config[index_id_video].material;
									INTERSECTED.material.needsUpdate = true;
									video_playing = true;
									video.play();
									document.querySelector("h1").textContent = config[index_id_video].text;
									document.querySelector("h3").textContent = config[index_id_video].description;
								}
								else {
									document.querySelector("h1").textContent = config[INTERSECTED.name].text;
									document.querySelector("h3").textContent = config[INTERSECTED.name].description;
								}
            }
        } else {
            INTERSECTED = null;
        }
    }
    renderer.render( scene, camera );
}

stars_config();
init();
animate();

var animation = true;

function splashScreen() {
	var from = {
			x: camera.position.x,
			y: camera.position.y,
			z: camera.position.z
	};
	var to = {
			x: camera.position.x,
			y: camera.position.y,
			z: range + 4
	};
	var tween = new TWEEN.Tween(from)
			.to(to, 5000)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
					camera.position.set(this.x, this.y, this.z);
			})
			.onComplete(function () {
                animation = false;
			})
			.start();
}

function onDocumentMouseMove( event ) {
    mouseY = event.clientY - windowHalfY;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize() {
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
