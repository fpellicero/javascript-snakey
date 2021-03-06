

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

function MainScreen() {
	this.EnemySpawner = null;
	this.GemSpawner = null;
	this.LastMayhemCount = null;
	this.LastMayhemTime = new Date().getTime();
	this.Activate();
}

MainScreen.prototype = Object.create(Screen.prototype);
MainScreen.prototype.constructor = MainScreen;

var TouchStart = null;
var TouchEnd = null;
MainScreen.prototype.Events = [
	{
		element: document,
		event: "keydown",
		handler: function(e) {
			var allowedKeys = {
				32: "spacebar",
				37: DIRECTION.LEFT,
				38: DIRECTION.UP,
				39: DIRECTION.RIGHT,
				40: DIRECTION.DOWN
			};

			player.handleInput(allowedKeys[e.keyCode]);
		}
	},
	{
		element: document,
		event: "touchinput",
		handler: function(e) {
			player.handleTouchInput(e.detail);
		}
	}
]

MainScreen.prototype.Activate = function() {
		this.BindEvents();
		this.StartEnemySpawner(Config.EnemySpawnerTime);
    this.StartGemSpawner(Config.GemSpawnerTime);
    player.Spawn();
}

MainScreen.prototype.StartGemSpawner = function (intervalTime) {
	this.GemSpawner = setInterval(function() {
			var random = Math.random() * 100;
			if(random > 85) {
					board.Gems.push(new Gem());
			}
	}, intervalTime);
};

MainScreen.prototype.StartEnemySpawner = function (intervalTime) {
	var self = this;
	this.EnemySpawner = setInterval(function() {
			allEnemies.push(self._newEnemy());
	}, intervalTime)
};

MainScreen.prototype._newEnemy = function () {
	return Math.random() > .5 ? new RedHorn() : new YellowFlam();
};

MainScreen.prototype.Destroy = function() {
	this.UnbindEvents();

	clearInterval(this.EnemySpawner);
	clearInterval(this.GemSpawner);
};


MainScreen.prototype.update = function(dt) {
	this._tryMayhem();
	this._updateEnemies(dt);
	this._updateGems(dt);
	player.update(dt);
};

MainScreen.prototype._tryMayhem = function () {
	if(player.Score < 250) return;

	var now = new Date().getTime();
	if(now - this.LastMayhemTime > Config.TimeBetweenMayhems) {
		this._mayhem();
		this.LastMayhemTime = now;
		console.log("mayhem");
	}
};

MainScreen.prototype._mayhem = function () {
		var self = this;
		self.LastMayhemCount = self.LastMayhemCount || 0;
		self.LastMayhemCount += 5;
		var count = 0;
		var mayhemTimer = setInterval(function () {
			allEnemies.push(self._newEnemy());
			if(++count >= self.LastMayhemCount) {
				clearInterval(mayhemTimer);
			}
		}, 500);
};

MainScreen.prototype._updateEnemies = function (dt) {
	for (var i = 0; i < allEnemies.length; i++) {
		var enemy = allEnemies[i];
		enemy.update(dt);
		if(enemy.IsDead()) {
			allEnemies.splice(i, 1);
		}
	}
};

MainScreen.prototype._updateGems = function (dt) {
	board.Gems.forEach(function(gem) {
      gem.update(dt);
  });
};

MainScreen.prototype.render = function() {
        board.render();

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();

        Hub.PrintScore(player.Score);
        Hub.PrintHealth(player.Health);
};

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

function Screen() {

}

Screen.prototype.Activate = function() {
	this.BindEvents();
};

Screen.prototype.Destroy = function() {
	this.UnbindEvents();
};

Screen.prototype.update = function() {};

Screen.prototype.BindEvents = function() {
	if(!this.Events) return;
	for (var i = 0; i < this.Events.length; i++) {
		var event = this.Events[i];
		event.element.addEventListener(event.event, event.handler);
	}
};

Screen.prototype.UnbindEvents = function() {
	if(!this.Events) return;

	for (var i = 0; i < this.Events.length; i++) {
		var event = this.Events[i];
		event.element.removeEventListener(event.event, event.handler);
	}
};
/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
 function Reset() {
    player.Spawn();
}
var currentScreen = new PlayerSelectionScreen();
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
     var doc = global.document,
     win = global.window,
     canvas = doc.createElement('canvas'),
     ctx = canvas.getContext('2d'),
     lastTime;

     (function() {
        var availableWidth = window.innerWidth - Config.Margin;
        var availableHeight = window.innerHeight - Config.Margin

        Config.NumCols = Math.floor(availableWidth / Config.ColSize);
        Config.NumRows = Math.floor(availableHeight / Config.RowSize);

        availableWidth = Config.NumCols * Config.ColSize;
        availableHeight = (Config.NumRows) * Config.RowSize + 90;

        canvas.width = availableWidth;
        canvas.height = availableHeight;


        global.board = new Board(availableWidth, availableHeight, Config.NumRows, Config.NumCols)
        doc.body.appendChild(canvas);
        if(IsMobile.Any()) {

          if (canvas.requestFullscreen) {
          	canvas.requestFullscreen();
          } else if (canvas.webkitRequestFullscreen) {
          	canvas.webkitRequestFullscreen();
          } else if (canvas.mozRequestFullScreen) {
          	canvas.mozRequestFullScreen();
          } else if (canvas.msRequestFullscreen) {
          	canvas.msRequestFullscreen();
          }
        }
    })();



    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
     function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
         var now = Date.now(),
         dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
         currentScreen.update(dt);
         currentScreen.render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
         lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
         win.requestAnimationFrame(main);
     }

     function init() {
        lastTime = Date.now();
        main();
    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
     var resourcesToLoad = [
       'images/stone-block.png',
       'images/water-block.png',
       'images/grass-block.png',
       'images/enemy-bug.png',
       'images/char-boy.png',
       'images/Gem Blue.png',
       'images/Gem Green.png',
       'images/Gem Orange.png',
       'images/Heart.png',
       'images/char-boy.png',
       'images/char-cat-girl.png',
       'images/char-horn-girl.png',
       'images/char-pink-girl.png',
       'images/char-princess-girl.png',
       'images/Selector.png',
     ];
     Resources.load(resourcesToLoad);
     Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
     global.ctx = ctx;
     Reset();
 })(this);

function IsMobile() {

}
