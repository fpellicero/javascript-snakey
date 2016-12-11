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
		x:  (x - 1) * Config.ColSize,
		y:  (y - 1) * Config.RowSize
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
			if(Config.PrintBoundingBoxes) ctx.strokeRect(self.GetColOffset(col), self.GetRowOffset(row), Config.ColSize, Config.RowSize);
			ctx.drawImage(Resources.get(self.Sprites[row][col]), self.GetColOffset(col), self.GetRowOffset(row));
		}
	}
	self.PrintGems();
};

Board.prototype.PrintGems = function() {
	for (var i = 0; i < this.Gems.length; i++) {
		var gem = this.Gems[i];

		var collected = false;
		if(gem.IsColliding(player)) {
			player.AddScore(gem.Points);
			collected = true;
		}

		if(collected || !gem.IsActive()) {
			this.Gems.splice(i, 1);
		}

		gem.render();

	}
};

function Bullet(direction, initialPosition) {
  this.x = initialPosition.x;
  this.y = initialPosition.y;
  this.width = 10;
  this.height = 10;
  this.Speed = 800;
  this.Direction = direction;
}

Bullet.prototype = Object.create(Element.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function (dt) {
  var increment = this.Speed * dt;

  switch (this.Direction) {
    case DIRECTION.UP:
      this.y -= increment;
      break;
    case DIRECTION.DOWN:
      this.y += increment;
      break;
    case DIRECTION.RIGHT:
      this.x += increment;
      break;
    case DIRECTION.LEFT:
      this.x -= increment;
      break;
  }
};

Bullet.prototype.CheckCollisions = function (enemies) {
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    if(enemy.dying || !enemy.IsColliding(this)) continue;
    return enemy;
  }
  return false;
};

Bullet.prototype.render = function () {
  ctx.fillRect(this.x, this.y, 10, 10);
};

var Config = {
	Margin: 0,
	ColSize: 101,
	RowSize: 83,
	MinGemDuration: 10000,
	MaxGemDuration: 20000,
	DiePenalty: 100,
	InitialHealth: 3,
	DieScorePenalty: 100,
	DieHealthPenalty: 1,
	LabelDuration: 1000,
	TextColor: "#D2312E",
	TextFont: "2em Verdana",
	EnemyDyingTime: 500,
	PrintBoundingBoxes: false,
	EnemySpawnerTime: 1500,
	GemSpawnerTime: 3000,
	TimeBetweenMayhems: 15000
}

var DIRECTION = {
	UP : 0,
	DOWN : 1,
	LEFT : 2,
	RIGHT : 3
}

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
	if(Config.PrintBoundingBoxes) ctx.strokeRect(this.x, this.y, this.width, this.height);
	this.PrintWithRotation(
		Resources.get(this.sprite),
		this.x,
		this.y,
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

var Hub = {
	 TopOffset: 45,
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
			ctx.drawImage(healthSprite, x, 0, 50, 85);
			x += spriteWidth;
		}
	}
}

