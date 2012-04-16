(function(exports){
    var Class = require("./util").Class;
    var Gateway = Class.sub();
    var settings = require("./settings").settings;
    //Gateway is the middleware between server and client battleField
    //Gateway add authInfo to every command sent to the server
    //and start the initial sync 
    //and validate the server comman in case that the connection is broken
    //we can recover it.
    Gateway.prototype._init = function(battleField){
	this.battleField = battleField;
    }
    Gateway.prototype.onConnect = function(worker){
	//clear battleField
	//WARNING TAG this may cause memory leak
	//Some interaction instance may not released 
	//require sync
	console.log("conntecting!");
	this.isConnected = true; 
	this.worker = worker; 
	this.send({time:0});
    }
    Gateway.prototype.getAuthInfo =function(){
	return {username: this.username};
    }
    Gateway.prototype.send = function(msg){
	msg.auth = this.getAuthInfo();
	this.worker.send(msg);
    }
    Gateway.prototype.onMessage = function(msg,worker){
	console.log("recieve msg",msg);
	//In future version
	//Here all cmd should be validated
	if(msg.cmd==1){
	    this.battleField.initShips(msg.data.ships,Static.world.galaxy);
	    clientWorld.setTime(msg.time);
	    console.log(msg.time);
	    this.battleField.ready = true;
	    Static.waitingPage.endWaiting();
	    return;
	}
	if(msg.cmd){
	    if(msg.time>this.battleField.time){
		this.battleField.onInstruction(msg);
	    }else{
		console.log("recieve out dated server instruction");
	    }
	}
    }
    Gateway.prototype.onDisconnect = function(worker){
	Static.waitingPage.startWaiting();
	this.isConnected = false;
	if(this.isTrying)return;
	this.battleField.ready = false;
	var self = this;
	var id = setInterval(function(){
	    self.isTrying = true;
	    if(!worker.ready && !self.isConnected)
		self.battleField.world.syncWorker.start();
	    else{
		clearInterval(id);
		self.isTrying = false;
	    } 
	},1000)
    }
    exports.Gateway = Gateway;
})(exports)