(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Container = require("../drawing/drawable").Drawable;
    var MouseInteraction = require("./interaction/mouseInteraction").MouseInteraction; 
    var InteractionManager = Drawable.sub();
    var ShipSelectInteraction = require("./interaction/shipSelectInteraction").ShipSelectInteraction; 
    //InteractionManager:
    //1.Manage all the user event like mousemove and keydown
    //2.Every handler that want to access user event
    //Should register in the interactionManager
    InteractionManager.prototype._init = function(game){
	this.global = game;
	this.battleField = game.battleField;
	this.infoPanel = {};
	this.criticalInteraction = [];
	this.eventHandlers = [];
	this.parts = [];
	this.globalParts = new Drawable();
	this.position = new Point(0,0);
	this.scale = 1; 
	this.mouse = new MouseInteraction();
	this.addInteraction(this.mouse);
	this.pushCriticalInteraction(new ShipSelectInteraction());
	
	var self  = this;
	window.KEY = {};
	window.onkeydown = function(e){
	    window.KEY[e.which] = true;
	}
	window.onkeyup = function(e){
	    window.KEY[e.which] = false;
	}
	window.onmousedown = function(e){
	    self.onMouseDown(e);
	}
	window.onmouseup = function(e){
	    self.onMouseUp(e);
	}
	window.onmousemove = function(e){
	    self.onMouseMove(e);
	}
    }
    InteractionManager.prototype.onMouseDown = function(e){
	this.mousePosition = this._eventToPoint(e);
	var handlers = this._findHandler("game","mouseDown");
	this._callHandlers(handlers,this.mousePosition); 
	var handlers = this._findHandler("battleField","mouseDown");
	this._callHandlers(handlers,this.mousePosition);
    }
    InteractionManager.prototype.onMouseUp = function(e){
	this.mousePosition = this._eventToPoint(e);
	var handlers = this._findHandler("game","mouseUp");
	this._callHandlers(handlers,this.mousePosition); 
	var handlers = this._findHandler("battleField","mouseUp");
	this._callHandlers(handlers,this.mousePosition);
    }
    InteractionManager.prototype.onMouseMove = function(e){
	this.mousePosition = this._eventToPoint(e);
	var handlers = this._findHandler("game","mouseMove");
	this._callHandlers(handlers,this.mousePosition); 
	var handlers = this._findHandler("battleField","mouseMove");
	this._callHandlers(handlers,this.mousePosition);
    }
    InteractionManager.prototype._eventToPoint = function(e){
	return new Point(e.offsetX?e.offsetX:e.clientX
			 ,e.offsetY?e.offsetY:e.clientY);
    }
    InteractionManager.prototype._findHandler = function(where,type){
	var handlers = [];
	for(var i=0;i<this.eventHandlers.length;i++){
	    var item = this.eventHandlers[i];
	    if(item.where === where && item.type === type){
		handlers.push(item);
	    }
	}
	return handlers;
    }
    InteractionManager.prototype._callHandlers = function(handlers,info){
	for(var i=0;i < handlers.length;i++){
	    handlers[i].handler(info);
	}
    }
    InteractionManager.prototype.register = function(info){
	this.eventHandlers.push(info);
    }
    InteractionManager.prototype.unregister = function(info){
	for(var i=0;i<this.eventHandlers.length;i++){
	    var item = this.eventHandlers[i];
	    if(item===info){
		this.eventHandlers.splice(i,1);
		return true;
	    }
	}
	return false;
    }
    InteractionManager.prototype.clear = function(){
	if(this._criticalInteraction){
	    this._criticalInteraction.clear();
	}
	this._criticalInteraction = null;
    }
    //normal interaction don't effect the game,only show some information
    InteractionManager.prototype.addInteraction = function(interaction){
	interaction.init(this);
    }
    //critical interaction usally is the important user action such as move a ship.
    InteractionManager.prototype.addCriticalInteraction = function(interaction){
	if(this._criticalInteraction){
	    this._criticalInteraction.clear();
	}
	this._criticalInteraction = interaction;
	this.addInteraction(interaction);
    }
    InteractionManager.prototype.pushCriticalInteraction = function(interaction){
	var tail = this.criticalInteraction.length-1;
	if(tail>=0)
	    this.criticalInteraction[tail].clear();
	this.criticalInteraction.push(interaction);
	this.addInteraction(interaction);
    }
    InteractionManager.prototype.popCriticalInteraction = function(interaction){
	var tail = this.criticalInteraction.length-1;
	if(tail>=0 && interaction===this.criticalInteraction[tail]){
	    
	    this.criticalInteraction.pop();
	    interaction.clear();
	    if(tail>=1){
		this.criticalInteraction[tail-1].init(this);
	    }
	}
    }
    InteractionManager.prototype.addGlobal = function(item){
	this.globalParts.add(item);
    } 
    InteractionManager.prototype.removeGlobal = function(item){
	this.globalParts.remove(item);
    }
    exports.InteractionManager = InteractionManager;
})(exports)