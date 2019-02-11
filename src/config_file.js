let project;

project = {
	"config" : {
		// Range display for random position
		range_x : 30,
		range_y : 20,
		range_z : 20,

		//Camera speed to go to project
		popup_speed : 2000,

		//Movement of project
		rotation_tableau : false,

		//After Splash Screen
		go_to_random_tableau : false,

		//Set project prosition
		random_position : false,

		//Camera Rotation
		camera_rotate : false,
		camera_rotate_speed : "0.5",

		//Epaisseur tableu
		epaisseur_tableau : "1",
		//Couleur epaisseur tableau
		color_epaisseur : "0xFFFFFF",

		homePage_first_line : "John Doe Website",
		homePage_second_text_line : "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet",
		homePage_second_line : "View portfolio",

		homePage_first_line_color : "#800080",
		homePage_second_text_color : "#800080",
		homePage_second_line_color : "#800080",
		homePage_second_line_color_hover : "0x009999",

		homePage_first_line_start_x : -40,
		homePage_second_text_start_x : -95,
		homePage_second_line_start_x : -20
	},

	//Background Image
	"background_image" : "images/blanc.jpg",

	//Star Image
	"star" : "images/star.png",

	//Contenu
	"project" : [
		{
			"name" : "Project 1",
			"description" : "2011",
			"src" : "images/PIX/MLP_RME_154_2004_NY.png",
			"x" : "-2.00",
			"y" : "-10.00",
			"z" : "-10.00"
		},
		{
			"name" : "Project 2",
			"description" : "2009",
			"src" : "images/PIX/MLP_RME_159_2004_NY_MEGW.MIX.png",
			"x" : "18",
			"y" : "12",
			"z" : "-3"
		},
		{
			"name" : "Project 3",
			"description" : "2018",
			"src" : "images/PIX/MLP_RME_178_2006_EVERYBODY.WANTS.A.HOME!_XAVIER.DE.MAISONNEUVE.png",
			"x" : "-1",
			"y" : "10",
			"z" : "-10"
		},
		{
			"name" : "Project 4",
			"description" : "2002",
			"src" : "images/PIX/MLP_RME_179.png",
			"x" : "-18",
			"y" : "0",
			"z" : "10"
		},
		{
			"name" : "Project 5",
			"description" : "2004",
			"src" : "images/PIX/MLP_RME_194.png",
			"x" : "20",
			"y" : "-10",
			"z" : "10"
		},
		{
			"name" : "Project 6",
			"description" : "2002",
			"src" : "images/PIX/MLP_RME_230_THE.DWARVES_MICHAEL.LAVIGNE.png",
			"x" : "10",
			"y" : "0",
			"z" : "-15"
		},
		{
			"name" : "Project 7",
			"description" : "2002",
			"src" : "images/PIX/MLP_RME_239.png",
			"x" : "10",
			"y" : "7",
			"z" : "7"
		},
		{
			"name" : "Project 8",
			"description" : "2002",
			"src" : "images/PIX/MLP_RME_256_TOKYO_2000.png",
			"x" : "-10",
			"y" : "0",
			"z" : "-10"
		},
		{
			"name" : "Project 9",
			"description" : "2002",
			"src" : "images/PIX/MLP_RME_320_THEDWARVES_NY_2004.png",
			"x" : "0",
			"y" : "0",
			"z" : "0"
		},
		{
			"name" : "Project 10",
			"description" : "2002",
			"src" : "images/GIF/BLUE.gif",
			"x" : "10",
			"y" : "-10",
			"z" : "0"
		},
		{
			"name" : "first video",
			"description" : "test",
			//Video doit etre en .ogv
			"src" : "videos/MOV/That_s-the-rules-iphone.ogv",

			//Miniature de la vidéo
			"miniature" : "images/14.jpg",
			"video" : true,
			"x_size" : 871,
			"y_size" : 480,
			"x" : "-10",
			"y" : "8",
			"z" : "15"
		},
		{
			"name" : "second video",
			"description" : "test",
			//Video doit etre en .ogv
			"src" : "videos/MOV/Sequence-01_1.ogv",

			//Miniature de la vidéo
			"miniature" : "images/14.jpg",
			"video" : true,
			"x_size" : 720,
			"y_size" : 576,
			"x" : "10",
			"y" : "0",
			"z" : "16"
		}
	]
};

module.exports = project;
