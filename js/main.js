/*
The Phaser api (..app/phaser.min.js) is a frame work that acts as a html5 game engine. Essential it is a finite state machine (FSM)
in which the states are handled by the state manager of the games instance ( new phaser.Game(params) ). Each state has a set of functions, init; preload; create; update
which get exucted once every iteration of the games mainloop. the logic for each state is contained in it's own 
file located in "..app/js/states" . Addtionally this game takes advantage of ECMA6 class syntax. Most on screen objects have their own class like cannon or bullet which are located 
in "..app/js/class/" . Those object aggregate an instance of phasers sprite class which handles most of the essentials. Any additional attributes or required functionality 
can be found in the objects respective class.

*/
var game; // Will hold instance of phaser API's game class 

const GAME_WIDTH = 800;  // Parameter passed to constructor of new phaser.Game()
const GAME_HEIGHT = 500; //Parameter passed to constructor of new phaser.Game()

const TARGET_ELEMENT = "1a2a3a"; // Parameter passed to constructor of phaser.Game() - it tells phaser which html element to inject a canvas element for rendering the game into

var cursorState; // String containing the cursor state i. "crosshar". Full list at https://www.tutorialspoint.com/css/css_cursors.htm

var fgCloudGroup;
const SOUND_ON = true; // Global SoudControl
const SOUND_OFF = false;
var sound = SOUND_OFF;
var menuStateMusic;
var playStateMusic;
var clickSound;
var musicPlaying = true;
var sparkSound;
var island1;
var island2;		
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
//TODO: Revise to modern class syntax
function Button(id, img, w, h, xcord, ycord, action) {
	this.identifier = id;

	
	this.imagePath = img;
	
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
				menuStateMusic.stop();
				break;
			case 'swap-state':
				clickSound.play();
				menuStateMusic.stop();
				swapState('play');
				break;
			default:
				console.log("Damn daniel");
		}
	}
}
//id, img, toogle-image, w, h, xcord, ycord, action
var playButton = new Button('play', 'assets/images/menu-buttons/btn_play_combined.png', 389, 119, 100, 100, 'swap-state');
var h2p = new Button('h2p', 'assets/images/menu-buttons/btn_instructions_combined.png',889, 119, 0, 190, 'b1');
//var hs = new Button('hs', 'assets/images/hs1.png', 352, 87, 0, 190, 'b1');
menuButtons.push(playButton);
menuButtons.push(h2p);
//menuButtons.push(hs);

function init() {
	console.log("Initializing...");
	game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, TARGET_ELEMENT);
	game.state.add('menu', menu);
	game.state.add('play', play);
	game.state.start('menu');

}





function swapState(newState) {
	console.log("swaping state...");
	game.state.start(newState);
}
function resetState() {
	console.log("swaping state...");
	
	playStateMusic.stop();
	game.state.restart();
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

function swapState(newState) {
	console.log("swaping state...");
	game.state.start(newState);
}
function resetState() {
	console.log("swaping state...");
	
	playStateMusic.stop();
	game.state.restart();
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
function resetCloud(cloud)
{
	cloud.reset(1150,330);
	console.log("reset"+ cloud.x);
	cloud.body.velocity.x =  game.rnd.realInRange(-5,-20) ;
	cloud.angle = game.rnd.realInRange(-180,180);
}
function resetCloud2(cloud)
{
	cloud.reset(-300,330);
	console.log("reset"+ cloud.x);
	cloud.body.velocity.x = game.rnd.realInRange(5,20); 
	cloud.angle = game.rnd.realInRange(-180,180);
}



function changeCursor(context,cursorType)
{
   //cursor types url() or crosshair ,or pointer default
   
	context.canvas.style.cursor = "crosshair";
  
}

function bindHotKeys() {
	keyOne = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	keyOne.onDown.add(function () { activeCannon = 0 }, this);

	keyTwo = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	keyTwo.onDown.add(function () { activeCannon = 1 }, this);

	keyThree = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
	keyThree.onDown.add(function () { activeCannon = 2 }, this);

	attackModeKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	attackModeKey.onDown.add(function () { 
		isAPressed = true; 
		cursorState= "crosshair";

		
		
	}, this);
}
