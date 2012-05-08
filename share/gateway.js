(function(exports){
    var EventEmitter = require("./util").EventEmitter;
    var Gateway = EventEmitter.sub();
    var Static = require("./static").Static;
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
	this.sequnce = 0;
    }
    Gateway.prototype.getAuthInfo =function(){
	return {username: this.username};
    }
    Gateway.prototype.send = function(msg){
	msg.auth = this.getAuthInfo();
	this.worker.send(msg);
    }
    Gateway.prototype.onMessage = function(msg,worker){
	//console.log("recieve msg",msg);
	//In future version
	//Here all cmd should be validated 
	if(msg.sequnce!=this.sequnce+1){
	    alert("networkerror!");
	    return;
	}
	this.sequnce++;
	if(msg.badge){
	    if(msg.owner == Static.username)
		Toast("you "+msg.content);
	    return;
	} 
	if(msg.reward){
	    if(msg.username == Static.username)
		Toast("you gain "+msg.ammount);
	    return;
	}
	if(msg.outDated){
	    alert("out dated!!!");
	    this.emit("outdate");
	    return;
	}
	if(typeof msg.channel!="undefined"){
	    this.emit("chatMessage",msg);
	    return;
	}
	if(msg.cmd==1){
	    this.battleField.initialize(msg.data.ships,Static.world.galaxy);
	    /*this.battleField.initEnvironment
	    this.battleField.initShips(msg.data.ships,Static.world.galaxy);*/
	    this.sequnce = msg.sequnce;
	    Static.world.setTime(msg.time);
	    //console.log(msg);
	    this.emit("init");
	    this.battleField.ready = true;
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
	this.isConnected = false; 
	if(this.isTrying)return;
	this.battleField.ready = false;
	this.emit("disconnect");
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