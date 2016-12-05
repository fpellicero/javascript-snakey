

function GameOverScreen() {
	this.EnemySpawner = null;
	this.GemSpawner = null;
	this.Activate();
}

GameOverScreen.prototype = Object.create(Screen.prototype);
GameOverScreen.prototype.constructor = GameOverScreen;

GameOverScreen.prototype.render = function() {
	board.render();
	this.PrintText();
};

GameOverScreen.prototype.PrintText = function() {
	ctx.fillStyle = Config.TextColor;
	ctx.font = "3em Verdana";
	ctx.textAlign = "center";
	ctx.fillText("GAME OVER", board.width / 2, board.height / 2 - 60);
	ctx.restore();
};
