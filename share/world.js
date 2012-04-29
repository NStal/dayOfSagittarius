(function(exports){
    var Instance = require("./util").Instance;
    var Static = require("./static").Static;
    var GameInstance = require("./gameUtil").GameInstance;
    var Ship = require("./ship/shipSoul").ShipSoul;
    //World is a Base class for other world like:AI World,ClientWorld,ServerWorld
    //World do these:
    //0.World represent ONE galaxy
    //1.World is the only real running instance in the program to make sure 
    //all the game procedures are run in order,while all the other use a faked instance 
    //called GameInstance
    //2.Initialize all the Static classes or create other Class-Instance used later 
    var World = Instance.sub();
    World.prototype._init = function(worldInfo){
	if(!worldInfo){
	    return;
	}
	//set GameInstanceRate
	GameInstance.setTickPerUnitTime(worldInfo.rate); 
	//set Debug
	Instance.toggleDebug();
	//set rate of the game
	this.setRate(worldInfo.rate);
	//Which galaxy is this world
	this.galaxy = worldInfo.galaxy;
	//starttime of the server
	this.time = worldInfo.time;
	//make sync for garenteed 
	//see Class Instance in util.js
	this.garenteed = true;
    }
    World.prototype.next = function(){
	this.time+=1;
	Static.time = this.time;
	GameInstance.nextTick();
	this.emit("nextTick",this.time);
    }
    exports.World = World;
})(exports)