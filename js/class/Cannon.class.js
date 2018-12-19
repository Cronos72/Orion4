class Cannon {
	constructor(id) {
		this.id = id;
		this.baseSprite = game.add.sprite(280, 450, 'cannon-base');
		this.baseSprite.scale.setTo(0.7);
		this.firing = false;
		this.centerPointX = (this.baseSprite.width / 2) + this.baseSprite.x;
		this.centerPointY = (this.baseSprite.height / 2) + this.baseSprite.y;
		this.bullet = new Bullet(this);
        this.range = 350;
		this.baseSprite.x += 100 * this.id;
		this.bullet.sprite.x += 100 * this.id;
		this.lastTimeFired =0;
		this.firedAt = 0; //TODO: game time
		this.shotDelay = 0.89;// seconds
		
		
	}
	setFiredTimeStamp()
	{
		this.lastTimeFired = game.time.time;
	}

	ableToFire()
	{
		var d = (Math.floor(game.time.time - this.lastTimeFired ) / 1000 );
		
		if( d >=this.shotDelay)
		{
			return true;
		}
		else
		{
			return false;
		}

	}

	targetInRange(target)
	{
		//http://www.dummies.com/education/science/physics/how-to-find-a-vectors-magnitude-and-direction/
		var vectorx = Math.pow( this.centerPointX - target.sprite.body.x , 2) ;
		var vectory = Math.pow( this.centerPointY = target.sprite.body.y , 2) ;
		var unitVector = Math.sqrt(vectorx+vectory);
		if(unitVector <= this.range)
		{
			return true;
		}
		else
		{
			return false;
		}
			

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