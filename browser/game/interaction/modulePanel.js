(function(exports){
    var Drawable = require("../drawing/drawable").Drawable;
    var ModulePanel = Drawable.sub();
    var Interaction = require("./interaction").Interaction;
    var settings = require("../settings").settings;
    var Point = require("./util").Point;
    ModulePanel.prototype._init = function(manager){
	this.manager = manager;
	this.ship = null;
	this.presentObjects = [];
	this.manager.addGlobal(this);
	var self = this;
	this.handlers = [{
	    where:"battleField"
	    ,type:"mouseUp"
	    ,handler:function(position){
		if(!self.ship){
		    return false;
		}
		var p = new Point(0,0); 
		p.y = settings.height-100;
		for(var i=0;i<self.presentObjects.length;i++){
		    var item = self.presentObjects[i]; 
		    p.x +=100;
		    if(position.distance(p)<40){
			item.callback();
			return true;
		    } 
		}
	    }
	}];
	Interaction.prototype.init.call(this,manager);
    }
    ModulePanel.prototype.onDraw = function(context){
	context.save();
	context.beginPath();
	context.fill();
	context.translate(0,settings.height-100);
	for(var i=0;i<this.presentObjects.length;i++){
	    context.translate(100,0);
	    var item = this.presentObjects[i];
	    item.present(context);
	}
	context.restore();
    }
    ModulePanel.prototype.show = function(ship){
	if(ship){
	    this.ship = ship;
	    this.presentObjects.length = 0;
	    var handlers = this.ship.moduleManager.events.onPresent;
	    console.log(handlers.length);
	    for(var i=0;i<handlers.length;i++){
		handlers[i](this.presentObjects);
	    }
	}else{
	    this.ship = null;
	    this.presentObjects.length = 0;
	}
    }
    exports.ModulePanel = ModulePanel;
})(exports)