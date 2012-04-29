(function(exports){
    var Drawable = require("../drawing/drawable").Drawable;
    var settings = require("../settings").settings;
    var Point = require("./util").Point;
    var MouseEventConsumer = require("../drawaing/mouseEventDistributer").MouseEventConsumer;
    var ModulePanel = Drawable.sub(); 
    ModulePanel.prototype._init = function(){
	this.ship = null;
	this.presentObjects = [];
	this.handlers = [];
	var self = this;
    }
    ModulePanel.prototype.onDraw = function(context){
	/*context.save();
	context.beginPath();
	context.fill();
	context.translate(0,settings.height-100);
	for(var i=0;i<this.presentObjects.length;i++){
	    context.translate(100,0);
	    var item = this.presentObjects[i];
	    item.present(context);
	}
	context.restore();*/
    }
    ModulePanel.prototype.show = function(ship){
	if(ship){
	    this.ship = ship;
	    this.presentObjects.length = 0;
	    var handlers = this.ship.moduleManager.events.onPresent;
	    for(var i=0;i<handlers.length;i++){
		handlers[i](this.presentObjects);
	    }
	    this.parts.length = 0;
	    var startX = 100;
	    for(var i=0,length=this.presentObjects.length;i < length;i++){
		var item = this.presentObjects[i];
		var mItem = new ModuleInteractItem(item.present,item.onActive,item.onActive2);
		mItem.position.x = startX,startX+=100;
		mItem.position.y = settings.height-100;
		this.add(mItem);
	    }
	}else{
	    this.ship = null;
	    this.presentObjects.length = 0;
	    this.removeAll();
	}
    }
    MouseEventConsumer.mixin(ModulePanel); 
    var ModuleInteractItem = Drawable.sub()
    ModuleInteractItem.prototype._init = function(onDraw,handler,handler2){
	this.onDraw = function(context){
	    onDraw(context,this.position);
	};
	this.consumeType.mouseUp = true;
	this.consumeType.mouseDown = true;
	this.consumeType.rightMouseUp = true;
	this.consumeType.rightMouseDown = true;
	this.mouseReactSize = 50;
	this.on("mouseUp",function(e){
	    if(handler)
		handler();
	    return true;
	})
	this.on("mouseDown",function(e){
	    return true;
	})
	
	this.on("rightMouseUp",function(e){
	    if(handler2)
		handler2();
	    return true;
	})
	this.on("rightMouseDown",function(e){
	    return true;
	})
    }
    /*ModuleInteractItem.prototype.rectJudgementCustom = function(p){
	console.log(p.toString());
	return true;
    }*/
    MouseEventConsumer.mixin(ModuleInteractItem);
    exports.ModulePanel = ModulePanel;
})(exports)