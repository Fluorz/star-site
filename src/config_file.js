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
		epaisseur_tableau : "0.8",
		//Couleur epaisseur tableau
		color_epaisseur : "0xFFFFFF",

		homePage_first_line : "John Doe Website",
		homePage_second_line : "View portfolio",

		homePage_first_line_color : "#800080",
		homePage_second_line_color : "#800080",
		homePage_second_line_color_hover : "0x009999"
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
			"src" : "images/16.jpg",
			"x" : "-2.00",
			"y" : "-10.00",
			"z" : "-10.00"
		},
		{
			"name" : "Project 2",
			"description" : "2009",
			"src" : "images/15.jpg",
			"x" : "18",
			"y" : "12",
			"z" : "-3"
		},
		{
			"name" : "Project 3",
			"description" : "2018",
			"src" : "images/14.jpg",
			"x" : "-1",
			"y" : "8",
			"z" : "-28"
		},
		{
			"name" : "Project 4",
			"description" : "2002",
			"src" : "images/10.jpg",
			"x" : "-18",
			"y" : "0",
			"z" : "10"
		},
		{
			"name" : "Project 5",
			"description" : "2004",
			"src" : "images/11.jpg",
			"x" : "20",
			"y" : "-10",
			"z" : "-10"
		},
		{
			"name" : "Project 6",
			"description" : "2002",
			"src" : "images/12.jpg",
			"x" : "4",
			"y" : "0",
			"z" : "-15"
		},
		{
			"name" : "first video",
			"description" : "test",
			//Video doit etre en .ogv
			"src" : "videos/sintel.ogv",

			//Miniature de la vidéo
			"miniature" : "images/14.jpg",
			"video" : true,
			"x" : "-10",
			"y" : "8",
			"z" : "15"
		},
		{
			"name" : "second video",
			"description" : "test",
			//Video doit etre en .ogv
			"src" : "videos/sintel.ogv",

			//Miniature de la vidéo
			"miniature" : "images/14.jpg",
			"video" : true,
			"x" : "10",
			"y" : "0",
			"z" : "16"
		},
		{
			"name" : "third video",
			"description" : "test",
			//Video doit etre en .ogv
			"src" : "videos/sintel.ogv",

			//Miniature de la vidéo
			"miniature" : "images/14.jpg",
			"video" : true,
			"x" : "-10",
			"y" : "-5",
			"z" : "16"
		}
	]
};

module.exports = project;
