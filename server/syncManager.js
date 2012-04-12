(function(exports){
    var Class = require("./share/util").Class;
    var SyncManager = Class.sub();
    var Protocol = require("./share/protocol");
    var Class = require("./share/util").Class
    var SyncWorker = Class.sub();
    //SyncWoker is a object that SyncManager passed to Gateway
    //1.SyncWorker is a simple wrapper of the webSocket incase of the futher ws version change
    //2.SyncWorker do some basic parse work from the raw message
    SyncWorker.prototype._init = function(ws,manager){
	var self = this; 
	this.ws = ws;
	this.manager = manager;
	this.ws.onclose = function(){
	    if(self.manager){
		console.log("lost client");
		self.manager.removeClient(self.ws);
	    }
	    this.over = true;
	}
    }
    SyncWorker.prototype.start = function(){
	var self = this;
	this.ws.on("message",function(msg){
	    var instruction = JSON.parse(msg);
	    //console.log("msg recieved",msg); 
	    self.manager.onMessage(instruction,self);
	});
	return this;
    }
    SyncWorker.prototype.send = function(msg){
	if(this.over)return;
	//console.log("send msg",msg);

	this.ws.send(JSON.stringify(msg));
	return this;
    }
    //SyncManager Only worked with gateway:
    //0.recieve ws(webSocket) object,parse into SyncWorker
    //1.manage the syncWorkers connected form all the clients
    //2.boardcast battlefield's instruction from the gateway to all the clients 
    //3.pass the syncWorker to the gateway
    SyncManager.prototype._init = function(gateway){
	this.gateway = gateway;
	this.gateway.syncManager = this;
	this.workers = [];
	var self = this;
	this.syncSequence = 0;
    }
    SyncManager.prototype.onMessage = function(msg,who){
	this.gateway.onMessage(msg,who);
    }
    SyncManager.prototype.boardCast =function(msg){
	this.syncSequence+=1;
	console.log("boardcast at sequence:",this.syncSequence);
	msg.sequnce = this.syncSequence;
	for(var i=0;i<this.workers.length;i++){
	    var item = this.workers[i];
	    //wrap sequnce
	    //sequnce is a serials nunber
	    //present the current msg index
	    //when server recieve the index jump by 2
	    //means it's quiet probably lost some information
	    item.send(msg);
	}
    }
    SyncManager.prototype.addClient = function(ws){
	var self = this;
	this.workers.push(new SyncWorker(ws,this).start());
    }
    SyncManager.prototype.removeClient = function(ws){
	for(var i=0;i<this.workers.length;i++){
	    var item = this.workers[i]
	    if(item.ws === ws){
		console.log("removeClient done");
		this.workers.splice(i,1);
		return true;
	    }
	}
    }
    exports.SyncWorker = SyncWorker; 
    exports.SyncManager = SyncManager;
})(exports)