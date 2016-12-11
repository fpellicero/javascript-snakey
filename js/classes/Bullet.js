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
