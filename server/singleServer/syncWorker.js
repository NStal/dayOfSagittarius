var Class = require("./util").Class
var SyncWorker = Class.sub();
//SyncWoker only do simple work
//just a wrap of webSocket ws module
SyncWorker.prototype._init = function(ws,master){
    var self = this; 
    this.ws = ws;
    this.master = master;
    this.ws.onclose = function(){
	if(self.master){
	    console.log("lost client");
	    self.master.removeClient(self.ws);
	}
	this.over = true;
    }
}
SyncWorker.prototype.start = function(){
    var self = this;
    this.ws.on("message",function(msg){
	var instruction = JSON.parse(msg);
	console.log("msg recieved",msg); 
	self.master.onMessage(instruction,self);
    });
    return this;
}
SyncWorker.prototype.send = function(msg){
    if(this.over)return;
    //console.log("send msg",msg);

    this.ws.send(JSON.stringify(msg));
    return this;
}
exports.SyncWorker = SyncWorker;
