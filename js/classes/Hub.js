var Hub = {
	 TopOffset: 80,
	 PrintScore: function(score) {
		ctx.save();
		ctx.fillStyle = Config.TextColor;
	    ctx.font=Config.TextFont;
	    ctx.textAlign = "end";
	    ctx.fillText(score + " points", board.width - 15, this.TopOffset);
	    ctx.restore();
	},
	PrintHealth: function(healthLevel) {
		var healthSprite = Resources.get('images/Heart.png');
		
		var spriteWidth = 50;
		var x = 5;
		for (var i = 0; i < healthLevel; i++) {
			ctx.drawImage(healthSprite, x, 40, 50, 85);
			x += spriteWidth;
		}
	}
}