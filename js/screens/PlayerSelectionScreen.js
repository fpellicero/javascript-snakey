function PlayerSelectionScreen() {
	this.CurrentSelection = Math.floor(this.AvailableChars.length / 2);
	this.SelectorImage = 'images/Selector.png';
	this.Events = this.GenerateEvents();
	this.Activate();
}
PlayerSelectionScreen.prototype = Object.create(Screen.prototype);
PlayerSelectionScreen.prototype.constructor = PlayerSelectionScreen;


PlayerSelectionScreen.prototype.AvailableChars =
[
	'images/char-boy.png',
	'images/char-cat-girl.png',
	'images/char-horn-girl.png',
	'images/char-pink-girl.png',
	'images/char-princess-girl.png'
];


PlayerSelectionScreen.prototype.GenerateEvents = function() {
	var self = this;
	var events = [];
	events.push({
		element: document,
		event: "keydown",
		handler: function(e) {
			var allowedKeys = {
				37: 'left',
				39: 'right',
				13: 'enter'
			};

			self.handleInput(allowedKeys[e.keyCode]);
		}
	});
	events.push({
		element: document,
		event: "touchinput",
		handler: function(e) {
			self.handleTouchInput(e.detail);
		}
	});
	return events;
}

PlayerSelectionScreen.prototype.handleInput = function(key) {
	switch(key) {
		case "left":
			this.CurrentSelection = Math.max(0, this.CurrentSelection - 1);
			break;
		case "right":
			this.CurrentSelection = Math.min(this.AvailableChars.length - 1, this.CurrentSelection + 1);
			break;
		case "enter":
			this.SelectCharAndInitGame();
			default:
		break;
	}
};

PlayerSelectionScreen.prototype.handleTouchInput = function (gesture) {
	switch (gesture) {
		case touchManager.GESTURES.SWIPE.LEFT:
			this.handleInput("left");
			break;
		case touchManager.GESTURES.SWIPE.RIGHT:
			this.handleInput("right");
			break;
		case touchManager.GESTURES.TAP:
			this.handleInput("enter");
			break;
	}
};

PlayerSelectionScreen.prototype.SelectCharAndInitGame = function() {
	player = new Player(this.AvailableChars[this.CurrentSelection]);
	currentScreen = new MainScreen();
	this.Destroy();
};

PlayerSelectionScreen.prototype.render = function() {
	board.render();

	this.PrintText();

	var centerOffset = board.GetRowOffset(board.nRows / 2);
	var leftOffset = board.GetColOffset(board.nCols / 2 - (this.AvailableChars.length / 2));

	ctx.drawImage(Resources.get(this.SelectorImage), leftOffset + this.CurrentSelection * Config.ColSize, centerOffset - 60);

	for (var i = 0; i < this.AvailableChars.length; i++) {
		var char = this.AvailableChars[i];
		ctx.drawImage(Resources.get(char), leftOffset, centerOffset);
		leftOffset += 100;
	}
};

PlayerSelectionScreen.prototype.PrintText = function() {
	ctx.fillStyle = Config.TextColor;
	ctx.font = Config.TextFont;
	ctx.textAlign = "center";
	ctx.fillText("Choose a character", board.width / 2, board.height / 2 - Config.RowSize);
	ctx.restore();
};
