function Player(sprite){
		this.originalSprite = sprite;
		this.sprite = sprite;
		this.lastSpriteChangeTime = null;

		this.width = 80;
		this.height = 81;

    this.Score = 0;
    this.Health = Config.InitialHealth;
    this.TopLabel = {
    	Value: 0,
    	LastUpdate: null
    };
		this.Bullets = [];
		this.LastDirection = DIRECTION.UP;

		/* Timestamps to control inmortality state*/
		this.InmortalStartTime = null;
		this.InmortalDuration = null;
}



Player.prototype = Object.create(Element.prototype);
Player.prototype.constructor = Player;


Player.prototype.Spawn = function() {
	var x = Math.ceil(board.nCols / 2);
	var y = board.nRows;
	var cellPosition = board.GetCellCenterPosition(x,y);
	this.x = cellPosition.x;
	this.y = cellPosition.y;
	this.SetInmortal(2000);
}

Player.prototype.goLeft = function() {
	if(!this.CanGoLeft()) {
		this.x = board.GetColOffset(board.nCols - 1);
	}else {
			this.x -= Config.ColSize;
	}
}

Player.prototype.goRight = function() {
	if(!this.CanGoRight()) {
		this.x = board.GetColOffset(0);
	}else {
			this.x += Config.ColSize;
	}
}

Player.prototype.goDown = function() {
	if(!this.CanGoDown()) {
		this.y = board.GetRowOffset(0);
	}else {
		this.y += Config.RowSize;
	}
}

Player.prototype.goUp = function() {
	if(!this.CanGoUp()) {
		this.y = board.GetRowOffset(board.nRows - 1);
	}else {
			this.y -= Config.RowSize;
	}
}

Player.prototype.handleInput = function(key) {
	if(key == "spacebar") return this.Shoot();

	if(!IsMobile.Any()) this.LastDirection = key;
	switch(key) {
		case DIRECTION.LEFT:
			this.goLeft();
			break;
		case DIRECTION.RIGHT:
			this.goRight();
			break;
		case DIRECTION.UP:
			this.goUp();
			break;
		case DIRECTION.DOWN:
			this.goDown();
			break;
	}
}

Player.prototype.handleTouchInput = function (gesture) {
		switch (gesture) {
			case touchManager.GESTURES.SWIPE.LEFT:
				this.handleInput(DIRECTION.LEFT);
				break;
			case touchManager.GESTURES.SWIPE.RIGHT:
				this.handleInput(DIRECTION.RIGHT);
				break;
			case touchManager.GESTURES.SWIPE.UP:
				this.handleInput(DIRECTION.UP);
				break;
			case touchManager.GESTURES.SWIPE.DOWN:
				this.handleInput(DIRECTION.DOWN);
				break;
			case touchManager.GESTURES.TAP:
				this.handleInput("spacebar");
				break;
		}
};

Player.prototype._getInput = function (touchStart, touchEnd) {
	if (touchEnd.x < touchStart.x) {
			return DIRECTION.LEFT;
	}
	if (touchEnd.x > touchStart.x) {
			return DIRECTION.RIGHT;
	}
	if (touchEnd.y < touchStart.y) {
			return DIRECTION.DOWN;
	}
	if (touchEnd.y > touchStart.y) {
			return DIRECTION.UP;
	}
	if (touchEnd.y == touchStart.y) {
			return "tap"
	}
};

Player.prototype.Die = function() {
	this.Score -= Config.DieScorePenalty;
	this.Health -= Config.DieHealthPenalty;
	this.Score = Math.max(this.Score, 0);
	if(this.Health > 0) {
		Reset();
	}else {
		currentScreen.Destroy();
		currentScreen = new GameOverScreen();
	}

};

Player.prototype.Shoot = function () {
	this.Bullets.push(new Bullet(this.LastDirection, this.GetCenter()))
};

Player.prototype.AddScore = function(score) {
	this.Score += score;
	this.TopLabel.Value += score;
	this.TopLabel.LastUpdate = new Date().getTime();
};

Player.prototype.render = function() {
	this.Bullets.forEach(function(bullet) {
		bullet.render();
	});
	Object.getPrototypeOf(Player.prototype).render.call(this);
	this.PrintLabel();
};

Player.prototype._inmortalAnimation = function () {
	if(!this.IsInmortal()) return;

	var now = new Date().getTime();
	if(!this.lastSpriteChangeTime || now - this.lastSpriteChangeTime > 100) {
		this.lastSpriteChangeTime = now
		this.sprite = (!this.sprite) ? this.originalSprite : null;
	}
};

Player.prototype.update = function (dt) {
	this._inmortalAnimation();

	for (var i = 0; i < this.Bullets.length; i++) {
		var bullet = this.Bullets[i]
		if(!bullet.IsInsideScene()) this.Bullets.splice(i, 1);

		bullet.update(dt);
		var enemyKilled = bullet.CheckCollisions(allEnemies);
		if(enemyKilled) {
				this._killEnemy(enemyKilled);
				this.Bullets.splice(i, 1);
		}
	}
};

Player.prototype._killEnemy = function (enemy) {
	enemy.Kill();
	this.AddScore(enemy.Score);
};

Player.prototype.PrintLabel = function() {
	if(!this.TopLabel.Value) return;

	var now = new Date().getTime();
	if(now - this.TopLabel.LastUpdate > Config.LabelDuration) {
		this.TopLabel.Value = null;
		return;
	}

	var center = this.GetCenter();
		ctx.save();
		ctx.fillStyle = Config.TextColor;
    ctx.font = Config.TextFont;
    ctx.strokeText("+" + this.TopLabel.Value, center.x - 10, center.y - (this.height / 2));
    ctx.restore();
};

Player.prototype.SetInmortal = function (duration) {
	this.InmortalStartTime = new Date().getTime();
	this.InmortalDuration = duration;
};

Player.prototype.SetMortal = function () {
	this.sprite = this.originalSprite;
	this.InmortalDuration = null;
	this.InmortalStartTime = null;
};

Player.prototype.IsInmortal = function () {
	if(!this.InmortalDuration || !this.InmortalStartTime) return false;

	var now = new Date().getTime();
	if(now - this.InmortalStartTime > this.InmortalDuration) {
		this.SetMortal();
		return false;
	}
	return true;
};

var player = new Player();
