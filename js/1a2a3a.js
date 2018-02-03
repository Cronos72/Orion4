//TODO: Make variable targetable in stalker class in order to prevent cannons from shooting at th same target
class Mouse
{
	//http://phaser.io/docs/2.4.2/Phaser.Pointer.html
	constructor()
	{
		this.pointer = game.input.mousePointer; 
	}	
}
class Bullet {

	constructor(source) {
		this.offsetY = -60;
		this.offsetX = +25;
		this.sourceCannon = source;
		console.log("SOURCE CANNON:"+ this.sourceCannon);
		this.sprite = game.add.sprite(this.sourceCannon.baseSprite.x + this.offsetX, this.sourceCannon.baseSprite.y + this.offsetY, 'bullet');
		this.homeLocation =  new Phaser.Point(this.sprite.x + (100 * this.sourceCannon.id), this.sprite.y);
		this.sprite.scale.setTo(0.5);
		this.target = null;
		this.sprite.checkWorldBounds = true;
		this.sprite.outOfBoundsKill = true;
		game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
		//this.sparkSound = game.add.audio('espark', 0.9, false);
		//this.sparkSound.allowMultiple = true;
		//this.bulletResetSound = game.add.audio('suction', 0.9, false);

	}
	shrink()
	{
		this.sprite.scale.setTo(0.3,0.3);
	}
    hasNoTarget() 
	{
		console.log(this.target);
		if(this.target)
		{
			
			return false;
		}
		else
		{
			return true;
		}
	}
	//TODO: if (this._target == null or this._target.sprite.alive == false) { 
	//marlon: some variation of this so that a target cant be reset in bullet flight
	setTarget(targetEnemy) 
	{
		
		this.target = targetEnemy;
	}
	checkHit(spriteA, spriteB) {
		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();
		return Phaser.Rectangle.intersects(boundsA, boundsB);
	 //moosaadad
	}
	checkForCollision()
	{
		//https://phaser.io/examples/v2/arcade-physics/offset-bounding-box //@todo DOM LOOK HERE, its sexy  
		game.physics.arcade.overlap(this.sprite, this.target.sprite, this.onImpact, null, this);
	}
	onImpact()
	{
		
		this.sprite.reset(this.homeLocation.x, this.homeLocation.y);
		//this.bulletResetSound.play();
		this.sprite.scale.setTo(0.5);

		this.target.die(); 
		this.target = null;

		//this.sparkSound.play();
		sparkSound.play();
		
	
		IncrementScore(1);
	}

	setSourceCannon(cannon) //@todo move to constructor
	{
		this.sourceCannon = cannon;
	}
	
	move() 
	{ //@todo use body not sprite

		//calculating the unit vector
		var ux = this.target.sprite.x - this.sprite.x ;
		var uy = this.target.sprite.y - this.sprite.y ;
		var vectorMagnintude = Math.sqrt(ux*ux + uy*uy);
		var unitVectorX = (ux / vectorMagnintude)*10 ;
		var unitVectorY = (uy / vectorMagnintude)*10 ;
	
		//this.sprite.body.x += Math.floor(u.x);
		//this.sprite.body.y += Math.floor(u.y);
		this.sprite.x += Math.floor(unitVectorX);
		this.sprite.y += Math.floor(unitVectorY);
		
	}
}
class Cannon {
	constructor(id) {
		this.id = id;
		this.baseSprite = game.add.sprite(280, 450, 'cannon-base');
		this.baseSprite.scale.setTo(0.7);
		this.firing = false;
		this.centerPointX = (this.baseSprite.width / 2) + this.baseSprite.x;
		this.centerPointY = (this.baseSprite.height / 2) + this.baseSprite.y;
		this.bullet = new Bullet(this);

		this.baseSprite.x += 100 * this.id;
		this.bullet.sprite.x += 100 * this.id;
		
		
	}
	isFiring()
	{
			return this.bullet.target != null;
	}
	setCenterPoint() {
		this.centerPointX = (this.baseSprite.width / 2) + this.baseSprite.x;
		this.centerPointY = (this.baseSprite.height / 2) + this.baseSprite.y;
	}
	
