function Gem() {
	this.SpawnTime = new Date().getTime();
	this.Duration = this.GetDuration();
	this.x = board.GetRandomColOffset();
	this.y = board.GetRandomRowOffset();
	this.sprite = this.GetRandomSprite();
	this.CurrentRotation = 0;
	this.Points = 50;
}

Gem.prototype = Object.create(Element.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.width = 60;
Gem.prototype.height = 60;

Gem.prototype.AvailableSprites = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png']

Gem.prototype.GetRandomSprite = function() {
	var random = Math.floor(Math.random() * this.AvailableSprites.length);
	return this.AvailableSprites[random];
}

Gem.prototype.render = function() {
	var x = (this.x + Config.ColSize / 2);
	var y = (this.y + Config.RowSize );
	this.PrintWithRotation(
		Resources.get(this.sprite),
		x,
		y,
		60,
		60,
		this.CurrentRotation);
};

Gem.prototype.update = function(dt) {
	this.CurrentRotation += 1*dt;
}

Gem.prototype.GetDuration = function() {
	var randomDuration = Math.random() * Config.MaxGemDuration;
	return Math.max(randomDuration, Config.MinGemDuration);
};

Gem.prototype.IsActive = function() {
	var now = new Date().getTime();
	return now - this.SpawnTime < this.Duration;
};
