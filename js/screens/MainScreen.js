function MainScreen() {
	this.EnemySpawner = null;
	this.GemSpawner = null;
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

    this.EnemySpawner = setInterval(function() {
				var newEnemy = Math.random() > .5 ? new RedHorn() : new YellowFlam();
				allEnemies.push(newEnemy);
    }, Config.EnemySpawnerTime)

    this.GemSpawner = setInterval(function() {
        var random = Math.random() * 100;
        if(random > 85) {
            board.Gems.push(new Gem());
        }
    }, Config.GemSpawnerTime);

    player.Spawn();
}

MainScreen.prototype.Destroy = function() {
	this.UnbindEvents();

	clearInterval(this.EnemySpawner);
	clearInterval(this.GemSpawner);
};


MainScreen.prototype.update = function(dt) {
	this._updateEnemies(dt);
	this._updateGems(dt);
	player.update(dt);
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

MainScreen.prototype.render = function(first_argument) {
        board.render();

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();

        Hub.PrintScore(player.Score);
        Hub.PrintHealth(player.Health);
};