	setTarget(target) {
		this.target = target;
	}
	setBottom(bottom) {
		this.bottomSprite = bottom;
	}
}

function IncrementScore(increment) {
	scoreTracker += increment;
	scoreText.text = scoreTracker.toString();

}

class Stalker {
	constructor(lane,index) 
	{
		if(lane  === undefined)
		{
			lane = 100;
		}

		if(index  === undefined)
		{
			index = 0;
		}
		this.id = index;
		this.ENEMY_SPEED = -104; // pixel displacement per iteration of gameloop
		this.ANIMATION_SPEED = 28; //in fps
		this.targetable = true;
		//this.sprite = game.add.sprite(800,lane, 'stalker'); 
		//enemyLayer.add(this.sprite); 
		this.sprite = enemyLayer.create(800,lane, 'stalker');
		//console.log(this.spriteDeath.z);
		game.physics.arcade.enable(this.sprite);
		this.sprite.animations.add('walk', [8, 7, 6, 5, 4, 3, 2, 1], true);
		this.sprite.inputEnabled = true;
		this.spriteDeath = game.add.sprite(200, 200, 'stalker-death');
		this.spriteDeath.scale.setTo(0.4);
		this.spriteDeath.kill();
		this.death = this.spriteDeath.animations.add('death', [1, 2, 3, 4, 5, 6, 7], false);	
	    this.death.onComplete.add(this.destroyDeathAnimation, this);
	}
	setTargetable(targetable)
	{
		this.targetable = targetable;
	}
	isTargetable()
	{
		return this.targetable;
	}
	walk(){
		this.sprite.animations.play('walk', this.ANIMATION_SPEED, true);
		this.sprite.body.velocity.x = this.ENEMY_SPEED; 
	}
	die(){
		this.sprite.kill();
	    this.spriteDeath.reset(this.sprite.x, this.sprite.y)
		
		
		this.spriteDeath.animations.play('death', 14, false, true);	
		
	
	}
	destroyDeathAnimation()
	{
		this.spriteDeath.kill();
		this.spriteDeath.x =-64;
		this.spriteDeath.y =-64;
		
	}


}
class Level
{
	constructor()
	{
		this.levelNumber = 1;
		
		//this.scoreText; maybe seperate sincve displayiong text is part of render
		this.scoreTracker;

		this.spawnTracker = 0;
		this.enemyCount  = 999;
		this.enemySpeed  = -14;
		this.animationSpeed = 28; 
		this.enemies = new Array(this.enemyCount);
		
		
		this.spawnRate = 500;
		
		this.lane = 0; //holds a lane number 0-9
		this.startLane = 3;
		this.endLane = 5;
		this.laneCount   = 3;

		this.oldSpawn; //saves the lane number a unit was previously spawned in
		this.newSpawn;

		this.laneYCord = new Array(10);

		/*Y cordinates for lanes : The screen can be divided into 9 lanes which are 50 pixels in height. Units will spawn in a specified range*/
		this.laneYCord[0] = 50;
		this.laneYCord[1] = 100;
		this.laneYCord[2] = 150; //start spawning range
		this.laneYCord[3] = 200;
		this.laneYCord[4] = 250;
		this.laneYCord[5] = 300;//end spaewning range
		this.laneYCord[6] = 350;
		this.laneYCord[7] = 400;
		this.laneYCord[8] = 450;
		this.laneYCord[9] = 500;


	}
	start()
	{
		//delay, repeatCount, callback, callbackContext, arguments
		game.time.events.repeat(500, this.enemyCount, this.spawnEnemy, this);
	}
	getRandomLaneNumber()
	{
		return Math.floor(Math.random() * (this.endLane - this.startLane + 1) + this.startLane);
	}
	spawnEnemy()
	{
		this.lane = this.getRandomLaneNumber();
		
		this.enemies[this.spawnTracker]= new Stalker(this.laneYCord[this.lane],lvl.spawnTracker);
		this.enemies[this.spawnTracker].walk();
		this.spawnTracker++;
		
	}
	checkSpawnOverlap(newSpawn, oldSpawn) {
		// This function ensures new spawned stalkers are not overlapping
		tmp = newSpawn - oldSpawn;
		if (Math.abs(tmp) > 64) {
			return true;
		}
		else {
			return false;
		}
	}
}
function bindHotKeys() {
	keyOne = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	keyOne.onDown.add(function () { activeCannon = 0 }, this);

	keyTwo = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	keyTwo.onDown.add(function () { activeCannon = 1 }, this);

	keyThree = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
	keyThree.onDown.add(function () { activeCannon = 2 }, this);

	attackModeKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	attackModeKey.onDown.add(function () { isAPressed = true; }, this);
}
var game;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;

