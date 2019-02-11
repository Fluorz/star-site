const THREE = require('three');
const TWEEN = require('tween');
const dat = require('dat.gui');
const config_project = require('./config_file');
require('three-fly-controls')(THREE);
var TrackballControls = require('three-trackballcontrols');

/*******LOADER SCENE*******/
var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
};

var homePage = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000),
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
		config.push(
			{
				id: i++,
				file: project.src,
				text: project.name,
				description: project.description,
				isVideo : project.video,
				miniature : project.miniature,
				x : project.x,
				y : project.y,
				z : project.z,
				video: undefined,
				x_size : project.x_size,
				y_size : project.y_size
			}
		);
	}
}

/****** MAIN ******/
if ( WEBGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var camera, scene, renderer, stats, material, controls, homePage;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var clock = new THREE.Clock();
var sprites = [];
var sprites_stars = [];
var spacesphere;
var range_x = config_project.config.range_x;
var range_y = config_project.config.range_y;
var range_z = config_project.config.range_z;

/**********LOAD PROJECT********/
function create_star(star, index) {
	var loader = new THREE.TextureLoader();

	loader.load(
		star.file,
		function (spriteMap) {

			//var spriteMap = await new THREE.TextureLoader(loadingManager).load(star.file);
			var materialArray = [];
			materialArray.push(new THREE.MeshBasicMaterial( {color: parseInt(config_project.config.color_epaisseur)}));
			materialArray.push(new THREE.MeshBasicMaterial( {color: parseInt(config_project.config.color_epaisseur)}));
			materialArray.push(new THREE.MeshBasicMaterial( {color: parseInt(config_project.config.color_epaisseur)}));
			materialArray.push(new THREE.MeshBasicMaterial( {color: parseInt(config_project.config.color_epaisseur)}));
			materialArray.push(new THREE.MeshBasicMaterial( { map: spriteMap }));
			materialArray.push(new THREE.MeshBasicMaterial( { map: spriteMap }));
			var DiceBlueMaterial = new THREE.MeshFaceMaterial(materialArray);

			//Set size du tableau
			var DiceBlueGeom = new THREE.BoxGeometry(
				spriteMap.image.width / spriteMap.image.height * 5 ,
				spriteMap.image.height /spriteMap.image.height * 5 ,
				parseFloat(config_project.config.epaisseur_tableau),
				1, 1, 1 );
			sprites[index] = new THREE.Mesh( DiceBlueGeom, DiceBlueMaterial );
			sprites[index].name = star.id.toString();

			/*SET Position project*/
			if (config_project.config.random_position) {
				sprites[index].position.x = (range_x * 2) * Math.random() - range_x;
				sprites[index].position.y = (range_y * 2) * Math.random() - range_y;
				sprites[index].position.z = (range_z * 2) * Math.random() - range_z - 20;
			}
			else {
				sprites[index].position.x = parseFloat(star.x);
				sprites[index].position.y = parseFloat(star.y);
				sprites[index].position.z = parseFloat(star.z);
			}
			scene.add(sprites[index]);
		}
	)
}


var videos = [];

/***********LOAD VIDEO***********/
var movieScreen = [];

document.__proto__.customCreateElement = function(tag, attributes){
	var e = document.createElement(tag);

	for(var a in attributes) e.setAttribute(a, attributes[a]);

	return e;
};


async function create_video(star, index) {
	config[index].video  = 	{
		video: undefined,
		videoImage: undefined,
		videoImageContext: undefined,
		videoTexture: undefined,
		newVideoTexture: undefined,
		newVideoCover: undefined,
		movieMaterial: undefined,
		index: undefined,
		movieGeometry: undefined,
		movieScreen: []
	};

	let video;

	video = document.customCreateElement('video', {id: index, opacity : 0.3});

	video.src = star.file;
	video.load(loadingManager);
	console.log(video.src);
	//Set plan Geometry of size of video
	config[index].video.index = index;
	config[index].video.videoImage = document.customCreateElement('canvas', {id: index , opacity : 0.3});

	config[index].video.videoImage.width = star.x_size;
	config[index].video.videoImage.height = star.y_size;
	config[index].video.videoImageContext = config[index].video.videoImage.getContext( '2d' );

	// background color if no video present

	config[index].video.videoImageContext.fillStyle = '#FFFFFF';
	config[index].video.videoImageContext.fillRect( 0, 0, config[index].video.videoImage.width, config[index].video.videoImage.height );
	config[index].video.videoTexture = new THREE.Texture( config[index].video.videoImage );
	config[index].video.videoTexture.minFilter = THREE.LinearFilter;
	config[index].video.videoTexture.magFilter = THREE.LinearFilter;
	config[index].video.newVideoTexture = new THREE.Texture();
	config[index].video.newVideoCover = new THREE.TextureLoader(loadingManager).load(star.miniature);
	config[index].video.movieMaterial = new THREE.MeshBasicMaterial( { map: config[index].video.newVideoCover} );
	config[index].material = new THREE.MeshBasicMaterial( { map: config[index].video.videoTexture ,side:THREE.DoubleSide } );
	config[index].video.movieGeometry = new THREE.PlaneGeometry( star.x_size / 100, star.y_size / 100, 4, 4 );
	config[index].video.movieScreen[index] = new THREE.Mesh( config[index].video.movieGeometry, config[index].video.movieMaterial);

	let x, y, z;
	if (config_project.config.random_position) {
		x = 20 * Math.random() - 10;
		y = 20 * Math.random() - 10;
		z = 20 * Math.random() - 10;
	}
	else {
		x = parseFloat(star.x);
		y = parseFloat(star.y);
		z = parseFloat(star.z);
	}

	config[index].video.movieScreen[index].position.set(x, y, z);
	config[index].video.movieScreen[index].name = "v" + index;

	var container = document.querySelector( 'div.container' );

	config[index].video.video = video;
	//container.appendChild(config[index].video.video);
	//video.
	//document.appendChild(config[index].video.video);
	scene.add(config[index].video.movieScreen[index]);
}

/**********LOAD STAR****************/
async function create_star_p(index) {
	var spriteMap = new THREE.TextureLoader(loadingManager);
	spriteMap = spriteMap.load(config_project.star);
	var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
	sprites_stars[index] = new THREE.Sprite(spriteMaterial);
	sprites_stars[index].position.x = 100 * Math.random() - 50;
	sprites_stars[index].position.y = 100 * Math.random() - 50;
	sprites_stars[index].position.z = 150 * Math.random() - 50;
	scene.add(sprites_stars[index]);
}

async function loadProject() {
	for(var i =0; config.length !== i; i++) {
		if (config[i].isVideo !== true) {
			create_star(config[i], i);
		}
		else {
			create_video(config[i], i);
		}
	}

	for ( var x = 0; x < 350; x++ ) {
		create_star_p(x + sprites.length)
	}

	return ;
}

function myWaiter() {
	CAN_DISPLAY_SCENE = true;
	SPLASH_SCREEN = true;
}

function ctrl_trackball() {
	controls = new TrackballControls( camera );
	if (config_project.config.camera_rotate) {
		controls.rotateSpeed = parseFloat(config_project.config.camera_rotate_speed);
	}
	else {
		controls.rotateSpeed = 0;
	}
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.minDistance = -10;
	controls.maxDistance = 50;
}

function ctrl_fly(){
	controls = new THREE.FlyControls( camera );
	controls.movementSpeed = 0.1;
	controls.domElement = renderer.domElement;
	controls.rollSpeed = 0;
	controls.autoForward = false;
	controls.dragToLook = false;
}

async function init() {
	myWaiter();

	scene = new THREE.Scene();
	// scene.background = new THREE.Color( 0xff0000 );
	container = document.querySelector( 'div.container' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000);
	camera.position.z = 100;

	//Load manager
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

	var loader = new THREE.FontLoader();
	homePage.scene.add(homePage.camera);
	homePage.camera.position.x = 0;
	homePage.camera.position.y = 0;
	homePage.camera.position.z = 100;

	var _header = document.getElementById('header');
	_header.classList.add('hide')

	var _footer = document.getElementById('footer');
	_footer.classList.add('hide')

	loader.load( 'fonts/gentilis_regular.typeface.json', function ( font ) {

		var geometry = new THREE.TextGeometry( config_project.config.homePage_first_line, {
			font: font,
			size: 8,
			height: 1,
			curveSegments: 1,
			bevelEnabled: true,
			bevelThickness: 0,
			bevelSize: 0,
			bevelSegments: 0
		} );

		var geometry_second = new THREE.TextGeometry( config_project.config.homePage_second_line, {
			font: font,
			size: 5,
			height: 1,
			curveSegments: 1,
			bevelEnabled: true,
			bevelThickness: 0,
			bevelSize: 0,
			bevelSegments: 0
		} );

		//First Line
		var geometryMat =  new THREE.MeshBasicMaterial({color: config_project.config.homePage_first_line_color});
		var textHome = new THREE.Mesh(geometry, geometryMat);
		textHome.position.set(-40, 10, 30)
		textHome.name = "first_line";
		homePage.scene.add(textHome);

		//Second
		var geometryMat_second =  new THREE.MeshBasicMaterial({color: config_project.config.homePage_second_line_color});
		var textHome_second = new THREE.Mesh(geometry_second, geometryMat_second);
		textHome_second.position.set(-20, -10, 30)
		textHome_second.name = "second_line";
		homePage.scene.add(textHome_second);
	} );

	PORTFOLIO = false;

	// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	// var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	// var cube = new THREE.Mesh( geometry, material );
  //
	// homePage.scene.add(cube);


	renderer = new THREE.WebGLRenderer({ alpha : true });
	renderer.setClearColor( 0xffffff, 0);
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

	//Set event listener
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'click', onDocumentClick, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

var animate = function () {
	//Render le loading screen tant que les ressources n'ont pas load
	if( RESOURCES_LOADED == false || CAN_DISPLAY_SCENE == false){
		requestAnimationFrame(animate);
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}
	else if (PORTFOLIO) {
		if (SPLASH_SCREEN) {
			SPLASH_SCREEN = false;
			splashScreen();
		}
		for(var i = 0; config.length !== i; i++)
		{
			if(config[i].video)
				if ( config[i].video.video.readyState === config[i].video.video.HAVE_ENOUGH_DATA )
				{
					config[i].video.videoImageContext.drawImage( config[i].video.video, 0, 0 );
					if ( config[i].video.videoTexture )
						config[i].video.videoTexture.needsUpdate = true;
				}
		}
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		render();
	}
	else {
		requestAnimationFrame(animate);
		renderer.render(homePage.scene, homePage.camera);
		render_homePage();
	}
};

/*** Render ***/

var last_video = undefined;
var INTERSECTED;
var video_playing = false;

function render_homePage() {
		raycaster.setFromCamera(mouse, homePage.camera);
		var childrens = homePage.scene.children;
		let intersects = raycaster.intersectObjects(childrens);

		if ( intersects.length > 0  && intersects[0].object.name == "second_line")
		{
			if ( intersects[ 0 ].object != INTERSECTED ) {
				if ( INTERSECTED )
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
				INTERSECTED.material.color.setHex(parseInt(config_project.config.homePage_second_line_color_hover));
			}
		}
		else
		{
			if ( INTERSECTED )
			INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			INTERSECTED = null;
		}
		renderer.render(homePage.scene, homePage.camera);
}

function render() {
	TWEEN.update();
	let delta = clock.getDelta();
	spacesphere.rotation.y += 0.0001;

	if(!animation) {
		controls.update( delta );
		raycaster.setFromCamera(mouse, camera);
		var childrens = scene.children;
		let intersects = raycaster.intersectObjects(childrens);

		// Rotation tableau
		if (config_project.config.rotation_tableau) {
			childrens.forEach(object => {
				if(object.name)
				{
					if(object !== last_star)
						object.rotation.y += 0.02;
					else
						object.rotation.y = 0;
				}
			});
		}

		camera.rotation.y = 0;
		camera.rotation.z = 0;

		if ( intersects.length !== 0 ) {
			if (intersects[ 0 ].object && intersects[ 0 ].object.name) {
				INTERSECTED = intersects[ 0 ].object;
				if (video_playing) {
					if(INTERSECTED.name.charAt(0) === 'v') {
						let index_video = parseInt(INTERSECTED.name.slice(1, INTERSECTED.name.length));
						if(index_video !== last_video) {
							config[last_video].video.video.pause();
							last_video = undefined;
							video_playing = false
						}
					}
					//console.log(INTERSECTED.name, " last_video", last_video);
					if(INTERSECTED.name.charAt(0) !== 'v' && last_video !== undefined) {
						config[last_video].video.video.pause();
						last_video = undefined;
						video_playing = false;
					}
				}
				if (INTERSECTED.name.charAt(0) === 'v') {

					let index_id_video = parseInt(INTERSECTED.name.slice(1, INTERSECTED.name.length));
					if(index_id_video !== last_video) {
						INTERSECTED.material = config[index_id_video].material;
						INTERSECTED.material.needsUpdate = true;
						video_playing = true;
						//config[index_id_video].video.video = config.querySelector("video#"+ index_id_video);
						config[index_id_video].video.video.play();
						last_video = index_id_video;
						document.querySelector("h1").textContent = config[index_id_video].text;
						document.querySelector("h3").textContent = config[index_id_video].description;
					}
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

/******SPLASH SCREEN***********/
var animation = true;

function splashScreen() {
	var from = {
		x: camera.position.x,
		y: camera.position.y,
		z: camera.position.z + 50
	};
	var to = {
		x: camera.position.x,
		y: camera.position.y,
		z: range_z + 20
	};
	var tween = new TWEEN.Tween(from)
		.to(to, 5000)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate(function () {
			camera.position.set(this.x, this.y, this.z);
		})
		.onComplete(function () {
			//Go to random tableau
			if (config_project.config.go_to_random_tableau) {
				animation = false;
				var index = Math.floor(Math.random() * sprites.length)
				INTERSECTED = sprites[index]
				onDocumentClick();
			}
			else {
				animation = false;
				//onDocumentClick();
			}
		})
		.start();
}

stars_config();
init();
animate();

/*************EVENT*************/
var last_star = null;

function onDocumentClick() {
	if(INTERSECTED) {
		if (INTERSECTED.name == "second_line") {
			var _header = document.getElementById('header');
			_header.classList.remove('hide')

			var _footer = document.getElementById('footer');
			_footer.classList.remove('hide')
			PORTFOLIO = true;
		}
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
			z: position.z + 8
		};

		if(last_star === INTERSECTED) {
			to.x = 0;
			to.y = 0;
			to.z = range_z + 20;
			last_star = null;
			ctrl_trackball();
		} else {
			last_star = INTERSECTED;
			ctrl_fly();
		}

		var tween = new TWEEN.Tween(from)
			.to(to, config_project.config.popup_speed)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				camera.position.set(this.x, this.y, this.z);
				camera.lookAt(position);
			})
			.onComplete(function () {
				animation = false;
				INTERSECTED = null;
			})
			.start();
	}
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
