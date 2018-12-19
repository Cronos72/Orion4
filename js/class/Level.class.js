class Level
{
	constructor()
	{
		this.levelNumber = 1;
		
		//this.scoreText; maybe seperate sincve displayiong text is part of render
		this.scoreTracker;

		this.spawnTracker = 0;
		this.enemyCount  = 120;
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
		game.time.events.repeat(400, this.enemyCount, this.spawnEnemy, this);
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