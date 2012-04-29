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
	this.on("docked",function(){
	    Static.UIDisplayer.starStationInfoDisplayer.show(self.AI.destination.starStation);
	    return;
	    if(Static.username == self.pilot){
		Static.starStationScene.onEnterStation(self.AI.destination.starStation.name);
	    }
	})
    }
    Ship.prototype.onDraw = function(context){
	context.globalAlpha = 0.8;
	context.shadowBlur=10;
	if(this.owner==Static.username){
	    context.fillStyle = "orange";
	    context.shadowColor="orange";
	}
	else{
	    context.fillStyle = "#60dfff"; 
	    context.shadowColor="#60dfff";
	}
	
	if(!this.shipImage){
	    this.shipImage = Static.resourceLoader.get("ship_banshee");
	}
	if(this.shipImage){
	    //context.rotate(Math.PI/2);
	    //context.drawImage(this.shipImage
	//		      ,-15,-25,30,50);
	    //return;
	}
	context.beginPath();
	context.moveTo(-6,-3);
	context.lineTo(6,0);
	context.lineTo(-6,3);
	context.closePath();
	context.fill();
    }
    Ship.prototype.onDead = function(byWho){
	Ship.parent.prototype.onDead.call(this,byWho);
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