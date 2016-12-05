function Player(sprite){
	if(typeof sprite !== "string") sprite = 'images/char-horn-girl.png';
    this.sprite = sprite;
		this.width = 100;
		this.height = 100;
    this.Score = 0;
    this.Health = Config.InitialHealth;
    this.TopLabel = {
    	Value: 0,
    	LastUpdate: null
    };
}

Player.prototype = Object.create(Element.prototype);
Player.prototype.constructor = Player;


Player.prototype.Spawn = function() {
	var x = Math.floor(board.nCols / 2);
	var y = board.nRows - 2;
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

Player.prototype.handleInput = function(direction) {
	switch(direction) {
		case "left":
			this.goLeft();
			break;
		case "right":
			this.goRight();
			break;
		case "up":
			this.goUp();
			break;
		case "down":
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

Player.prototype.Collect = function(gem) {
	this.Score += gem.Points;
	this.TopLabel.Value += gem.Points;
	this.TopLabel.LastUpdate = new Date().getTime();
};

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	this.PrintLabel();
};

Player.prototype.PrintLabel = function() {
	if(!this.TopLabel.Value) return;

	var now = new Date().getTime();
	if(now - this.TopLabel.LastUpdate > Config.LabelDuration) {
		this.TopLabel.Value = null;
		return;
	}

	ctx.save();
	ctx.fillStyle = Config.TextColor;
    ctx.font = Config.TextFont;
    ctx.strokeText("+" + this.TopLabel.Value, this.x + 15, this.y + 45);
    ctx.restore();
};

var player = new Player();
