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
    }
    AICore.prototype.start = function(){
	AICore.parent.prototype.start.call(this);
	///return;
	var ships = [];
	for(var i=0;i<this.battleField.parts.length;i++){
	    var item = this.battleField.parts[i];
	    if(item.owner==this.AIName){
		ships.push(item);
	    }
	}
	var cmd =(new SC(ships[0])).setDockStation(this.battleField.getStarStationByName("Nolava-I"));
	this.gateway.send(cmd);
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
