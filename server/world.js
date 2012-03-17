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
	this.time = worldInfo.time; 
	this.battleField = new (require("./battleFieldSoul").BattleFieldSoul)({
	    time:this.time
	});
	this.gateway = new ServerGateway(this.battleField);
	this.syncManager = new SyncManager(this.gateway);
	
    }
    World.prototype.next = function(){
	this.time+=1;
	GameInstance.nextTick();
	this.battleField.next();
    }
    World.prototype.init = function(){
	this.testShip = new Ship({
	    name:"myname"
	    ,cordinates:{x:10,y:10}
	    ,id:0
	    ,category:0
	    ,ability:{
		maxSpeed:8
		,maxRotateSpeed:0.2
		,speedFactor:0.8
		,cpu:10
		,size:18
		,curveForwarding:true
	    }
	    ,action:{
		rotateFix:0
		,speedFix:0
	    }
	    ,physicsState:{
		toward:0
	    } 
	}).init();
	this.testShip.AI.roundAt({x:300,y:300},100,true);
	this.battleField.add(this.testShip);
    }
    exports.World = World;
})(exports)