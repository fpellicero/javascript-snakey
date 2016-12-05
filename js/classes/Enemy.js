function Enemy() {
    this.x = 0;
    this.y = this.GetRandomRow();
    this.speed = this.GetRandomSpeed();

};
Enemy.prototype.sprite = 'images/enemy-bug.png'
Enemy.prototype.width = 80;
Enemy.prototype.height = 80;
Enemy.prototype.MinSpeed = 25

Enemy.prototype = Object.create(Element.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.GetRandomSpeed = function() {
    var randomSpeed = Math.floor(Math.random() * 100);
    return randomSpeed > this.MinSpeed ? randomSpeed : 25;
}

Enemy.prototype.GetRandomRow = function() {
    var row = Math.round(Math.random() * 2) + 1;
    return board.GetCenterRowOffset(row);
}

Enemy.prototype.update = function(dt) {
    this.x += (this.speed*dt);
    this.CheckPlayerCollision();
};

Enemy.prototype.CheckPlayerCollision = function() {
    var playerBounds = player.GetCurrentSquare();
    if(this.IsColliding(playerBounds)) {
        player.Die();
    }
}

var allEnemies = [];
