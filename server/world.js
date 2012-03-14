(function(exports){
    var World = require("./util").Instance.sub();
    var settings = require("./settings").settings;
    var Ship = require("./ship/shipSoul").ShipSoul;
    //World do these:
    //1.assemble and holds most of the Objects of the game
    //BattleField,Gateway,SyncManager
    //2.manage the time of the game.
    //3.initialize the battleField with 
    //some information(not done yet)
    World.prototype._init = function(worldInfo){
	this.rate = settings.rate;
	this.settings = settings;
	if(!worldInfo){
	    return;
	}
	this.time = worldInfo.time; 
	this.battleField = new (require("./battleFieldSoul").BattleFieldSoul)({
	    time:this.time
	});
	this.gateway = new ServerGateway(this.battleField);
	this.syncManager = new syncManager(this.gateway);
	
    }
    World.prototype.next = function(){
	this.time+=1;
	this.battleField.next(this.time);
	//console.log("time",this.time)
    }
    World.prototype.init = function(){
	this.battleField.add(new Ship({
	    name:"myname"
	    ,position:{x:10,y:10}
	    ,id:0
	}).init());
    }
    exports.World = World;
})(exports)