function Element() {}
Element.prototype.render = function() {
    if(!this.sprite) return;
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

function Player(sprite){
		this.originalSprite = sprite;
		this.sprite = sprite;
		this.lastSpriteChangeTime = null;

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

		/* Timestamps to control inmortality state*/
		this.InmortalStartTime = null;
		this.InmortalDuration = null;
}



Player.prototype = Object.create(Element.prototype);
Player.prototype.constructor = Player;


Player.prototype.Spawn = function() {
	var x = Math.ceil(board.nCols / 2);
	var y = board.nRows;
	var cellPosition = board.GetCellCenterPosition(x,y);
	this.x = cellPosition.x;
	this.y = cellPosition.y;
	this.SetInmortal(2000);
}

Player.prototype.goLeft = function() {
	if(!this.CanGoLeft()) {
		this.x = board.GetColOffset(board.nCols - 1);
	}else {
			this.x -= Config.ColSize;
	}
}

Player.prototype.goRight = function() {
	if(!this.CanGoRight()) {
		this.x = board.GetColOffset(0);
	}else {
			this.x += Config.ColSize;
	}
}

Player.prototype.goDown = function() {
	if(!this.CanGoDown()) {
		this.y = board.GetRowOffset(0);
	}else {
		this.y += Config.RowSize;
	}
}

Player.prototype.goUp = function() {
	if(!this.CanGoUp()) {
		this.y = board.GetRowOffset(board.nRows - 1);
	}else {
			this.y -= Config.RowSize;
	}
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

Player.prototype._inmortalAnimation = function () {
	if(!this.IsInmortal()) return;

	var now = new Date().getTime();
	if(!this.lastSpriteChangeTime || now - this.lastSpriteChangeTime > 100) {
		this.lastSpriteChangeTime = now
		this.sprite = (!this.sprite) ? this.originalSprite : null;
	}
};

Player.prototype.update = function (dt) {
	this._inmortalAnimation();

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

Player.prototype.SetInmortal = function (duration) {
	this.InmortalStartTime = new Date().getTime();
	this.InmortalDuration = duration;
};

Player.prototype.SetMortal = function () {
	this.sprite = this.originalSprite;
	this.InmortalDuration = null;
	this.InmortalStartTime = null;
};

Player.prototype.IsInmortal = function () {
	if(!this.InmortalDuration || !this.InmortalStartTime) return false;

	var now = new Date().getTime();
	if(now - this.InmortalStartTime > this.InmortalDuration) {
		this.SetMortal();
		return false;
	}
	return true;
};

var player = new Player();

/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    function _load(url) {
        if(resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function() {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

function Enemy() {
    var initialDirection = this.GetInitialDirection();
    var initialPosition = this.GetInitialPosition(initialDirection);
    this.Direction = initialDirection;
    this.x = initialPosition.x;
    this.y = initialPosition.y;

    this.MinSpeed = 25;
    this.speed = this.GetRandomSpeed();

    this.LastDirectionChangeTime = new Date().getTime();
    this.dying = false;
    this.dieTime = null;
    this.Score = 25;
};
Enemy.prototype.sprite = 'images/enemy-bug.png'
Enemy.prototype.width = 80;
Enemy.prototype.height = 80;

Enemy.prototype = Object.create(Element.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.GetInitialDirection = function () {
  return Math.round(Math.random() * Object.keys(DIRECTION).length)
};

Enemy.prototype.GetInitialPosition = function (initialDirection) {
  var position = {};
  switch (initialDirection) {
    case DIRECTION.UP:
      position.y = board.height;
      position.x = board.GetRandomColOffset();
      break;
    case DIRECTION.DOWN:
      position.y = 50;
      position.x = board.GetRandomColOffset();
      break;
    case DIRECTION.LEFT:
      position.y = board.GetRandomRowOffset();
      position.x = board.width;
      break;
    case DIRECTION.RIGHT:
      position.y = board.GetRandomRowOffset();
      position.x = 0
      break;
  }
  return position;
};

Enemy.prototype.GetRandomSpeed = function() {
    var randomSpeed = Math.floor(Math.random() * 55);
    return randomSpeed > this.MinSpeed ? randomSpeed : 25;
}

Enemy.prototype.update = function(dt) {
    this.UpdatePosition(dt);
    this.CheckPlayerCollision();
};

Enemy.prototype.UpdatePosition = function (dt) {
  this.TryChangeDirection(dt);

  switch (this.Direction) {
    case DIRECTION.UP:
      this.y -= (this.speed*dt);
      break;
    case DIRECTION.DOWN:
      this.y += (this.speed*dt);
      break;
    case DIRECTION.LEFT:
      this.x -= (this.speed*dt);
      break;
    case DIRECTION.RIGHT:
      this.x += (this.speed*dt);
      break;
  }
};

Enemy.prototype.TryChangeDirection = function (dt) {
  var currentTime = new Date().getTime();
  var timeSinceLastChange = currentTime - this.LastDirectionChangeTime;
  if(timeSinceLastChange < 2500) return;

  if(!this.IsInsideCell()) return;

  var nextDirection;
  if(this.Direction == DIRECTION.UP || this.Direction == DIRECTION.DOWN) {
    nextDirection = Math.random() > .5 ?  DIRECTION.RIGHT : DIRECTION.LEFT;
  }else {
    if(!this.CanGoUp()) {
      nextDirection = DIRECTION.DOWN;
    }
    else {
      nextDirection = Math.random() > .5 ? DIRECTION.UP : DIRECTION.DOWN;
    }
  }

  this.Direction = nextDirection;
  this.LastDirectionChangeTime = currentTime;
};
Enemy.prototype.CheckPlayerCollision = function() {
    if(!player.IsInmortal() && this.IsColliding(player)) {
        player.Die();
    }
}

Enemy.prototype.Kill = function () {
  this.dying = true;
  this.dieTime = new Date().getTime();
};

Enemy.prototype.IsDead = function () {
  var now = new Date().getTime();
  return this.dying && (now - this.dieTime) > Config.EnemyDyingTime;
};

var allEnemies = [];

function AnimatedEnemy() {
  Enemy.call(this);
  this.sprite = this.Sprites[0];
  this.currentSpriteIndex = 0;
  this.lastFrameTime = new Date().getTime();
}

AnimatedEnemy.prototype = Object.create(Enemy.prototype);
AnimatedEnemy.prototype.constructor = AnimatedEnemy;

AnimatedEnemy.prototype.IsAnimated = function () {
  return this.Sprites && this.Sprites.length > 1;
};

AnimatedEnemy.prototype.Kill = function () {
  Object.getPrototypeOf(AnimatedEnemy.prototype).Kill.call(this);
  this.sprite = this.DamagedSprite;
};

AnimatedEnemy.prototype.update = function (dt) {
    if(this.dying) return;
    Object.getPrototypeOf(AnimatedEnemy.prototype).update.call(this, dt)

    if(!this.IsAnimated()) return;

    var now = new Date().getTime();

    if(now - this.lastFrameTime > this.frameDuration) {
      this.lastFrameTime = now;

      this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.Sprites.length;
      this.sprite = this.Sprites[this.currentSpriteIndex];
    }
};

function RedHorn() {
    AnimatedEnemy.call(this);
};

RedHorn.prototype = Object.create(AnimatedEnemy.prototype);
RedHorn.prototype.constructor = RedHorn;

RedHorn.prototype.width = 65;
RedHorn.prototype.height = 70;
RedHorn.prototype.frameDuration = 300;

RedHorn.prototype.Sprites = [
    'images/mob/red-horn/1.png',
    'images/mob/red-horn/2.png'
];
RedHorn.prototype.DamagedSprite = 'images/mob/red-horn/damaged.png';

Resources.load(RedHorn.prototype.Sprites);
Resources.load(RedHorn.prototype.DamagedSprite);

function YellowFlam() {
    AnimatedEnemy.call(this);
};

YellowFlam.prototype = Object.create(AnimatedEnemy.prototype);
YellowFlam.prototype.constructor = YellowFlam;

YellowFlam.prototype.width = 80;
YellowFlam.prototype.height = 70;
YellowFlam.prototype.frameDuration = 120;

YellowFlam.prototype.DamagedSprite = 'images/mob/yellow-flam/damaged.png';
YellowFlam.prototype.Sprites = [
    'images/mob/yellow-flam/1.png',
    'images/mob/yellow-flam/2.png',
    'images/mob/yellow-flam/3.png',
    'images/mob/yellow-flam/4.png',
    'images/mob/yellow-flam/5.png',
    'images/mob/yellow-flam/6.png',
    'images/mob/yellow-flam/7.png',
    'images/mob/yellow-flam/8.png',
];

Resources.load(YellowFlam.prototype.Sprites);
Resources.load(YellowFlam.prototype.DamagedSprite);
