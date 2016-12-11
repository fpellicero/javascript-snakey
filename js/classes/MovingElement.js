function Element() {}
Element.prototype.render = function() {
    if(this.width && this.height) {
        if(Config.PrintBoundingBoxes) ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    }else {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Element.prototype.IsInsideScene = function () {
    return this.x > 0 && this.x < board.width && this.y > 0 && this.y < board.height;
};

Element.prototype.IsInsideCell = function () {
    var boundingBox = this.GetBoundingBox();
    var currentCell = this.GetCurrentSquare();

    var cell = {
      Left: board.GetColOffset(currentCell.Col),
      Right: board.GetColOffset(currentCell.Col + 1),
      Top: board.GetRowOffset(currentCell.Row),
      Bottom: board.GetRowOffset(currentCell.Row + 1)
    }

    return (boundingBox.x >= cell.Left
    && (boundingBox.x + boundingBox.width) <= cell.Right
    && boundingBox.y >= cell.Top
    && (boundingBox.y + boundingBox.height) <= cell.Bottom);
};

Element.prototype.IsColliding = function (anotherElement) {
    var boundingBoxA = this.GetBoundingBox();
    var boundingBoxB = anotherElement.GetBoundingBox();

    var RectangleIntersection = function(rect1, rect2) {
      if (rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.height + rect1.y > rect2.y) {
          return true;
      }
    }

    return RectangleIntersection(boundingBoxA, boundingBoxB);
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

Element.prototype.GetCenter = function () {
  return {
    x: this.x + this.width / 2,
    y: this.y + this.height / 2
  }
};

Element.prototype.GetBoundingBox = function () {
  return {
    x: this.x,
    y: this.y,
    width: this.width - 10,
    height: this.height - 10
  };
};

Element.prototype.GetCurrentSquare = function() {
  var center = this.GetCenter();
  return {
		Row: Math.floor(center.y / Config.RowSize),
		Col: Math.round(center.x / Config.ColSize)
	}
}

Element.prototype.PrintWithRotation = function(sprite, x, y, width, height, rotation) {
	ctx.save();
	ctx.translate(x, y);
  ctx.translate(Config.ColSize / 2, Config.RowSize / 2);
	ctx.rotate( rotation );
	ctx.translate(-width/2, -height/2);
	ctx.drawImage(sprite, 0, 0, width, height);
	ctx.restore();
};
