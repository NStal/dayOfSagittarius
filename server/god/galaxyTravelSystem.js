(function(exports){
    var Class = require("../share/util").Class;
    var Interface = require("../../database/interface").Interface;
    var GalaxyTravelSystem =Class.sub();
    var godUtil = require("./godUtil/godUtil");
    var cmdEnum = require("../share/protocol").clientCommand;
    GalaxyTravelSystem.prototype._init = function(god){
	//god watch the world
	this.god = god;
	this.god.on("shipPassStarGate",function(world,ship,gate){
	    godUtil.enterShipFromGate(
		gate.to
		,world.galaxy.name
		,ship,function(){
		    console.log("so?????");
		    var cmd = {
			cmd:cmdEnum.GOD_shipJumped
			,data:{id:ship.id 
			      }
			,time:world.time+5
		    };
		    world.battleField.onInstruction(cmd);
		    world.syncManager.boardCast(cmd);
		});
	})
    }
    exports.GalaxyTravelSystem = GalaxyTravelSystem;
})(exports)