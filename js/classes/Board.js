function Board(width, height, nRows, nCols) {
	this.width 	= width;
	this.height = height;
	this.nRows = nRows;
	this.nCols = nCols;
	this.Gems = [];
	this.Sprites = this.GenerateBoard();
}

Board.prototype.GenerateBoard = function() {
	var availableSprites = [
		'images/stone-block.png',   // Top row is water
		'images/grass-block.png',   // Row 1 of 3 of stone
	];

	var getRandomSprite = function() {
			var randomIndex = Math.floor(Math.random() * availableSprites.length);
			return availableSprites[randomIndex];
	}

	var sprites = [];
	for (var i = 0; i < this.nRows; i++) {
		for (var j = 0; j < this.nCols; j++) {
				if(j == 0) sprites[i] = [];
				sprites[i].push(getRandomSprite());
		}
	}
	return sprites;
};

Board.prototype.GetCellCenterPosition = function(x, y) {
	return {
		x:  x * Config.ColSize,
		y:  y * Config.RowSize + (Config.RowSize / 2)
	};
};

Board.prototype.GetRandomRow = function() {
	return Math.floor(Math.random() * this.nRows);
}

Board.prototype.GetRowOffset = function(row) {
	return row * Config.RowSize;
}

Board.prototype.GetCenterRowOffset = function (row) {
	return this.GetRowOffset(row) + Config.RowSize / 2;
};

Board.prototype.GetRandomRowOffset = function() {
	return this.GetRowOffset(this.GetRandomRow());
};

Board.prototype.GetRandomCol = function() {
	return Math.floor(Math.random() * this.nCols);
}
Board.prototype.GetColOffset = function(col) {
	return col * Config.ColSize;
};

Board.prototype.GetRandomColOffset = function() {
	return this.GetColOffset(this.GetRandomCol());
};

Board.prototype.render = function(withGems) {
	var self = this;
	for (var row = 0; row < this.nRows; row++) {
		for (var col = 0; col < this.nCols; col++) {
			ctx.drawImage(Resources.get(self.Sprites[row][col]), self.GetColOffset(col), self.GetRowOffset(row));
		}
	}
	self.PrintGems();
};

Board.prototype.PrintGems = function() {
	for (var i = 0; i < this.Gems.length; i++) {
		var gem = this.Gems[i];

		var collected = false;
		if(gem.IsColliding(player.GetCurrentSquare())) {
			player.Collect(gem);
			collected = true;
		}

		if(collected || !gem.IsActive()) {
			this.Gems.splice(i, 1);
		}

		gem.render();

	}
};
