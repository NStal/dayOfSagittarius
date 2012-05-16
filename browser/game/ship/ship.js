(function(exports){
    //override server side ship;
    var ShipSoul = require("../share/ship/shipSoul").ShipSoul;
    var Drawable = require("../drawing/drawable").Drawable;
    var Toast = require("../interaction/toast.js").Toast;
    Ship = ShipSoul.sub();
    Ship.prototype._init = function(info){
	var ShipInfoMark = require("../interaction/shipInfoMark").ShipInfoMark;
	Ship.parent.prototype._init.call(this,info);
	var self = this;
	this.scale = 0.5;
	this.on("docked",function(){
	    Static.UIDisplayer.starStationInfoDisplayer.show(self.AI.destination.starStation);
	    return;
	    if(Static.username == self.pilot){
		Static.starStationScene.onEnterStation(self.AI.destination.starStation.name);
	    }
	})
	var color;
	console.log(this.pilot,this.owner,Static.username);
	if(this.pilot==Static.username){
	    color = "orange"
	}else{
	    if(this.owner==Static.username){
		console.log("!!!!!");
		color = "#60dfff";
	    }else{
		color = "red";
	    }
	}
	this.color = color;
    }
    Ship.prototype.onDraw = function(context){
	context.globalAlpha = 0.8;
	context.shadowBlur=2;
	
	context.fillStyle = this.color;
	context.shadowColor=this.color;
	if(!this.shipImage){
	    this.shipImage = Static.resourceLoader.get("ship_banshee");
	}
	if(this.shipImage){
	    context.globalAlpha = 0.9;
	    context.rotate(-Math.PI/2);
	    context.scale(1,1);
	    context.drawImage(this.shipImage
			      ,-15,-25,30,50);
	    return;
	}
	context.beginPath();
	context.moveTo(-6,-3);
	context.lineTo(6,0);
	context.lineTo(-6,3);
	context.closePath();
	context.globalAlpha = 0.3;
	context.fill();
	context.globalAlpha = 1;
	context.strokeStyle = this.color;
	context.stroke();
    }
    Ship.prototype.onDead = function(byWho){
	Ship.parent.prototype.onDead.call(this,byWho);
	return;
	if(this.owner == Static.username){
	    console.log(byWho);
	    Toast("your ship is terminated by "+byWho.weapon.manager.ship.name);
	}else{
	    if(byWho.weapon.manager.ship.ownner == Static.username){
		Toast("your killed "+byWho.weapon.manager.ship.name+" earn "+byWho.weapon.manager.ship.reward+" credits!");
	    }else{
		Toast("your killed "+byWho.weapon.manager.ship.name);
	    }
	    
	}
    }
    //Drawable.mixin(Ship);
    exports.Ship = Ship;
})(exports)