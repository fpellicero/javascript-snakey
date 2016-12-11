function MainScreen() {
	this.EnemySpawner = null;
	this.GemSpawner = null;
	this.LastMayhemCount = null;
	this.LastMayhemTime = new Date().getTime();
	this.Activate();
}

MainScreen.prototype = Object.create(Screen.prototype);
MainScreen.prototype.constructor = MainScreen;

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
