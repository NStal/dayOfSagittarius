(function(exports){
    
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var ShipInfoMark = Drawable.sub();
    ShipInfoMark.prototype._init = function(ship){
	this.color = "black";
	this.ship = ship;
	this.alpha = 0.5;
	this.lineColor = "#42ccff";
	this.bg = Static.resourceLoader.get("ui_shipInfoMarkBG");
	this.userAvatar = new Image();
	this.userAvatar.src = "image/avatar_"+this.ship.owner+".png";
	var self = this;
	this.userAvatar.onload = function(){
	    self.userAvatar.isReady = true;
	}
    }
    ShipInfoMark.prototype.show = function(){
	if(!this.ship)return;
	this.position = this.ship.cordinates;
	Static.interactionDisplayer.add(this);
	return this;
    }
    ShipInfoMark.prototype.hide = function(){
	Static.interactionDisplayer.remove(this);
    }
    ShipInfoMark.prototype.onDraw = function(context){
	if(this.position.x<-Static.battleFieldDisplayer.position.x
	   ||this.position.y<-Static.battleFieldDisplayer.position.y
	   ||this.position.x>-Static.battleFieldDisplayer.position.x+settings.width
	   ||this.position.y>-Static.battleFieldDisplayer.position.y+settings.height){
	    return;
	}
	context.save();
	context.globalAlpha = 0.5;
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
	context.strokeStyle = this.lineColor;
	context.stroke();
	//draw lines
	context.beginPath();
	context.moveTo(size,-size);
	context.translate(60,-60);
	context.lineTo(0,0);
	context.lineTo(20,0);
	context.stroke();
	//drawBG
	context.globalAlpha = 0.5;
	context.translate(-12,-3);
	context.drawImage(this.bg,0,0);
	if(this.userAvatar.isReady){
	    context.save();
	    context.beginPath();
	    context.moveTo(0,19);
	    context.lineTo(0,100);
	    context.lineTo(100,100);
	    context.lineTo(100,0);
	    context.lineTo(19,0);
	    context.closePath();
	    //context.fill();
	    context.clip();
	    context.drawImage(this.userAvatar,5,5);
	    context.restore();
	}
	context.translate(55,14);
	context.font = "8px Delicious";
	context.fillStyle = "white";
	context.textAlign = "left"; 
	context.fillText("pilot:"+this.ship.pilot.substr(0,8),0,0);
	context.restore(); 
    }
    exports.ShipInfoMark = ShipInfoMark;
})(exports)