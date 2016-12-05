function RedHorn() {
    Enemy.call(this);
    this.sprite = this.Sprites[0];
    this.currentSpriteIndex = 0;
    this.lastFrameTime = new Date().getTime();
};

RedHorn.prototype = Object.create(Enemy.prototype);
RedHorn.prototype.constructor = RedHorn;

RedHorn.prototype.width = 65;
RedHorn.prototype.height = 70;
RedHorn.prototype.frameDuration = 300;

RedHorn.prototype.Sprites = [
    'images/mob/red-horn/frame-1.png',
    'images/mob/red-horn/frame-2.png'
];

RedHorn.prototype.update = function (dt) {
    Object.getPrototypeOf(RedHorn.prototype).update.call(this, dt)
    var now = new Date().getTime();

    if(now - this.lastFrameTime > this.frameDuration) {
      this.lastFrameTime = now;

      this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.Sprites.length;
      this.sprite = this.Sprites[this.currentSpriteIndex];
    }
};
