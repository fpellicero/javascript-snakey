function YellowFlam() {
    AnimatedEnemy.call(this);
};

YellowFlam.prototype = Object.create(AnimatedEnemy.prototype);
YellowFlam.prototype.constructor = YellowFlam;

YellowFlam.prototype.width = 80;
YellowFlam.prototype.height = 70;
YellowFlam.prototype.frameDuration = 120;

YellowFlam.prototype.Sprites = [
    'images/mob/yellow-flam/1.png',
    'images/mob/yellow-flam/2.png',
    'images/mob/yellow-flam/3.png',
    'images/mob/yellow-flam/4.png',
    'images/mob/yellow-flam/5.png',
    'images/mob/yellow-flam/6.png',
    'images/mob/yellow-flam/7.png',
    'images/mob/yellow-flam/8.png',
];
