(function(exports){
    var AICore = require("./share/gameUtil").GameInstance.sub();
    var SC = require("./share/shipController").ShipController;
    var Point = require("./share/util").Point;
    AICore.prototype._init = function(battleField,gateway){
	this.battleField = battleField;
	this.gateway = gateway;
	this.setRate(3);
	this.ships = [];
	this.AIName = "AI";
	this.chaseDistance = 300;
	this.checkInterval = 30; 
	
	var self = this;
	this.battleField.on("shipInitialized",function(ships){
	    var tempArr = ships; 
	    for(var i=0,length=tempArr.length;i < length;i++){
		var item = tempArr[i];
		if(item.owner==self.AIName){
		    self.ships.push(item); 
		    self.attachShipAI(item);
		}
	    }
	})
    }
    AICore.prototype.start = function(){
	AICore.parent.prototype.start.call(this);
    }
    //doAndTry:
    //do it right now if failed repeat it at interval
    //until it succeceed
    function doAndTry(todo,interval,startHalt){
	if(typeof interval != "number"){
	    interval = 1000;
	}
	if(typeof startHalt != "number"){
	    startHalt = 0;
	}
	console.log("!!!!");
	setTimeout(function(){
	    var result = todo();
	    if(result)return;
	    doAndTry(todo,interval,interval);
	},startHalt);
    }
    AICore.prototype.attachShipAI = function(ship){
	var self = this;
	ship.on("hit",function(byWho){
	    if(ship.toSetTarget){
		return;
	    }
	    ship.toSetTarget = byWho.weapon.ship;
	})
	ship.on("next",function(){
	    if(ship.hasTarget){
		if(ship.hasTarget.isDead)ship.hasTarget = null;
		if(ship.hasTarget.isMissed)ship.hasTarget = null;
		if(ship.hasTarget)return;
	    }
	    if(!ship.toSetTarget)return;
	    //no target return
	    if(ship.toSetTarget.isDead)ship.toSetTarget = null;
	    if(ship.toSetTarget.isMissed)ship.toSetTarget = null;
	    if(!ship.toSetTarget)return; 
	    //has target but not round at target 
	    if(!ship.AI.destination.roundRoute){
		if(!ship.bestShootRange){
		    ship.bestShootRange = 100;
		} 
		doAndTry(function(){
		    console.log("!!!!");
		    if(ship.AI.destination.roundRoute)return true;
		    var cmd = (new SC(ship)).roundAtTarget(ship.toSetTarget,ship.bestShootRange,true);
		    self.gateway.send(cmd);
		    var cmd = (new SC())
		},1000);
	    } 
	    ship.hasTarget = ship.toSetTarget;
	    ship.toSetTarget = null;
	})
    } 
    AICore.prototype.next = function(){
	return;
	this.ships.length = 0;
	//find ships to control
	for(var i=0;i<this.battleField.parts.length;i++){
	    var item = this.battleField.parts[i];
	    if(item.owner==this.AIName){
		this.ships.push(item);
		item.checkPoint = item.checkPoint?item.checkPoint+1:1;
	    }
	}
	//calculate actions
	//currently just move a round
	var LockInstance
	for(var i=0;i<this.ships.length;i++){
	    var item = this.ships[i];
	    item.checkPoint++;
	    if(item.AI.destination.target){
		//fire all;
		for(var i=0;i<item.moduleManager.parts.length;i++){
		    var m = item.moduleManager.parts[i];
		    if(m.type=="weapon" && m.isReady()){
			var cmd = (new SC(item)).activeModule(m);
			this.gateway.send(cmd);
		    }
		}
	    }
	    if(item.checkPoint<this.checkInterval)continue;
	    item.checkPoint = 0;
	    for(var j=0;j<this.battleField.parts.length;j++){
		var target = this.battleField.parts[j];
		if(target.type!="ship")continue;
		if(target.owner==this.AIName)continue;
		if(target.cordinates.distance(item.cordinates)<this.chaseDistance){
		    var cmd = (new SC(item)).lockAt(target);
		    this.gateway.send(cmd);
		    var cmd = (new SC(item)).chaseTarget(target);
		    this.gateway.send(cmd);
		    console.log("~~~")
		}
	    }
	}
    }
    exports.AICore = AICore;
})(exports)
