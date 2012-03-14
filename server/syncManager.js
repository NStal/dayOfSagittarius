(function(exports){
    var Class = require("./util").Class;
    var SyncManager = Class.sub();
    var SyncWorker = require("./syncWorker").SyncWorker;
    var Protocol = require("./protocol");
    //SyncManager do these works:
    //1.manage the syncWorkers connected form all the clients
    //2.boardcast battlefield's instruction to all the clients
    //3.transfer recieved instruction to board
    //4.compress/decompress the data if needed(future function)
    SyncManager.prototype._init = function(gateway){
	this.gateway = gateway;
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
	for(var i=0;i<this.listener.length;i++){
	    var item = this.listener[i];
	    //wrap sequnce
	    //sequnce is a serials nunber
	    //present the current msg index
	    //when server recieve the index jump by 2
	    //means it's quiet probably lost some information
	    item.send(JSON.stringify({
		s:this.syncSequence
		,t:msg.time
		,i:msg.instruction
	    }))
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
		this.workers.splice(i,0);
		return true;
	    }
	}
    }
    exports.SyncManager = SyncManager;
})(exports)