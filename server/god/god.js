(function(exports){
    var Class = require("../share/util").Class;
    var clientCommand = require("../share/protocol").clientCommand;
    var Interface = require("../../database/interface").Interface;
    var God = Class.sub();
    God.prototype._init = function(){
	this.worlds = [];
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
	    console.log(ship);
	    self.log(ship.id,"is killed by",byWho.weapon.ship.id);
	    Interface.getUserData(byWho.weapon.ship.owner,function(data){
		data.credits+=ship.reward;
		Interface.setUserData(byWho.weapon.ship.owner,data,function(err,obj){
		    self.log("give award of",ship.reward,"to",byWho.weapon.ship.owner);
		}) 
	    });
	})
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
