(function(exports){
    var Class = require("./util").Class;
    var Protocol = require("./protocol");
    var settings = require("./settings").settings;
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
	console.log(msg);
	if(msg.time==0){
	    who.send({
		cmd:Protocol.clientCommand.sync
		,time:this.battleField.time
		,data:this.battleField.genFieldState()
	    });
	    return;
	}
	//fatal latency
	if(msg.time+settings.delay<=this.battleField.time){
	    console.log("it's",this.battleField.time);
	    console.log("drop outdated message",msg);
	}
	//
	this.battleField.onInstruction(msg);
	who.master.boardCast(msg);
	return {s:0};
    }
    exports.ServerGateway = ServerGateway;
})(exports)