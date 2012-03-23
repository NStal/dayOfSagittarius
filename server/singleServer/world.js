(function(exports){
    var World = require("./util").Instance.sub();
    var settings = require("./settings").settings;
    var GameInstance = require("./gameUtil").GameInstance;
    var Ship = require("./ship/shipSoul").ShipSoul;
    var ServerGateway = require("./serverGateway").ServerGateway;
    var SyncManager = require("./syncManager").SyncManager;
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
	this.galaxy = worldInfo.galaxy;
	this.map = worldInfo.map;
	this.time = worldInfo.time; 
	this.battleField = new (require("./battleFieldSoul").BattleFieldSoul)({
	    time:this.time
	});
	this.gateway = new ServerGateway(this.battleField);
	this.syncManager = new SyncManager(this.gateway);
    }
    World.prototype.next = function(){
	this.time+=1;
	settings.time = this.time;
	GameInstance.nextTick();
	this.battleField.next();
    }
    World.prototype.init = function(){
	this.testShips = [];
	for(var i=0;i < 3;i++){
	    var ship = {
		name:"ship"+i
		,cordinates:{x:100,y:100}
		,id:i
		,category:0
		,ability:{
		    maxSpeed:8
		    ,structure:10000
		    ,maxRotateSpeed:0.2
		    ,speedFactor:0.8
		    ,cpu:10
		    ,size:18
		    ,curveForwarding:true
		}
		,modules:[0]
		,action:{
		    rotateFix:0
		    ,speedFix:0
		}
		,physicsState:{
		    toward:0
		} 
	    };
	    this.testShips.push(ship);
	}
	this.battleField.initByShips(this.testShips,this.map);
    }
    exports.World = World;
})(exports)