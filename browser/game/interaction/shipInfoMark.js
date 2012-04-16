(function(exports){
    
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var ShipInfoMark = Drawable.sub();
    ShipInfoMark.prototype._init = function(ship){
	this.color = "black";
	this.ship = ship;
	this.alpha = 0.6;
    }
    ShipInfoMark.prototype.show = function(){
	if(!this.ship)return;
	this.position = this.ship.cordinates;
	Static.interactionManager.add(this);
    }
    ShipInfoMark.prototype.hide = function(){
	this.ship = null;
	Static.interactionManager.remove(this);
    }
    ShipInfoMark.prototype.onDraw = function(context){
	context.save();
	context.scale(1/Static.battleFieldDisplayer.scale,
		      1/Static.battleFieldDisplayer.scale);
	//drawMark
	var size = 14;
	var pad = size*0.3;
	context.beginPath();
	for(var i=0;i<4;i++){
	    context.moveTo(size-pad,size);
	    context.lineTo(size,size);
	    context.lineTo(size,size-pad);
	    context.rotate(Math.PI/2);
	}
	
	context.globalAlpha = this.alpha; 
	context.strokeStyle = this.color;
	context.stroke();
	//draw lines
	context.beginPath();
	context.moveTo(size,-size);
	context.translate(40,-40);
	context.lineTo(0,0);
	context.lineTo(50,0);
	context.stroke();
	//draw text
	context.beginPath();
	context.textAlign = "center";
	context.fillText(this.ship.name,25,-2);
	var __hp = this.ship.state.structure/1000 + "k/" + this.ship.ability.structure/1000+"k";
	context.translate(-40,40);
	context.beginPath();
	context.moveTo(size,-size);
	context.translate(40,-25);
	context.lineTo(0,0);
	context.lineTo(50,0);
	context.stroke();
	context.beginPath();
	context.fillText(__hp,25,-2);
	context.restore();
	
    }
    exports.ShipInfoMark = ShipInfoMark;
})(exports)