const SOUND_ON = true; // Global SoudControl
const SOUND_OFF = false;
var sound = SOUND_ON;
var music;
var clickSound;
var musicPlaying = true;
var sparkSound;
		
var soundButton;
var mouse;

var ui;
var uiLayer;
//Game container
var menu; //Menu state container
var menuStateBackground;
var cloud1, cloud2, cloud3, cloud4;

var playButton;
var selectArrow;
var menuButtons = new Array();

var keyOne;
var keyTwo;
var keyThree;

var attackModeKey;
var isAPressed = false;

var cannonContainer;
var activeCannon = 1;
var enemyLayer;
var ScoreText;
var scoreTracker = 0;

function Button(id, img, toogle, w, h, xcord, ycord, action) {
	this.identifier = id;
	this.imagePath = img;
	this.toggleImagePath = toogle;
	this.width = w;
	this.height = h;
	this.xcord = xcord;
	this.ycord = ycord;
	this.action = action;

	this.clickEvent = function () {
		//console.log(action);
		switch (action) {
			case 'b1':
				clickSound.play();
				toogleMusic();
				break;
			case 'swap-state':
				clickSound.play();
				toogleMusic()
				swapState();
				break;
			default:
				console.log("Damn daniel");
		}
	}
}

var playButton = new Button('play', 'assets/images/play_button.png', 'assets/images/play_button.png', 167, 83, 0, 100, 'swap-state');
var h2p = new Button('h2p', 'assets/images/Untitled.png', 'assets/images/hs.png', 395, 74, 0, 190, 'b1');
var hs = new Button('hs', 'assets/images/hs1.png', '', 352, 87, 0, 190, 'b1');
menuButtons.push(playButton);
menuButtons.push(h2p);
menuButtons.push(hs);

function init() {
	console.log("Initializing...");
	game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, "1a2a3a"); //TODO: set AUTO
	game.state.add('menu', menu);
	game.state.add('play', play);
	game.state.start('menu');

}

/*____________________________States_______________________________*/

//Menu state 

