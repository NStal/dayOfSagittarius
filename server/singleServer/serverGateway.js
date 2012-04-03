(function(exports){
    var Class = require("./util").Class;
    var Protocol = require("./protocol");
    var settings = require("./settings").settings;
    var ServerGateway = Class.sub();
    var db = require("../database/interface").Interface;
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
	this.db = new db();
	var self = this;
	bf.addListener({
	    type:"onPassStarGate"
	    ,handler:function(ship,gate){
		console.log("here~~~~~~~~~~~");
		self.onPassStarGate(ship,gate);
	    }
	})
    }
    ServerGateway.prototype.onPassStarGate = function(ship,gate){
	try{
	    var g = require("./resource/map/"+gate.to)[gate.to];
	}
	catch(e){
	    console.trace();
	    console.log("pass invalid gate");
	    return;
	}
	var gs = require("./resource/galaxies").GALAXIES;
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
	    return;
	}
	if(msg.time==0){
	    self.db.getUserData(msg.auth.username,
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
	    who.master.boardCast(msg);
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
    }
    exports.ServerGateway = ServerGateway;
})(exports)