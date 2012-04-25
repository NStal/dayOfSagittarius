(function(exports){
    
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Container = require("../drawing/drawable").Drawable;
    var MouseSprite = require("./interaction/mouseInteraction").MouseSprite; 
    var InteractionManager = Drawable.sub();
    var ShipSelectInteraction = require("./interaction/shipSelectInteraction").ShipSelectInteraction; 
    var MouseEventDistributer = require("../drawaing/mouseEventDistributer").MouseEventDistributer;
    var GlobalCaptureLayer = Drawable.sub();
    GlobalCaptureLayer.prototype._init = function(world){
	this.world = world;
	this.consumeType.mouseDown = true; 
	this.consumeType.mouseUp = true;
	this.consumeType.mouseMove = true;
	var self = this;
	this.on("mouseUp",function(e){
	    return self.onMouseUp(e);
	})
	this.on("mouseDown",function(e){
	    return self.onMouseDown(e);
	})
	this.on("mouseMove",function(e){
	    return self.onMouseMove(e);
	})
    }
    GlobalCaptureLayer.prototype.onMouseUp = function(e){
	if(this["mouseUp"])return this["mouseUp"](e);
	return false;
    }    
    GlobalCaptureLayer.prototype.onMouseDown = function(e){
	if(this["mouseDown"])return this["mouseDown"](e);
	return false;
    }
    GlobalCaptureLayer.prototype.onMouseMove = function(e){
	if(this["mouseMove"])return this["mouseMove"](e);
	return false;
    } 
    GlobalCaptureLayer.prototype.capture = function(eventType,handler){
	this[eventType] = handler;
    }
    GlobalCaptureLayer.prototype.release = function(eventType){
	delete this[eventType];
    }
    MouseEventConsumer.mixin(GlobalCaptureLayer);
    exports.GlobalCaptureLayer = GlobalCaptureLayer;
})(exports)