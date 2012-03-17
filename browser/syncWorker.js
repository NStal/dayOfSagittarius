(function(exports){
    var Class = require("./util").Class
    var SyncWorker = Class.sub();
    //SyncWorker do simple things,and know nothing about the game
    //1.parse data to json and pass it to gateway
    //2.inform gateway on close and on open
    //3.change send data to string and do some format
    //Client side worker
    SyncWorker.prototype._init = function(url,gateway){
	this.url = url;
	this.ws = null;
	this.gateway = gateway;
    }
    SyncWorker.prototype.start = function(){
	this.ws = new WebSocket(this.url);
	var self = this;
	this.ws.onopen = function(){
	    self.gateway.onConnect(self);
	    self.ready = true;
	}
	this.ws.onmessage = function(msg){
	    var data = JSON.parse(msg.data);
	    self.gateway.onMessage(data,self);
	}
	this.ws.onclose = function(){
	    self.gateway.onDisconnect(self);
	    self.ready = false;
	    self.ws = null;
	}
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