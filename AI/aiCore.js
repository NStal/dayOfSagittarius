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
    }
    AICore.prototype.next = function(){
	this.ships.length = 0;
	//find ships to control
	for(var i=0;i<this.battleField.parts.length;i++){
	    var item = this.battleField.parts[i];
	    if(item.owner==this.AIName){
		this.ships.push(item);
	    }
	}
	console.log(this.battleField.parts.length);
	//calculate actions
	//currently just move a round
	for(var i=0;i<this.ships.length;i++){
	    var item = this.ships[i];
	    if(typeof item.lastAICheck != "number"){
		item.lastAICheck = Math.floor(Math.random()*10);
	    }
	    item.lastAICheck-=1;
	    if(item.lastAICheck<=0){
		//set initial ai movement
		var cmd = (new SC(item)).moveTo(
		    new Point(item.cordinates.x+(Math.random()-0.5)*500
			      ,item.cordinates.y+(Math.random()-0.5)*500));
		item.lastAICheck = null;
		this.gateway.send(cmd);
	    }
	    
	}
    }
    exports.AICore = AICore;
})(exports)
