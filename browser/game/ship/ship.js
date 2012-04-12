(function(exports){
    //override server side ship;
    var ShipSoul = require("../share/ship/shipSoul").ShipSoul;
    var Drawable = require("../drawing/drawable").Drawable;
    var Toast = require("../interaction/toast.js").Toast;
    var ShipInfoMark = require("../interaction/shipInfoMark").ShipInfoMark;
    Ship = ShipSoul.sub();
    Ship.extend(Drawable);
    Ship.prototype._init = function(info){
	Ship.parent.prototype._init.call(this,info);
	this.onDraw = info.draw;
	this.infoMark = new ShipInfoMark(this);
	this.infoMark.show();
    }
    Ship.prototype.onDead = function(byWho){
	Ship.parent.prototype.onDead.call(this,byWho);
	this.infoMark.hide();
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
    exports.Ship = Ship;
})(exports)