menu = {
	init: function () {
		console.log("menu initialised");
	},
	preload: function () {

		//Loop that generates the splash screen menu list items (Play, highscore,etc...)
		for (var i = 0; i < menuButtons.length; i++) {
			game.load.spritesheet(menuButtons[i].identifier, menuButtons[i].imagePath, menuButtons[i].width, menuButtons[i].height);
			//console.log(menuButtons[i]);
		}
		//Assets to be loaded before create() is called
		game.load.image("bg", "assets/images/bgm.jpg");
		//Audio
		game.load.audio('menuMusic', 'assets/audio/protoss_lobby.mp3');
		game.load.audio('menuClick', 'assets/audio/click.wav');

	},

	create: function () {

		game.stage.backgroundColor = '#6d94b5';
		menuStateBackground = game.add.sprite(0, 0, 'bg');
		menuStateBackground.width = game.width;
		menuStateBackground.height = game.height;
		//game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		//EXAMPLE: playButton = game.add.button(game.width - 200, 80, 'playButton', playButtonClicked, this, 1, 0, 1, 0);
		//selectArrow = game.add.button(game.width - 264, 80, 'selectArrow', actionOnClick, this, 0, 0, 0, 0);

		// Adding Audio
		clickSound = game.add.audio('menuClick', 0.9, false);
		music = game.add.audio('menuMusic', 0.9, true);
		music.loop = true;
		

		//Toogle by setting SOUND_ON to false at the top of this file
		if (SOUND_ON) {
			music.play();
		}

		musicPlaying = true;
		for (var i = 0; i < menuButtons.length; i++) {

			//i*90 <- for each menu button move down 90px Also game world /2 centers the buttons
			game.add.button((game.world.width / 2) - (menuButtons[i].width / 2), i * 90, menuButtons[i].identifier,
				menuButtons[i].clickEvent, this, 1, 0, 1, 0);
		}

	},

	update: function () {
		//Game logic, collision, movement, etc...
	}
};
/*____________________________PLAY STATE___________________________*/
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
		game.load.audio('em', 'assets/audio/giblitech.mp3');

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
	
		music = game.add.audio('em', 0.9, true); //TODO: add Music management object
		music.loop = true;
		
		
		sparkSound = game.add.audio('espark', 0.9, false);
		sparkSound.allowMultiple = true;


		if (SOUND_ON) {
			music.play();
		}

	   
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

		soundButton = game.add.button(760,15, 'toggleSound', function(){console.log("Sound clicked")}, this, 0, 0, 0);
		soundButton.scale.setTo(0.5);
		soundButton.animations.add('soundOn',[1,0],10);
		soundButton.animations.add('soundOff',[0,1],10);

		soundButton.onInputOver.add(function(){console.log("Sound Over")}, this);
		soundButton.onInputOut.add(function(){console.log("Sound Out")}, this);
		soundButton.onInputUp.add(function(){
			console.log("Sound Up")
			//soundButton.animations.play('toggle', 10, false);
			//soundButton.loadTexture('toggleSoundInactive');
			if(sound)
			{
				soundButton.animations.play('soundOff');
				sound = SOUND_OFF;
			}
			else
			{
				soundButton.animations.play('soundOn');
				sound = SOUND_ON;
			}
		
		
		toogleMusic();
		}, this);


	},
	update: function () 
	{	
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
					if (  lvl.enemies[i].isTargetable() && isSpriteClicked(new Mouse() , lvl.enemies[i] ) )
					{
						cannonContainer[activeCannon].bullet.setTarget(lvl.enemies[i]);
						lvl.enemies[i].setTargetable(false);
						isAPressed = false;
					}
				}
				
			}
		}
	
			//TODO:reset clouds
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

function toogleMusic() {
	console.log("toogling");
	if (!musicPlaying) {
		music.play();
		console.log("Play Music");
		musicPlaying = true;
	}
	else if (musicPlaying) {
		music.stop();
		//game.cache.removeSound('menuMusic');
		console.log("stop Music");
		musicPlaying = false;
	}
	else {
		console.log("error");
	}
}
function swapState(newState) {
	console.log("swaping state...");
	game.state.start('play');
}
function getactiveCannon(activeCannon) {
	switch (activeCannon) {
		case 1: return cannonContainer[0]; break;
		case 2: return cannonContainer[1]; break;
		case 3: return cannonContainer[2]; break;
		default: console.log("Error- No active canon to return");
	}
} 
function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);

}
function name(params) {
	Math.round(game.input.mousePointer.x),
	Math.round(game.input.mousePointer.y), 
	Math.round(stlkr[i].x),
	Math.round(stlkr[i].y), 
	stlkr[i].width,
	stlkr[i].height
	
}
function isSpriteClicked(mouse,enemy)
{
	
	if (
		mouse.pointer.position.x >= enemy.sprite.body.x 
		&& mouse.pointer.position.x <= enemy.sprite.body.x + enemy.sprite.body.width 
		&& mouse.pointer.position.y >= enemy.sprite.body.y 
		&& mouse.pointer.position.y <= enemy.sprite.body.y + enemy.sprite.body.height
	   ) 
    {
    	return true;
	}
    return false;
}
