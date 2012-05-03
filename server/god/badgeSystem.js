(function(exports){
    var Class = require("../share/util").Class;
    var Interface = require("../../database/interface").Interface;
    var BadgeSystem =Class.sub();
    BadgeSystem.prototype._init = function(god){
	//god watch the world
	this.god = god;
	this.god.on("shipDead",function(world,ship,byWho){
	    var oriShip = byWho.weapon.ship;
	    world.gateway.syncManager.boardCast({
		badge:true
		,pilot:oriShip.pilot
		,owner:oriShip.owner
		,content:"killed a ship"
	    })
	})
    }
    exports.BadgeSystem = BadgeSystem;
})(exports)