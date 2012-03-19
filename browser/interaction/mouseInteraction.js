(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Sprite = require("./drawing/drawable").Sprite;
    var Drawable = require("./drawing/drawable").Drawable;
    var MouseSprite = Drawable.sub();
    MouseSprite.prototype._init = function(){
	this.count = 10;
	this.color = "#60dfff";
	this.types = {
	    normal:0
	    ,onShip:1
	    ,onBattleField:2
	    ,attack:3
	    ,onGalaxy:1
	} 
	this.size = 20;
	this.rotation = 0;
    }
    MouseSprite.prototype.drawNormal = function(context){
	context.save();
	context.fillStyle = this.color; 
	context.strokeStyle = context.fillStyle;
	this.rotation +=0.25;
	for(var i=0;i<4;i++){
	    context.rotate(Math.PI/2);
	    context.beginPath();
	    context.moveTo(this.size*2/5,0);
	    context.lineTo(this.size,this.size*1/8);
	    context.lineTo(this.size,-this.size*1/8);
	    context.closePath();
	    context.fill();
	}
	context.restore();
    }
    MouseSprite.prototype.drawOnShip = function(context){
	this.rotation +=0.25;
	context.save();
	context.beginPath();
	context.strokeStyle = this.color; 
	for(var i=0;i<4;i++){
	    context.rotate(Math.PI/2);
	    context.beginPath();
	    context.arc(0,0,this.size*3/4,-Math.PI/6,Math.PI/6);
	    context.stroke(); 
	    context.fillStyle = this.color;
	    context.beginPath();
	    context.moveTo(this.size*2/5,0);
	    context.lineTo(this.size,this.size*1/8);
	    context.lineTo(this.size,-this.size*1/8);
	    context.closePath();
	    context.fill(); 
	}
	context.restore();
    }
    MouseSprite.prototype.drawAttack = function(context){
	var _color = this.color;
	this.color = "red";
	this.drawOnShip(context);
	this.color = _color;
	return;
    }
    MouseSprite.prototype.onDraw = function(context){
	switch(this.type){
	case this.types.normal:
	    this.drawNormal(context);
	    break;
	case this.types.onShip:
	    this.drawOnShip(context);
	    break;
	case this.types.attack:
	    this.drawAttack(context);
	    break;
	}
    }
    var MouseInteraction = Interaction.sub();
    
    MouseInteraction.prototype._init = function(){
	var self = this;
	this.handlers = [
	    {
		where:"game"
		,type:"mouseMove"
		,handler:function(position){
		    self.pointer.position = position;
		}
	    }
	];
	this.pointer = new MouseSprite();
	this.pointer.type = this.pointer.types.normal;
    }
    MouseInteraction.prototype.init = function(manager){
	MouseInteraction.parent.prototype.init.call(this,manager);
	this.manager.addGlobal(this.pointer);
    }
    MouseInteraction.prototype.clear = function(){
	MouseInteraction.parent.prototype.clear.call(this);
	this.manager.removeGlobal(this.pointer);
    }
    MouseInteraction.prototype.show = function(){
	this.pointer.show = true;
	return this;
    }
    MouseInteraction.prototype.unshow = function(){
	this.pointer.show = false;
    }
    
    exports.MouseInteraction = MouseInteraction;
    exports.MouseSprite = MouseSprite;
})(exports)