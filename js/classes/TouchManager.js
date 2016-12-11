var TouchManager = function() {
  this.TouchStart = null;
  this.TouchEnd = null;
  this._initListeners();
}

TouchManager.prototype.GESTURES = {
  SWIPE: {
    LEFT: "swipe.left",
    RIGHT: "swipe.right",
    UP: "swipe.up",
    DOWN: "swipe.down"
  },
  TAP: "tap"
}

TouchManager.prototype.EVENTS = {
  SWIPE: {
    LEFT: new CustomEvent("touchinput",
      {"detail" : TouchManager.prototype.GESTURES.SWIPE.LEFT}),
    RIGHT: new CustomEvent("touchinput",
      {"detail" : TouchManager.prototype.GESTURES.SWIPE.RIGHT}),
    UP: new CustomEvent("touchinput",
      {"detail" : TouchManager.prototype.GESTURES.SWIPE.UP}),
    DOWN: new CustomEvent("touchinput",
      {"detail" : TouchManager.prototype.GESTURES.SWIPE.DOWN})
  },
  TAP: new CustomEvent("touchinput",
    {"detail" : TouchManager.prototype.GESTURES.TAP})
}

TouchManager.prototype._initListeners = function () {
  var self = this;
  document.addEventListener("touchstart", function(e) {
    self.TouchStart = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY
    };
  });
  document.addEventListener("touchend", function(e) {
    self.TouchEnd = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY
    };
    self._fireGestureEvent();
  })
};

TouchManager.prototype._fireGestureEvent = function () {
  if (this.TouchEnd.y == this.TouchStart.y) {
    document.dispatchEvent(this.EVENTS.TAP);
    return;
  }

  var desp = {
    Left: this.TouchStart.x - this.TouchEnd.x,
    Right: this.TouchEnd.x - this.TouchStart.x,
    Up: this.TouchStart.y - this.TouchEnd.y,
    Down: this.TouchEnd.y - this.TouchStart.y
  };

  if(desp.Left > desp.Up && desp.Left > desp.Right && desp.Left > desp.Down) {
    document.dispatchEvent(this.EVENTS.SWIPE.LEFT);
    return;
  }
  if (desp.Right > desp.Left && desp.Right > desp.Up && desp.Right > desp.Down) {
    document.dispatchEvent(this.EVENTS.SWIPE.RIGHT);
    return;
  }
  if (desp.Up > desp.Down && desp.Up > desp.Left && desp.Up > desp.Right) {
    document.dispatchEvent(this.EVENTS.SWIPE.UP);
    return;
  }
  if (desp.Down > desp.Left && desp.Down > desp.Up && desp.Down > desp.Right) {
    document.dispatchEvent(this.EVENTS.SWIPE.DOWN);
    return;
  }

};
var touchManager = new TouchManager();
