(function(exports){
    var settings = require("./settings");
    var World = require("./share/world").World;
    var BattleField = require("./battleFieldVirtual").BattleFieldVirtual;
    var SyncWorker = require("./syncWorker").SyncWorker;
    var Interface = require("../database/interface").Interface;
    var runOnce = require("./share/util.js").runOnce;
    var GALAXIES = require("./share/resource/galaxies").GALAXIES;
    var GameInstance = require("./share/gameUtil").GameInstance;
    //alert(VirtualWorldInstace);
    var Gateway = require("./share/gateway").Gateway;
    var VirtualWorld = World.sub();
    var Static = require("./share/static").Static;
    var AICore = require("./aiCore").AICore;
    //VirtualWorld assambles other Objects like battleFidle gateway etc
    //and holds the worlds' time 
    //VirtualWorld is the world for AI.
    VirtualWorld.prototype._init = function(worldInfo){
	VirtualWorld.parent.prototype._init.call(this,worldInfo);
	var self = this;
	//initialze canvas
	this.battleField = new BattleField({time:0
					    ,world:this});
	this.delay = settings.delay;//300ms
	this.gateway = new Gateway(this.battleField);
	this.gateway.username = worldInfo.name;
	this.galaxy = "Nolava"
	this.aiCore = new AICore(this.battleField,this.gateway);
	Static.username = worldInfo.name;
	Static.world = this;
	Static.battleField = this.battleField;
	this.gateway.aiCore = this.aiCore;
	Static.clientSide = true;
	Static.gateway = this.gateway;
	
	//prepare handle global key event 
    }
    VirtualWorld.prototype.start = function(){
	VirtualWorld.parent.prototype.start.call(this);
	var self = this;
	this.changeGalaxy(this.galaxy);
	return this;
    }
    VirtualWorld.prototype.setTime = function(time){
	this.time = time;
	Static.battleField.time = time;
    }
    VirtualWorld.prototype.changeGalaxy = function(where){
	var self = this;
	Interface.getGalaxyInfoWithEnvironment(where,function(g){
	    if(!g){
		console.warn("invalid galaxy name");
		return false;
	    }
	    self.galaxy = g;
	    self.gateway.galaxy = g;
	    self.battleField.initEnvironment(g);
	    if(!self.syncWorker){
		self.syncWorker = new SyncWorker(g.server.host,g.server.port,self.gateway);
		self.syncWorker.start();
		return;
	    } 
	    self.syncWorker.setServer(g.server.host,g.server.port);
	    self.syncWorker.close();
	})
    }
    VirtualWorld.prototype.next = function(){
	//this is game loops
	//test
	VirtualWorld.parent.prototype.next.call(this);
	this.battleField.next(); 
    }
    exports.VirtualWorld = VirtualWorld;
})(exports)