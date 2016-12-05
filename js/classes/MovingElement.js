function Element() {}
Element.prototype.render = function() {
    if(this.width && this.height) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    }else {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

};

Element.prototype.CanGoLeft = function() {
	var currentSquare = this.GetCurrentSquare();
	return currentSquare.Col > 0;
}

Element.prototype.CanGoRight = function() {
	var currentSquare = this.GetCurrentSquare();
	return currentSquare.Col < Config.NumCols - 1;
}

Element.prototype.CanGoUp = function() {
	var currentSquare = this.GetCurrentSquare();
	return currentSquare.Row > 0;
}

Element.prototype.CanGoDown = function() {
	var currentSquare = this.GetCurrentSquare();
	return currentSquare.Row < Config.NumRows - 1;
}

Element.prototype.GetCurrentSquare = function() {
  var center = {
    x: this.x - this.width / 2,
    y: this.y + this.height / 2
  };
  return {
		Row: Math.floor(center.y / Config.RowSize),
		Col: Math.round(center.x / Config.ColSize)
	}
}
Element.prototype.IsColliding = function(position) {
	var myPosition = this.GetCurrentSquare();

	return myPosition.Row == position.Row && myPosition.Col == position.Col;
}
Element.prototype.PrintWithRotation = function(sprite, x, y, width, height, rotation) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate( rotation );
	ctx.translate(-width/2, -height/2);
	ctx.drawImage(sprite, 0, 0, width, height);
	ctx.restore();
};
