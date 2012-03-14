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
	    self.master.removeClient(self);
	}
	this.over = true;
    }
}
SyncWorker.prototype.start = function(){
    var self = this;
    this.ws.on("message",function(msg){
	var instruction = JSON.parse(msg);
	self.master.onmessage(self);
    });
    return this;
}
SyncWoker.prototype.send = function(msg){
    if(this.over)return null;
    this.ws.send(JSON.stringify(msg));
    return this;
}
exports.SyncWorker = SyncWorker;
