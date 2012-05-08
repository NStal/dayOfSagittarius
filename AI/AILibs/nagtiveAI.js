(function(exports){
    var Static = require("../share/static").Static;
    var EventEmitter = require("../share/util").EventEmitter;
    var NagtiveAI = EventEmitter.sub();
    //NagtiveAI is AI that will fight back it is attacked
    NagtiveAI.prototype._init = function(){
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
		    if(ship.AI.destination.roundRoute)return true;
		    var sc = new SC(ship);
		    var cmd = sc.roundAtTarget(ship.hasTarget,ship.bestShootRange,true);
		    Static.gateway.send(cmd);
		    var tempArr = ship.moduleManager.parts;
		    for(var i=0,length=tempArr.length;i < length;i++){
			var item = tempArr[i];
			if(item.type=="weapon"){
			    var cmd = sc.setModuleTarget(item,ship.hasTarget);
			    Static.gateway.send(cmd);
			    console.log("!!!!!!!!SDADSFASFD");
			}
			item.autoFire = true;
		    }
		    
		    return true;
		    
		},1000);
	    } 
	    ship.hasTarget = ship.toSetTarget;
	    ship.toSetTarget = null;
	})
    }
    exports.NagtiveAI = NagtiveAI;
})(exports)