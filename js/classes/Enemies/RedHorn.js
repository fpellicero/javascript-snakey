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
