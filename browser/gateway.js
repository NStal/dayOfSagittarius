(function(exports){
    var Class = require("./util").Class;
    var Gateway = Class.sub();
    Gateway.prototype._init = function(battleField){
	this.battleField = battleField;
    }
    Gateway.prototype.onConnect = function(worker){
	//require sync
	worker.send({time:0});
    }
    Gateway.prototype.onMessage = function(msg,worker){
	console.log("recieve msg",msg);
	if(msg.cmd==1){
	    console.log("sync initial data from server");
	    this.battleField.initByShips(msg.data.ships); 
	    this.battleField.time = msg.time;
	    this.battleField.ready = true;
	    return;
	}
	if(msg.cmd==2){
	    if(msg.time>this.battleField.time){
		this.battleField.onInstruction(msg);
	    }else{
		console.log("recieve out dated server instruction");
	    }
	}
	if(msg.cmd==3){
	    if(msg.time>this.battleField.time){
		this.battleField.onInstruction(msg);
	    }else{
		console.log("recieve out dated server instruction");
	    }
	}
	if(msg.cmd==4){
	    if(msg.time>this.battleField.time){
		this.battleField.onInstruction(msg);
	    }else{
		console.log("recieve out dated server instruction");
	    }
	}
    }
    Gateway.prototype.onDisconnect = function(worker){
	if(this.isTrying)return;
	this.battleField.ready = false;
	var self = this;
	var id = setInterval(function(){
	    self.isTrying = true;
	    if(!worker.ready)
		self.battleField.world.syncWorker.start();
	    else{
		clearInterval(id);
		self.isTrying = false;
	    }
	    
	},1000)
    }
    exports.Gateway = Gateway;
})(exports)