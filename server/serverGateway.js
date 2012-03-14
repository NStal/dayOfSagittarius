(function(exports){
    var Class = require("./util").Class;
    var Protocol = require("./protocol");
    var ServerGateway = Class.sub();
    //ServerGateway do these things
    //1.recieve instruction wherever it come from
    //usually form syncManager,but else where  is OK
    //2.validate the instruction
    //3.pass valid instructions to battleField
    //and response to client
    //4.boardCast valid instructions to all the client
    //*note:when a instruction is passed to Battlefield
    //,it's garenteed to be excute,thus 
    //
    //**note:Gateway don't care wether a client is online
    //or offline,because the game world won't hault for it
    ServerGateway.prototype._init = function(bf){
	this.battleField = bf;
    }
    ServerGateway.prototype.onMessage = function(msg,who){
	//request initial sync
	if(msg.t==0){
	    return {
		c:Protocol.clientCommand.sync
		,t:this.battleField.time
		,d:this.battleField.genFieldState()
	    }
	}
	//fatal latency
	if(msg.t<=this.battleField.time){
	    return Protocol.clientOutdate;
	}
	//
	this.battleField.onInstruction(msg);
	return {s:0};
    }
    exports.ServerGateway = ServerGateway;
})(exports)