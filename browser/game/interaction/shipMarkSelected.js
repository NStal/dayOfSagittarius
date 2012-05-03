(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var ShipSelectInteraction = Interaction.sub();
    var ShipMarkSelected = Drawable.sub();
    ShipMarkSelected.prototype._init = function(){
	this.count=8;
	this.color = "#60dfff";
    }
    ShipMarkSelected.prototype.set = function(ship){
	this.ship = ship;
	if(!ship)return;
	this.position = ship.cordinates;
	this.outterRotation = 0;
	this.innerRotation = 0;
	this.outterRotateSpeed = 0.16;
	this.innerRotateSpeed = 0.16;
	this.outterRadLength = Math.PI*1.7;
	this.innerRadLength = Math.PI*1.7;
	this.done =false;
	this.r = this.ship.state.size?this.ship.state.size*1.2:20;
	this.realR = this.r*20;
	this.minAlpha = 0.4;
	this.maxAlpha = 0.6;
	this.alpha = 0.4;
	this.alphaStep = 0.01;
    }
    ShipMarkSelected.prototype.release = function(){
	this.ship = null;
	this.done = false;
    }
    ShipMarkSelected.prototype.drawSelection = function(context){
	if(!this.done){
	    if(this.realR>this.r){
		this.realR*=3.5/5;
	    }
	    else{
		this.done = true;
	    }
	}
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
    }
    ShipMarkSelected.prototype.drawTargetPoint = function(context){
	if(!this.ship.AI.destination.targetPoint){
	    return;
	}
	context.save();
	var p = this.ship.cordinates.sub(this.ship.AI.destination.targetPoint);
	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(-p.x,-p.y);
	context.stroke(); 
	context.beginPath();
	context.arc(-p.x,-p.y,3,0,Math.PI*2);
	context.fillStyle = this.color;
	context.fill();
	context.restore();
    }
    ShipMarkSelected.prototype.drawRoundRoute = function(context){
	if(!this.ship.AI.destination.roundRoute)return;
	context.save();
	var p = this.ship.cordinates.sub(this.ship.AI.destination.roundRoute.point);
	context.beginPath();
	context.arc(-p.x,-p.y
		    ,this.ship.AI.destination.roundRoute.radius
		    ,0,Math.PI*2);
	context.stroke();
	context.beginPath();
	context.arc(-p.x,-p.y
		    ,2
		    ,0,Math.PI*2);
	context.fillStyle = this.color;
	context.fill();
	context.restore();
    }
    ShipMarkSelected.prototype.drawLockTarget = function(context){
	var targets = [];
	var handlers = this.ship.moduleManager.events.onIntent;
	if(!handlers){
	    return;
	}
	for(var i=0,length=handlers.length;i < length;i++){
	    var item = handlers[i];
	    item(targets);
	}
	for(var i=0,length=targets.length;i < length;i++){
	    var target = targets[i].target;
	    var color = targets[i].color;
	    var p = target.cordinates.sub(this.ship.cordinates);
	    context.save();
	    context.beginPath();
	    context.moveTo(0,0);
	    context.lineTo(p.x,p.y);
	    context.lineWidth=0.4;
	    context.strokeStyle = color?color:"green";
	    context.stroke();
	    context.restore();
	}
    }
    ShipMarkSelected.prototype.onDraw = function(context){
	if(!this.ship){
	    return;
	}
	if(this.alpha >=this.maxAlpha
	   || this.alpha <= this.minAlpha){
	    this.alphaStep *= -1;
	}
	this.alpha+= this.alphaStep;
	context.globalAlpha = 1;
	this.drawSelection(context);
	context.strokeStyle = this.color;
	context.globalAlpha = this.alpha;
	this.drawTargetPoint(context);
	this.drawRoundRoute(context);
	this.drawLockTarget(context);
	context.globalAlpha = 1;
    }
    exports.ShipMarkSelected = ShipMarkSelected;
})(exports)
