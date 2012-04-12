(function(exports){
    var Class = require("./share/util").Class;
    var Protocol = require("./share/protocol");
    var settings = require("./localshare/settings").settings;
    var ServerGateway = Class.sub();
    var Interface = require("../database/interface").Interface;
    //ServerGateway recieve syncWorker passed from syncManager
    //1.validate the information recieved
    //2.passed validated data recieved from syncManager to battleField
    //3.boardcast the validated data recieved from syncManager to all client
    //4.boardcast the data from battleField to all client(such as a ship goes to the another galaxy)
    ServerGateway.prototype._init = function(bf){
	this.battleField = bf;
	this.battleField.gateway = this;
	var self = this;
	bf.addListener({
	    type:"onPassStarGate"
	    ,handler:function(ship,gate){
		self.onPassStarGate(ship,gate);
	    }
	})
    }
    ServerGateway.prototype.onPassStarGate = function(ship,gate){
	try{
	    var g = require("./share/resource/map/"+gate.to)[gate.to];
	}
	catch(e){
	    console.trace();
	    console.log("pass invalid gate");
	    return;
	}
	var gs = require("./share/resource/galaxies").GALAXIES;
	var gInfo = null;
	for(var i=0;i < gs.length;i++){
	    if(gs[i].name == gate.to){
		gInfo = gs[i];
		break;
	    }
	}
	if(!gInfo){
	    console.log("can't find galaxy info of",gate.to);
	    console.trace();
	    return;
	} 
	console.log("try connecting","ws://"+gInfo.server.host+":"+gInfo.server.port);
	var sock = new (require("ws"))("ws://"+gInfo.server.host+":"+gInfo.server.port);
	var self = this;
	sock.on("open",function(){
	    console.log("SEND！！！！");
	    sock.send(JSON.stringify({
		cmd:7
		,data:{
		    ship:ship.toData()
		    ,from:self.battleField.galaxy.name
		}
	    }));
	})
	
    }
    ServerGateway.prototype.onMessage = function(msg,who){
	//request initial sync
	console.log(msg);
	var self = this;
	//no auth info
	if(!msg.auth||!msg.auth.username){
	    console.log("recieved unauthed package");
	    if(msg.cmd!=Protocol.clientCommand.comeFromGate){
		//this come from server 
		//no need to ...
		console.log("recieve server command");
		return;
	    }
	}
	if(msg.time==0){
	    Interface.getUserData(msg.auth.username,
				function(user){
				    who.send({
					cmd:Protocol.clientCommand.sync
					,time:self.battleField.time
					,data:self.battleField.genFieldState()
					,user:{
					    credits:user.credits
					}
				    });
				})
	    return;
	}
	if(msg.cmd==Protocol.clientCommand.comeFromGate){
	    //current alpha version don't judge if it's come from trust server 
	    msg.time = this.battleField.time+settings.delay;
	    this.battleField.onInstruction(msg);
	    this.syncManager.boardCast(msg);
	    return;
	}
	//fatal latency
	if(msg.time<=this.battleField.time){
	    console.log("it's",this.battleField.time);
	    console.log("drop outdated message",msg);
	    return;
	} 
	//
	console.log(msg.time-settings.delay);
	console.log(msg.time,this.battleField.time);
	this.battleField.onInstruction(msg);
	this.syncManager.boardCast(msg);
    }
    exports.ServerGateway = ServerGateway;
})(exports)