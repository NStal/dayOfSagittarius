(function(exports){
    
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var ShipInfoMark = Drawable.sub();
    ShipInfoMark.prototype._init = function(ship){
	this.color = "black";
	this.ship = ship;
	this.alpha = 1;
	this.minAlpha = 0.5;
	this.lineColor = "#42ccff";
	this.bg = Static.resourceLoader.get("ui_shipInfoMarkBG");
	this.userAvatar = new Image();
	this.userAvatar.src = "image/avatar_"+this.ship.owner+".png";
	var self = this;
	this.userAvatar.onload = function(){
	    self.userAvatar.isReady = true;
	}
	this.maxHeight  = 100;
	this.resetEffect();
    }
    ShipInfoMark.prototype.show = function(){
	if(!this.ship)return;
	this.position = this.ship.cordinates;
	Static.interactionDisplayer.add(this);
	this.resetEffect();
	return this;
    }
    ShipInfoMark.prototype.hide = function(){
	Static.interactionDisplayer.remove(this);
	this.resetEffect();
    }
    ShipInfoMark.prototype.resetEffect = function(){
	this.height = 1;
	this.alpha = 1;
    }
    ShipInfoMark.prototype.onDraw = function(context){
	if(!Static.interactionDisplayer.isPointInScreen(this.position)){
	    this.resetEffect();
	    return;
	}
	context.save();
	context.globalAlpha = this.alpha;
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
	context.translate(-12,-3);
	if(this.height<this.maxHeight){
	    context.beginPath(); 
	    this.height+=10;
	    context.rect(0,0,300,this.height);
	    context.clip();
	} 
	if(this.alpha>this.minAlpha){
	    this.alpha*=0.95;
	}
	context.drawImage(this.bg,0,0);
	if(this.userAvatar.isReady){
	    context.save();
	    context.beginPath();
	    context.moveTo(0,19);
	    context.lineTo(0,this.height);
	    context.lineTo(100,this.height);
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