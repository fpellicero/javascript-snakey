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
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down'
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
    }, 1500)

    this.GemSpawner = setInterval(function() {
        var random = Math.random() * 100;
        if(random > 85) {
            board.Gems.push(new Gem());
        }
    }, 1000);

    player.Spawn();

}

MainScreen.prototype.Destroy = function() {
	this.UnbindEvents();

	clearInterval(this.EnemySpawner);
	clearInterval(this.GemSpawner);
};


MainScreen.prototype.update = function(dt) {
	allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
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
