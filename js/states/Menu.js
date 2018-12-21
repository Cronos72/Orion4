menu = {
	init: function () {
		
	},
	preload: function () {

		//Loop that generates the splash screen menu list items (Play, highscore,etc...)
		for (var i = 0; i < menuButtons.length; i++) {
			game.load.spritesheet(menuButtons[i].identifier, menuButtons[i].imagePath, menuButtons[i].width, menuButtons[i].height);
			//console.log(menuButtons[i]);
		}
		//Assets to be loaded before create() is called
		game.load.image("bg", "assets/images/menu-background/bg.png");
		game.load.image("ocean-water", "assets/images/menu-background/ocean-water.png");
		game.load.image("sun", "assets/images/menu-background/sun.png");
		game.load.image("floating-island-left", "assets/images/menu-background/floating-island-left.png");
		game.load.image("floating-island-right", "assets/images/menu-background/floating-island-right.png");
		//clouds go here
		game.load.image("island-green", "assets/images/menu-background/floating-island-green.png");
		game.load.image("island-main", "assets/images/menu-background/floating-island-main.png");

		game.load.image("cloud-1", "assets/images/menu-background/c11.png");
		game.load.image("cloud-2", "assets/images/menu-background/c12.png");
		game.load.image("cloud-3", "assets/images/menu-background/c13.png");
		//Audio
		game.load.audio('menuMusic', 'assets/audio/protoss_lobby.mp3');
		game.load.audio('menuClick', 'assets/audio/click.wav');
		game.load.image("ui", "assets/images/ui_800x500.png");
		game.load.spritesheet('play', 'assets/images/menu-buttons/btn_play_combined.png', 380, 54);
	},

	create: function () {

		//Hack to the loading of fonts for subsequent use
		forceLoad = game.add.text(-30, -10, "fd");
		forceLoad.font = 'Upheaval';
		forceLoad.stroke = '#000000'; //aquamarine
		forceLoad.fill = '#40E0D0'; //turquise

		

		game.stage.backgroundColor = '#6d94b5';

		menuStateBackground = game.add.sprite(0, 0, 'bg');
		//x,y , key,callback,context, 
		
		game.add.sprite(10,346,'ocean-water');
		game.add.sprite(175,200, 'sun');

		fgCloudGroup4 = game.add.group();
		fgCloudGroup4.enableBody = true;
		fgCloudGroup4.physicsBodyType = Phaser.Physics.ARCADE;
		fgCloudGroup4.addToStage = true;

		for (i = 0; i <10; i++)
		{
			var cloud = fgCloudGroup4.create(game.rnd.realInRange(0,800),Math.floor(Math.random() * 30) + 200  , "cloud-"+ (Math.floor(Math.random() * 3) + 1  )) ;
			cloud.body.velocity.x = Math.floor(Math.random() * 10) -10;
			cloud.anchor.setTo(0.3);
			cloud.checkWorldBounds = true;
			cloud.events.onOutOfBounds.add(resetCloud, this);
			cloud.scale.setTo(0.7);
			//cloud.body.velocity.x = -10;
		}


		island1 = game.add.sprite(100, 40, 'floating-island-left');
		island2 = game.add.sprite(500,0, 'floating-island-right');
		//some clouds go here
		fgCloudGroup3 = game.add.group();
		fgCloudGroup3.enableBody = true;
		fgCloudGroup3.physicsBodyType = Phaser.Physics.ARCADE;
		fgCloudGroup3.addToStage = true;

		game.add.sprite(0,234,'island-green');
		
		//var c1 = game.add.sprite(50,320,'cloud-1');
		for (i = 0; i <3; i++)
		{
			var cloud = fgCloudGroup3.create(game.rnd.realInRange(0,800),Math.floor(Math.random() * 0) + 450  , "cloud-"+ (Math.floor(Math.random() * 3) + 1  )) ;
			cloud.body.velocity.x = Math.floor(Math.random() * 10) -10;
			cloud.anchor.setTo(0.5);
			cloud.checkWorldBounds = true;
			cloud.events.onOutOfBounds.add(resetCloud, this);
			cloud.scale.setTo(0.7);
			//cloud.body.velocity.x = -10;
		}

		game.add.sprite(389,234,'island-main');

		//create(x, y, key, frame, exists, index)
		fgCloudGroup1 = game.add.group();
		fgCloudGroup1.enableBody = true;
		fgCloudGroup1.physicsBodyType = Phaser.Physics.ARCADE;
		fgCloudGroup1.addToStage = true;
		for (i = 0; i <3; i++)
		{
			var cloud = fgCloudGroup1.create(game.rnd.realInRange(0,800),Math.floor(Math.random() * 0) + 400  , "cloud-"+ (Math.floor(Math.random() * 3) + 1  )) ;
			cloud.body.velocity.x = Math.floor(Math.random() * 20) -20;
			cloud.anchor.setTo(0.5);
			cloud.checkWorldBounds = true;
			cloud.events.onOutOfBounds.add(resetCloud, this);
			cloud.scale.setTo(game.rnd.realInRange(0,1));
			//cloud.body.velocity.x = -10;
		}
		fgCloudGroup2 = game.add.group();
		fgCloudGroup2.enableBody = true;
		fgCloudGroup2.physicsBodyType = Phaser.Physics.ARCADE;
		fgCloudGroup2.addToStage = true;
		for (i = 0; i < 3; i++)
		{
			var cloud = fgCloudGroup2.create(game.rnd.realInRange(0,800),Math.floor(Math.random() * 0) + 450  , "cloud-"+ (Math.floor(Math.random() * 3) + 1  )) ;
			cloud.body.velocity.x = (Math.floor(Math.random() * 20) -20)* -1;
			cloud.anchor.setTo(0.5);
			cloud.checkWorldBounds = true;
			cloud.events.onOutOfBounds.add(resetCloud2, this);
			//cloud.body.velocity.x = -10;
		}
		//fgCloudGroup.create(200,330, "cloud-"+ (Math.floor(Math.random() * 3) + 1  )) ;
	//	fgCloudGroup.create(200,330, "cloud-");
		//fgCloudGroup.create(200,330, "cloud-");
		

		menuStateBackground.width = game.width;
		menuStateBackground.height = game.height;
		//game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		//EXAMPLE: playButton = game.add.button(game.width - 200, 80, 'playButton', playButtonClicked, this, 1, 0, 1, 0);
		//selectArrow = game.add.button(game.width - 264, 80, 'selectArrow', actionOnClick, this, 0, 0, 0, 0);

		// Adding Audio
		clickSound = game.add.audio('menuClick', 0.9, false);
		menuStateMusic = game.add.audio('menuMusic', 0.9, true);
		menuStateMusic.loop = true;
		

		//Toogle by setting SOUND_ON to false at the top of this file
		if (SOUND_ON) {
			menuStateMusic.play();
		}

		musicPlaying = true;
		
		var MENU_SCALE_FACTOR = 0.5;
		var SPACING = 50;

		for (var i = 0; i < menuButtons.length; i++) {

			//i*90 <- for each menu button move down 90px Also game world /2 centers the buttons
			var button = game.add.button((game.world.width / 2) - (menuButtons[i].width / 2), 100+ ( i *SPACING) , menuButtons[i].identifier,
				menuButtons[i].clickEvent, this, 1, 0, 1, 1);
				button.onInputOver.add(function() {clickSound.play();
				}, this);
				button.scale.setTo(MENU_SCALE_FACTOR);
				button.x = (game.world.width / 2) - ((menuButtons[i].width / 2))*MENU_SCALE_FACTOR;//0.7 is the scale factor
		}
     
		game.add.sprite(0,0, 'ui');

	},

	update: function () {
		//Game logic, collision, movement, etc...
		island1.y = Math.pow(Math.sin(game.time.time/2000 ),2)*10;
		island2.y = Math.pow(Math.sin((game.time.time)/3000),2)*10;
		//island2.y = Math.sin(game.time.time/2000)*10;
	}
};