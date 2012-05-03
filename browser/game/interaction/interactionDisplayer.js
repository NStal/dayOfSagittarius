(function(exports){
    
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Container = require("../drawing/drawable").Drawable;
    var MouseInteraction = require("./interaction/mouseInteraction").MouseInteraction; 
    var InteractionManager = Drawable.sub();
    var ShipSelectInteraction = require("./interaction/shipSelectInteraction").ShipSelectInteraction; 
    var MouseEventDistributer = require("../drawaing/mouseEventDistributer").MouseEventDistributer;
    var InteractionDisplayer = Drawable.sub();
    MouseEventConsumer.mixin(InteractionDisplayer);
    InteractionDisplayer.prototype._init = function(world){
	this.world = world; 
    }
    InteractionDisplayer.prototype.onDraw = function(){
	
	this.position = Static.battleFieldDisplayer.position;
	this.scale = Static.battleFieldDisplayer.scale;
    }
    exports.InteractionDisplayer = InteractionDisplayer;
})(exports)