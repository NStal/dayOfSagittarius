(function(exports){
    var Class = require("../share/util").Class;
    var Interface = require("../../database/interface").Interface;
    var KillingRewardSystem =Class.sub();
    KillingRewardSystem.prototype._init = function(god){
	//god watch the world
	this.god = god;
	this.god.on("shipDead",function(world,ship,byWho){
	    var oriShip = byWho.weapon.ship
	    Interface.getUserData(oriShip.owner,function(data){
		//WARNING TAG
		//this action is not a  atomic action
		//fix it latter
		data.credits+=ship.reward;
		if(typeof data.shipKilled == "number"){
		    data.shipKilled+=1;
		}
		else{
		    data.shipKilled = 1;
		}
		Interface.setUserData(oriShip.owner,data,function(err,obj){
		    world.gateway.syncManager.boardCast({
			reward:true
			,username:oriShip.owner
			,ammount:ship.reward
		    });
		}) 
	    });
	})
    }
    exports.KillingRewardSystem = KillingRewardSystem;
})(exports)