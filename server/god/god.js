(function(exports){
    var EventEmitter = require("../share/util").EventEmitter;
    var clientCommand = require("../share/protocol").clientCommand;
    var Interface = require("../../database/interface").Interface;
    var BadgeSystem =require("./badgeSystem").BadgeSystem;
    var KillingRewardSystem =require("./killingRewardSystem").KillingRewardSystem;
    
    var God = EventEmitter.sub();
    God.prototype._init = function(){
	this.worlds = [];
	this.badgeSystem = new BadgeSystem(this);
	this.killingRewardSystem = new KillingRewardSystem(this); 
    }
    God.prototype.log = function(){
	var godWord = ["GOD:"];
	for(var i=0;i<arguments.length;i++){
	    godWord.push(arguments[i]);
	}
	console.log.apply(console,godWord);
    }
    God.prototype.watch = function(world){
	var self = this;
	this.worlds.push(world);
	world.battleField.on("shipDead",function(ship,byWho){
	    self.emit("shipDead",world,ship,byWho);
	}); 
	world.battleField.on("shipDocking",function(ship,station){
	    if(ship.removedByGod)return;
	    ship.removedByGod = true;
	    var removeShipCmd = {
		time:world.battleField.time +5
		,cmd:clientCommand.GOD_shipDocked
		,data:{
		    id:ship.id
		}
	    }
	    Interface.getShipById(ship.id,function(ship){
		Interface.changeShipToStation(ship,station.name,function(){
		    world.battleField.onInstruction(removeShipCmd);
		    world.syncManager.boardCast(removeShipCmd);
		})
	    })
	})
    }
    exports.God = God;
})(exports)
