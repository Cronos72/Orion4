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
		
		if(this.target)
		{
			
			return false;
		}
		else
		{
			return true;
		}
	}
	
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
		var unitVectorX = (ux / vectorMagnintude)*10 ;//TODO: have speed control as attribute of level
		var unitVectorY = (uy / vectorMagnintude)*10 ; 
	
		//this.sprite.body.x += Math.floor(u.x);
		//this.sprite.body.y += Math.floor(u.y);
		this.sprite.x += Math.floor(unitVectorX);
		this.sprite.y += Math.floor(unitVectorY);
		
	}
}