/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
 function Reset() {
    player.Spawn();
}
var currentScreen = new PlayerSelectionScreen();
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
     var doc = global.document,
     win = global.window,
     canvas = doc.createElement('canvas'),
     ctx = canvas.getContext('2d'),
     lastTime;

     (function() {
        var availableWidth = window.innerWidth - Config.Margin;
        var availableHeight = window.innerHeight - Config.Margin

        Config.NumCols = Math.floor(availableWidth / Config.ColSize);
        Config.NumRows = Math.floor(availableHeight / Config.RowSize) - 1;

        availableWidth = Config.NumCols * Config.ColSize;
        availableHeight = (Config.NumRows) * Config.RowSize + 90;

        canvas.width = availableWidth;
        canvas.height = availableHeight;


        global.board = new Board(availableWidth, availableHeight, Config.NumRows, Config.NumCols)
        doc.body.appendChild(canvas);
    })();



    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
     function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
         var now = Date.now(),
         dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
         currentScreen.update(dt);
         currentScreen.render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
         lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
         win.requestAnimationFrame(main);
     }

     function init() {
        lastTime = Date.now();
        main();
    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
     Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Heart.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png',
        'images/mob/red-horn/frame-1.png',
        'images/mob/red-horn/frame-2.png'
        ]);
     Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
     global.ctx = ctx;
     Reset();
 })(this);
