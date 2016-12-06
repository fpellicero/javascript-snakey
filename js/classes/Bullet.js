function Bullet(direction, initialPosition) {
  this.x = initialPosition.x;
  this.y = initialPosition.y;
  this.width = 10;
  this.height = 10;
  this.Speed = 600;1
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

Bullet.prototype.CheckCollisions = function (itemsToCheck) {
  var self = this;
  for (var i = 0; i < itemsToCheck.length; i++) {
    if(itemsToCheck[i].IsColliding(self)) {
      itemsToCheck.splice(i, 1);
      return true;
    }
  }
  return false;
};

Bullet.prototype.render = function () {
  ctx.fillRect(this.x, this.y, 10, 10);
};
