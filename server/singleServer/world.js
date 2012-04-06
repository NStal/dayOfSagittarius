(function(exports){
    var World = require("./util").Instance.sub();
    var settings = require("./settings").settings;
    var GameInstance = require("./gameUtil").GameInstance;
    var Ship = require("./ship/shipSoul").ShipSoul;
    var ServerGateway = require("./serverGateway").ServerGateway;
    var SyncManager = require("./syncManager").SyncManager;
    var Interface = require("../database/interface").Interface;
    //World do these:
    //1.assemble and holds most of the Objects of the game
    //BattleField,Gateway,SyncManager
    //2.manage the time of the game.
    //3.initialize the battleField with 
    //some information(not done yet)
    World.prototype._init = function(worldInfo){
	this.setRate(settings.rate);
	this.settings = settings;
	if(!worldInfo){
	    return;
	}
	this.interface = new Interface();
	this.galaxy = worldInfo.galaxy;
	this.map = worldInfo.map;
	this.time = worldInfo.time; 
	this.battleField = new (require("./battleFieldSoul").BattleFieldSoul)({
	    time:this.time
	});
	this.gateway = new ServerGateway(this.battleField);
	this.syncManager = new SyncManager(this.gateway);
	var self = this;
	var tty = require("tty");
	//block ctrl c for exit;
	process.openStdin().on("keypress", function(chunk, key){
	    if(key && key.name === "s" && key.ctrl){
		self.saveShip(function(){
		    console.log("saved");
		});
	    } 
	    if(key && key.name === "c" && key.ctrl){
		if(self._againExit){
		    process.kill();
		}
		console.log("really exit? again");
		self._againExit = true;
		return;
	    }
	    self._againExit = false;
	    return true;
	});
	
	var mongodb =  require("mongodb");
	var server = new mongodb.Server("localhost"
					,27017
		       ,{})
	,connector = new mongodb.Db("dayOfSagittarius"
				    ,server
				    ,{});
	this.connector = connector;
	//tty.setRawMode(true);
	this.loadShip();
    }
    World.prototype.next = function(){
	this.time+=1;
	settings.time = this.time;
	GameInstance.nextTick();
	this.battleField.next();
    }
    World.prototype.init = function(){
	this.testShips = [];
	this.battleField.initByShips(this.testShips,this.map);
    }
    World.prototype.loadShip = function(){
	var self = this;
	this.interface.getGalaxyShip(this.galaxy.name,function(ships){
	    for(var i=0;i < ships.length;i++){
		var ship = ships[i]; 
		self.battleField.enterShip(ship);
	    }
	})
    }
    World.prototype.saveShip = function(handler){
	//currently not implemented
	return;
    }
    exports.World = World;
})(exports)