(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var ShipSelectInteraction = Interaction.sub();
    var ShipFollowedMark = Drawable.sub();
    ShipFollowedMark.prototype._init = function(){
	this.count=8;
	this.color = "red";
    }
    ShipFollowedMark.prototype.set = function(ship){
	this.ship = ship;
	if(!ship)return;
	
	//this.position = ship.cordinates;
	this.outterRotation = 0;
	this.innerRotation = 0;
	this.outterRotateSpeed = 0.16;
	this.innerRotateSpeed = 0.16;
	this.outterRadLength = Math.PI*1.7;
	this.innerRadLength = Math.PI*1.7;
	if(!this.position || this.position.x ==0)
	    this.position = Point.Point(Static.mousePosition);
	this.done =false;
	this.r = this.ship.state.size?this.ship.state.size*1.2:20;
	this.realR = this.r;//this.r*20;
	this.minAlpha = 0.4;
	this.maxAlpha = 0.6;
	this.alpha = 0.4;
	this.alphaStep = 0.01;
    }
    ShipFollowedMark.prototype.release = function(){
	this.ship = null;
	this.done = false;
	this.hide();
    }
    ShipFollowedMark.prototype.drawSelection = function(context){
	/*if(!this.done){
	    if(this.realR>this.r){
		this.realR*=3.5/5;
	    }
	    else{
		this.done = true;
	    }
	}*/
	var outterR = this.realR;
	var innerR = outterR-3;
	context.strokeStyle = this.color;
	context.beginPath();
	context.arc(0,0,outterR
		    ,this.outterRotation
		    ,this.outterRotation+this.outterRadLength); 
	context.lineWidth = 1.5;
	context.stroke();
	context.beginPath();
	context.arc(0,0,innerR
		    ,this.innerRotation
		    ,this.innerRotation+this.innerRadLength); 
	context.lineWidth = 1;
	context.stroke();
	this.innerRotation-=this.innerRotateSpeed; 
	this.outterRotation+=this.outterRotateSpeed;
	context.beginPath();
	context.moveTo(-9999,0);
	context.lineTo(9999,0);
	context.moveTo(0,-9999);
	context.lineTo(0,9999);
	context.stroke();
    }
    ShipFollowedMark.prototype.moveTo = function(){
	var tp = Static.battleFieldDisplayer.battleFieldToScreen(this.ship.cordinates);
	var targetX = tp.x;
	var targetY = tp.y;
	var min = 5;
	if(Math.abs(targetX-this.position.x)<min){
	    this.position.x = targetX;
	}else{
	    this.position.x += (targetX-this.position.x)*1/2;
	} 
	//not directly set,move it;
	if(Math.abs(targetY-this.position.y)<min){
	    this.position.y = targetY;
	}else{
	    this.position.y += (targetY-this.position.y)*2/3;
	} 
	tp.release();
    }
    ShipFollowedMark.prototype.hide = function(){
	this.parentContainer.remove(this);
    }
    ShipFollowedMark.prototype.onDraw = function(context){
	if(!this.ship){
	    return;
	}
	this.moveTo();
	this.drawSelection(context);
    }
    
    var TargetShipMark = ShipFollowedMark.sub();
    exports.TargetShipMark = TargetShipMark;
    exports.ShipFollowedMark = ShipFollowedMark;
})(exports)
