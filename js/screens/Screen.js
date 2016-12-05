function Screen() {

}

Screen.prototype.Activate = function() {
	this.BindEvents();
};

Screen.prototype.Destroy = function() {
	this.UnbindEvents();
};

Screen.prototype.update = function() {};

Screen.prototype.BindEvents = function() {
	if(!this.Events) return;
	for (var i = 0; i < this.Events.length; i++) {
		var event = this.Events[i];
		event.element.addEventListener(event.event, event.handler);
	}
};

Screen.prototype.UnbindEvents = function() {
	if(!this.Events) return;

	for (var i = 0; i < this.Events.length; i++) {
		var event = this.Events[i];
		event.element.removeEventListener(event.event, event.handler);
	}
};