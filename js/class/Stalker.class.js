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
		this.speed =1.5;
		this.ENEMY_SPEED = -104 *this.speed; // pixel displacement per iteration of gameloop
		this.ANIMATION_SPEED = 28 *this.speed; //in fps
		
		this.targetable = true;
		//this.sprite = game.add.sprite(800,lane, 'stalker'); 
		//enemyLayer.add(this.sprite); 
		this.sprite = enemyLayer.create(800,lane, 'stalker');
		//console.log(this.spriteDeath.z);
		game.physics.arcade.enable(this.sprite);
		this.sprite.animations.add('walk', [8, 7, 6, 5, 4, 3, 2, 1], true);
		this.sprite.inputEnabled = true;
		
		this.sprite.events.onInputOver.add(function()
			{
			  
			  this.sprite.alpha = 0.8;
			  this.sprite.tint =  0xff0000;
			
			}, this);
			this.sprite.events.onInputOut.add(function()
			{
			 
			  this.sprite.alpha =1;
			  this.sprite.tint = 0xFFFFFFFF;
			
			}, this);
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