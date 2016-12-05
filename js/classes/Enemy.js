function Enemy() {
    var initialDirection = this.GetInitialDirection();
    var initialPosition = this.GetInitialPosition(initialDirection);
    this.Direction = initialDirection;
    this.x = initialPosition.x;
    this.y = initialPosition.y;

    this.MinSpeed = 25;
    this.speed = this.GetRandomSpeed();

    this.LastDirectionChangeTime = new Date().getTime();
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
      position.y = 0;
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
  if(timeSinceLastChange < 2500 ||  Math.random() < 0.97) return;


  var nextDirection;
  if(this.Direction == DIRECTION.UP || this.Direction == DIRECTION.DOWN) {
    nextDirection = Math.random() > .5 ?  DIRECTION.RIGHT : DIRECTION.LEFT;
  }else {
    nextDirection = Math.random() > .5 ? DIRECTION.UP : DIRECTION.DOWN;
  }

  this.Direction = nextDirection;
  this.LastDirectionChangeTime = currentTime;
};
Enemy.prototype.CheckPlayerCollision = function() {
    var playerBounds = player.GetCurrentSquare();
    if(this.IsColliding(playerBounds)) {
        player.Die();
    }
}

var allEnemies = [];
