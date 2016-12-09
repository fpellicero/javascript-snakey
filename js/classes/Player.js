function Player(sprite){
	if(typeof sprite !== "string") sprite = 'images/char-horn-girl.png';
    this.sprite = sprite;
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
}

Player.prototype = Object.create(Element.prototype);
Player.prototype.constructor = Player;


Player.prototype.Spawn = function() {
	var x = Math.floor(board.nCols / 2);
	var y = board.nRows;
	var cellPosition = board.GetCellCenterPosition(x,y);
	this.x = cellPosition.x;
	this.y = cellPosition.y;
}

Player.prototype.goLeft = function() {
	if(!this.CanGoLeft()) return;
	this.x -= Config.ColSize;
}

Player.prototype.goRight = function() {
	if(!this.CanGoRight()) return;
	this.x += Config.ColSize;
}

Player.prototype.goDown = function() {
	if(!this.CanGoDown()) return;
	this.y += Config.RowSize;
}

Player.prototype.goUp = function() {
	if(!this.CanGoUp()) return;
	this.y -= Config.RowSize;
}

Player.prototype.handleInput = function(key) {
	if(key == "spacebar") return this.Shoot();

	this.LastDirection = key;
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
		default:
			break;
	}
}

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

Player.prototype.update = function (dt) {

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

var player = new Player();
