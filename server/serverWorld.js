(function(exports){
    var ServerWorld = require("./share/world").World.sub();
    var settings = require("./localshare/settings").settings;
    var GameInstance = require("./share/gameUtil").GameInstance;
    var Ship = require("./share/ship/shipSoul").ShipSoul;
    var ServerGateway = require("./serverGateway").ServerGateway;
    var SyncManager = require("./syncManager").SyncManager;
    var Interface = require("../database/interface").Interface;
    //ServerWorld do these more than it's parent World:
    //1.Initialize battleField and run it
    //2.built up the ConnectionLayer from client
    ServerWorld.prototype._init = function(worldInfo){
	ServerWorld.parent.prototype._init.call(this,worldInfo);
	console.log(this.galaxy);
	this.setRate(settings.rate);
	this.battleField = new (require("./share/battleFieldSoul").BattleFieldSoul)({
	    time:this.time
	    ,world:this
	});
	this.gateway = new ServerGateway(this.battleField);
	this.syncManager = new SyncManager(this.gateway);
	this.loadShip();
    }
    ServerWorld.prototype.next = function(){
	ServerWorld.parent.prototype.next.call(this);
	this.battleField.next();
    }
    ServerWorld.prototype.init = function(){
	this.testShips = [];
	this.battleField.initByShips(this.testShips,this.map);
    }
    ServerWorld.prototype.loadShip = function(){
	var self = this;
	Interface.getGalaxyShip(this.galaxy.name,function(ships){
	    for(var i=0;i < ships.length;i++){
		var ship = ships[i]; 
		self.battleField.enterShip(ship);
	    }
	})
    }
    ServerWorld.prototype.saveShip = function(handler){
	//currently not implemented
	return;
    }
    exports.ServerWorld = ServerWorld;
})(exports)