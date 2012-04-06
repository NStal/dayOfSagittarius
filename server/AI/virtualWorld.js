(function(exports){
    var settings = require("./settings");
    var World = require("./share/world").World;
    var BattleField = require("./battleFieldVirtual").BattleFieldVirtual;
    var SyncWorker = require("./syncWorker").SyncWorker;
    var VirtualWorldInstance = require("./share/gameUtil").VirtualWorldInstance;
    var runOnce = require("./share/util.js").runOnce;
    var GALAXIES = require("./share/resource/galaxies").GALAXIES;
    var GameInstance = require("./share/gameUtil").GameInstance;
    //alert(VirtualWorldInstace);
    var Gateway = require("./gateway").Gateway
    var VirtualWorld = World.sub();
    var AICore = require("./aiCore").AICore;
    //VirtualWorld assambles other Objects like battleFidle gateway etc
    //and holds the worlds' time 
    //VirtualWorld is the world for AI.
    VirtualWorld.prototype._init = function(username){
	VirtualWorld.parent.prototype._init.call(this);
	this.time = 0;
	var self = this;
	this.current
	//initialze canvas
	this.battleField = new BattleField({time:0});
	this.battleField.world = this;
	this.delay = settings.delay;//300ms
	this.gateway = new Gateway(this.battleField);
	this.gateway.username = username;
	this.galaxy = "Nolava"
	this.aiCore = new AICore(this.battleField,this.gateway);
	//prepare handle global key event 
    }
    VirtualWorld.prototype.start = function(){
	VirtualWorld.parent.prototype.start.call(this);
	var self = this;
	this.changeGalaxy(this.galaxy);
	this.aiCore.start()
	return this;
    }
    VirtualWorld.prototype.changeGalaxy = function(where){
	var g = null;
	for(var i=0;i < GALAXIES.length;i++){
	    if(GALAXIES[i].name==where){
		g = GALAXIES[i];
	    } 
	}
	if(!g){
	    console.warn("invalid galaxy name");
	    return false;
	}
	this.galaxy = g;
	this.gateway.galaxy = g;
	if(!this.syncWorker){
	    this.syncWorker = new SyncWorker(g.server.host,g.server.port,this.gateway);
	    this.syncWorker.start();
	    return;
	}
	this.syncWorker.setServer(g.server.host,g.server.port);
	this.syncWorker.close();
    }
    VirtualWorld.prototype.next = function(){
	//this is game loops
	//test
	GameInstance.nextTick();
	this.time+=1;
	this.battleField.next();
	this.battleField._debug = "THIS!!"
    }
    exports.VirtualWorld = VirtualWorld;
})(exports)