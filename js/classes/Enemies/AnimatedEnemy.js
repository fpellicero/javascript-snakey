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

AnimatedEnemy.prototype.update = function (dt) {
    Object.getPrototypeOf(AnimatedEnemy.prototype).update.call(this, dt)

    if(!this.IsAnimated()) return;

    var now = new Date().getTime();

    if(now - this.lastFrameTime > this.frameDuration) {
      this.lastFrameTime = now;

      this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.Sprites.length;
      this.sprite = this.Sprites[this.currentSpriteIndex];
    }
};
