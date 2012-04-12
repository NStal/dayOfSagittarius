(function(exports){
    var Class = require("./share/util").Class
    var SyncWorker = Class.sub();
    var WebSocket = require("ws");
    //SyncWorker do simple things,and know nothing about the game
    //1.parse data to json and pass it to gateway
    //2.inform gateway on close and on open
    //3.change send data to string and do some format
    //Client side worker
    SyncWorker.prototype._init = function(host,port,gateway){
	this.setServer(host,port);
	this.ws = null;
	this.gateway = gateway;
    }
    SyncWorker.prototype.start = function(){
	this.ws = new WebSocket("ws://"+this.host+":"+this.port);
	var self = this;
	this.ws.on("open",function(){
	    self.gateway.onConnect(self);
	    self.ready = true;
	});
	this.ws.on("message",function(msg){
	    var data = JSON.parse(msg);
	    self.gateway.onMessage(data,self);
	    console.log("recieve",data);
	});
	this.ws.on("close",function(){
	    self.gateway.onDisconnect(self);
	    self.ready = false;
	    self.ws = null;
	});
    }
    SyncWorker.prototype.setServer = function(host,port){
	this.host = host;
	this.port = port;
    }
    SyncWorker.prototype.close = function(){
	if(this.ws)this.ws.close();
    }
    SyncWorker.prototype.send = function(msg){
	if(typeof msg!="string"){
	    msg = JSON.stringify(msg);
	}
	if(this.ws){
	    console.log("send",msg);
	    this.ws.send(msg);
	    return true;
	}else{
	    return false;
	}
    }
    exports.SyncWorker = SyncWorker;
})(exports)