play = {
	
	init: function () {
		console.log("play initialise");

	},
	preload: function () 
	{
		
		console.log("play preload");
		game.load.audio('suction', 'assets/audio/sfx/suction.wav');
		game.load.audio('spark', 'assets/audio/sfx/espark1.wav');
		game.load.audio('espark', 'assets/audio/sfx/collapse.wav');

		game.load.audio('shot', 'assets/audio/sfx/shot.wav');
		//game.load.audio('shot', 'assets/audio/sfx/suction.wav');
		game.load.audio('play-state-music', 'assets/audio/giblitech.mp3');

		//game.load.image("bg-battle", "assets/images/bg_800x576.png");
		game.load.image("fg", "assets/images/background-fg.png");

		game.load.image("bg", "assets/images/sky.png");
		game.load.image("c1", "assets/images/cloud1.png");
		game.load.image("c2", "assets/images/cloud2.png");
		game.load.image("c3", "assets/images/cloud3.png");
		game.load.image("c4", "assets/images/cloud4.png");
		game.load.image("c5", "assets/images/cloud5.png");
		game.load.image("island", "assets/images/background-island.png");

		game.load.image("ui", "assets/images/ui_800x500.png");
		//load.spritesheet params are: x, y, total ammount of sprites on sheet
		game.load.spritesheet("stalker", "assets/images/animation/stalker/stalkerl.png", 64, 64, 8);
		game.load.spritesheet("stalker-death", "assets/images/animation/stalker/stalker_death.png", 145, 145, 7);

		game.load.image("cannon-base", "assets/images/cannon-base.png");
		game.load.image("bullet", "assets/images/orb.png");
		game.load.image("usc", "assets/images/unit_selection_circle.png");

		game.load.image("toggleSoundInactive", "assets/images/sound-inactive.png");
	
		game.load.spritesheet('toggleSound','assets/images/sound_icon.png',64,64,2);
	},
	create: function () 
	{
	
		
		bindHotKeys(); // binds 1,2,3 and a
	
		playStateMusic = game.add.audio('play-state-music', 0.9, true); 
		playStateMusic.loop = true;
		
		
		sparkSound = game.add.audio('espark', 0.9, false);
		sparkSound.allowMultiple = true;
        playStateMusic.play();
		

	   
		game.add.sprite(0, 0, 'bg');
		cloud1 = game.add.sprite(0, 0, 'c1');
		cloud2 = game.add.sprite(0, 0, 'c2');
		cloud3 = game.add.sprite(0, 0, 'c3');
		var island = game.add.sprite(0, 0, 'island');


		cloud4 = game.add.sprite(0, 0, 'c4');

		cloud5 = game.add.sprite(0, 0, 'c3');
		cloud5.kill();
		game.physics.arcade.enable([cloud1, cloud2, cloud3, cloud4]);
		cloud1.body.velocity.x = 12;
		cloud2.body.velocity.x = -50;
		cloud3.body.velocity.x = -10;
		cloud4.body.velocity.x = 12;

		game.add.sprite(0, 0, 'fg');

		cannonContainer = new Array(3);
		for (i = 0; i < cannonContainer.length; i++) 
		{
			cannonContainer[i] = new Cannon(i);
		}
        enemyLayer = game.add.group();       
		lvl = new Level();
		lvl.start();
       
		cloud6 = game.add.sprite(0, -150, 'c3');
		cloud5 = game.add.sprite(800, 0, 'c5');
		game.physics.arcade.enable([cloud5, cloud6]);
		cloud5.body.velocity.x = -100;
		cloud6.body.velocity.x = -20;
		// UI ELEMENTS
		//TODO:Make class for rendering text
	
		uiLayer = game.add.group();
		uiLayer.create(0, 0, 'ui');
		
		
		//scoreboard
		text = game.add.text(665, 400, "Score");
		text.anchor.setTo(0.5);
		//text.font = 'Zelda';
		/*Actual loading
It’s important to remember that declaring a font family via CSS does not load the font! 
The font is loaded only when the browser detects for the first time that it’s going to be used.
This can cause a visual glitch: either the text is rendered with a default font and then changes 
to the Web Font (this is known as FOUT or Flash Of Unstyled Text); or the text isn’t rendered at 
all and remains invisible until the font becomes available. In websites this is usually not a big deal, 
but in games (Canvas/WebGL) we don’t get the automatic browser re-rendering when the font is available! 
So if we try to render the text and the font is not available, it is a big deal.
https://hacks.mozilla.org/2016/06/webfont-preloading-for-html5-games/
https://hacks.mozilla.org/2016/06/webfont-preloading-for-html5-games/

*/
     
		text.font = 'Upheaval';
		text.fontSize = 34;
		text.stroke = '#000000'; //aquamarine
		text.fill = '#40E0D0'; //turquise
		text.alpha = 0.6;
		//text.fill = '#c83f5f'; //red
		text.strokeThickness = 2;
		text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
		// set score tracker to 0
		scoreText = game.add.text(665, 435, "0");
		scoreText.anchor.setTo(0.5);
		scoreText.font = 'Upheaval';
		scoreText.fontSize = 24;
		//score.stroke = '#FFFFFF'; //aquamarine
		//scoreText.fill = '#c83f5f'; //red
		scoreText.fill = '#40E0D0'; 
		scoreText.alpha = 0.6;
		scoreText.strokeThickness = 2;
		scoreText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        //new Button (game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame)
		soundButton = game.add.button(760,15, 'toggleSound', function(){console.log("Sound clicked")}, this, 0, 0, 1,0);
		soundButton.scale.setTo(0.5);
		soundButton.animations.add('soundOn',[1,0],1);
		soundButton.animations.add('soundOff',[0,1],1);

		soundButton.onInputOver.add(function(){},this);
			
		soundButton.onInputOut.add(function(){console.log("Sound Out")}, this);
		soundButton.onInputDown.add(function(){
			console.log("Sound Down")
			if(sound)
			{
				sound = SOUND_OFF;
				playStateMusic.stop();
			}
			else
			{
				sound = SOUND_ON;
				playStateMusic.play();
			}
		
		}, this);


	},
	update: function () 
	{	
		game.canvas.style.cursor = cursorState;
	
		for (i = 0; i < cannonContainer.length; i++ )
		{

			if (cannonContainer[i].bullet.target != null && cannonContainer[i].bullet.target.sprite.alive )
		    {
				cannonContainer[i].bullet.shrink()
				cannonContainer[i].bullet.move();
				cannonContainer[i].bullet.checkForCollision();
			}
		}
		if( isAPressed &&  game.input.activePointer.isDown && cannonContainer[activeCannon].bullet.hasNoTarget())
		{	
			for (i = 0; i <= lvl.enemies.length; i++) //iterate through
			{
				if(lvl.enemies[i] != undefined )//defiend enemies
				{
					
					if (  lvl.enemies[i].isTargetable() && cannonContainer[activeCannon].ableToFire() && cannonContainer[activeCannon].targetInRange(lvl.enemies[i]) && isSpriteClicked(new Mouse() , lvl.enemies[i] ) ) 
					{
						cannonContainer[activeCannon].bullet.setTarget(lvl.enemies[i]);
						cannonContainer[activeCannon].setFiredTimeStamp();
						lvl.enemies[i].setTargetable(false);
						isAPressed = false;
						cursorState ="default";
						
	
					}
				}
				
			}
		}

	},
	render: function()
	{
		// DEBUG
		game.debug.body(cannonContainer[activeCannon].bullet.sprite);
		//game.add.sprite(0, 0, 'ui');
		//game.debug.spriteInputInfo(stalker.sprite, 32, 32);
		//game.debug.body(stalker.sprite);
		
	}
	
};
