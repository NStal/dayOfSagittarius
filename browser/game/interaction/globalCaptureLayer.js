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
	this.consumeType.rightMouseDown = true; 
	this.consumeType.rightMouseUp = true;
	this.consumeType.rightMouseMove = true;
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
	
	this.on("rightMouseUp",function(e){
	    return self.onRightMouseUp(e);
	})
	this.on("rightMouseDown",function(e){
	    return self.onRightMouseDown(e);
	})
	this.on("rightMouseMove",function(e){
	    return self.onRightMouseMove(e);
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
    
    GlobalCaptureLayer.prototype.onRightMouseUp = function(e){
	if(this["rightMouseUp"])return this["rightMouseUp"](e);
	return false;
    }    
    GlobalCaptureLayer.prototype.onRightMouseDown = function(e){
	if(this["rightMouseDown"])return this["rightMouseDown"](e);
	return false;
    }
    GlobalCaptureLayer.prototype.onRightMouseMove = function(e){
	if(this["rightMouseMove"])return this["rightMouseMove"](e);
	return false;
    } 
    GlobalCaptureLayer.prototype.capture = function(eventType,handler){
	this[eventType] = handler;
    }
    GlobalCaptureLayer.prototype.release = function(eventType){
	delete this[eventType];
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