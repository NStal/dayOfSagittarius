(function(exports){
    var settings = require("./settings").settings; 
    var World = require("./share/world").World;
    var EventEmitter = require("./share/util").EventEmitter;
    var BattleField = require("./battleField").BattleField;
    var SyncWorker = require("./syncWorker").SyncWorker;
    var GameInstance = require("./share/gameUtil").GameInstance;
    var Drawable = require("./drawaing/drawable").Drawable;
    var runOnce = require("./share/util.js").runOnce;
    var GALAXIES = require("./share/resource/galaxies").GALAXIES;
    var GalaxyMap = require("./galaxy/galaxyMap").GalaxyMap;
    var Toaster = require("./interaction/toast").Toaster;
    var InteractionDisplayer = require("./interaction/interactionDisplayer").InteractionDisplayer;
    var GlobalCaptureLayer = require("./interaction/interactionLayer").GlobalCaptureLayer;
    var Key = require("./util").Key;
    var Gateway = require("./gateway").Gateway
    var ClientWorld = World.sub();
    //ClientWorld inherit from World
    //Do the quite same things but optimized for browsers 
    EventEmitter.mixin(ClientWorld);
    ClientWorld.prototype._init = function(worldInfo){
	ClientWorld.parent.prototype._init.call(this,worldInfo);
	var self = this; 
	//initialze canvas
	this.canvas = $("#battleScene #screen")[0];
	this.canvas.style.display="block";
	this.canvas.width = settings.width;
	this.canvas.height = settings.height;
	//default net work delay
	this.delay = worldInfo.delay;//300ms
	
	Static.world = this;
	Static.globalCaptureLayer = new GlobalCaptureLayer(this);
	
	Static.battleField = new BattleField({world:this,time:worldInfo.time}); 
	Static.interactionDisplayer = new InteractionDisplayer(this);
	Static.battleFieldDisplayer = new BattleFieldDisplayer(Static.battleField); 
	Static.battleField.on("shipInitialized",function(ships){
	    var tempArr = ships;
	    for(var i=0,length=tempArr.length;i < length;i++){
		var item = tempArr[i];
		item.on("jumped",function(ship){
		    var gate = ship.AI.destination.starGate;
		    Static.world.changeGalaxy(gate.to);
		})
	    }
	})
	Static.gateway = new Gateway(Static.battleField); 
	Static.gateway.on("init",function(){
	    Static.waitingPage.endWaiting();
	})
	Static.gateway.on("disconnect",function(){
	    Static.waitingPage.startWaiting();
	})
	Static.gateway.on("outdate",function(){
	    ShipController.setDelay(ShipController.delay*2);
	})
	Static.UIDisplayer = new UIDisplayer(this);
	//setup user auth info
	Static.gateway.username = worldInfo.username;
	//setup galaxy
	Static.galaxyMap = new GalaxyMap(GALAXIES);
	//initialize interaction 
	this.add(Static.battleFieldDisplayer); 
	this.add(Static.interactionDisplayer);
	this.add(Static.UIDisplayer);
	this.add(Static.globalCaptureLayer);
	this.KEYS = [];
	
	function nodePointToPoint(e){
	    if(typeof e.clientX!="undefined")
		return new Point(e.clientX,e.clientY);
	    return new Point(e.layerX,e.layerY);
	}
	this.mouseEventDistributer = new MouseEventDistributer(this);
	window.oncontextmenu = function(){
	    return false;
	} 
	//optimized for ipad
	this.canvas.ontouchstart = function(e){
	    this.hasTouch = true;
	    if(e.button==2){
		var event = "rightMouseDown";
	    }else{
		var event = "mouseDown"
	    } 
	    self.mouseEventDistributer.distribute(event,nodePointToPoint(e)); 
	    self.mouseEventDistributer.distribute("mouseUp",nodePointToPoint(e));
	}
	this.canvas.ontouchend = function(e){
	    return true;
	    this.hasTouch = true; 
	    if(e.button==2){
		var event = "rightMouseUp";
	    }else{
		var event = "mouseUp"
	    }
	    self.mouseEventDistributer.distribute(event,nodePointToPoint(e));
	    
	}
	this.canvas.ontouchmove = function(e){
	    self.mouseEventDistributer.distribute("mouseMove",nodePointToPoint(e));
	    if(self._lastMove){
		self.mouseEventDistributer.distribute("mouseLeave",nodePointToPoint(e),self._lastMove); 
		self.mouseEventDistributer.distribute("mouseEnter",self._lastMove,nodePointToPoint(e));
	    }
	    self._lastMove = nodePointToPoint(e);
	}
	//end optimaized for ipad
	this.canvas.onmousedown = function(e){
	    if(this.hasTouch)return;
	    if(e.button==2){
		var event = "rightMouseDown";
	    }else{
		var event = "mouseDown"
	    }
	    self.mouseEventDistributer.distribute(event,nodePointToPoint(e));
	}
	this.canvas.onmouseup = function(e){
	    if(this.hasTouch)return;
	    if(e.button==2){
		var event = "rightMouseUp";
	    }else{
		var event = "mouseUp"
	    }
	    self.mouseEventDistributer.distribute(event,nodePointToPoint(e));
	}
	this.canvas.onmousemove = function(e){
	    if(this.hasTouch)return;
	    
	    self.mouseEventDistributer.distribute("mouseMove",nodePointToPoint(e));
	    Static.mousePosition = nodePointToPoint(e);
	    if(self._lastMove){
		self.mouseEventDistributer.distribute("mouseLeave",nodePointToPoint(e),self._lastMove); 
		self.mouseEventDistributer.distribute("mouseEnter",self._lastMove,nodePointToPoint(e));
	    }
	    self._lastMove = nodePointToPoint(e);
	}
	window.onkeydown =function(e){
	    self.KEYS[e.which] = true;
	}
	window.onkeyup = function(e){
	    self.KEYS[e.which] = false;
	}
	
	$(window).resize(function(){
	    settings.width = $("body").width();
	    settings.height = $("body").height();
	    self.canvas.width = settings.width;
	    self.canvas.height = settings.height;
	    console.log(settings.width,settings.height);
	    self.emit("resize");
	})
    }
    ClientWorld.prototype.start = function(){
	ClientWorld.parent.prototype.start.call(this);
	Static.waitingPage.startWaiting();
	//connect to server to sync battleFieldInfo 
	//WARNING TAG TEST assume user always at galaxy 
	if(Static.userData.atGalaxy){
	    this.sleep = false;
	    this.changeGalaxy(Static.userData.at);
	}else{
	    if(this.syncWorker)this.syncWorker.close();
	    this.stop();
	    this.sleep = true;
	    Static.starStationScene.onEnterStation(Static.userData.at);
	}
	if(!this.bgm){
	    var audio = new Audio(Static.resourceLoader.get("music_bgm").src);
	    //audio.play();
	    audio.loop = true;
	    this.bgm = audio;
	}
	return this;
    }
    ClientWorld.prototype.setTime = function(time){
	this.time = time;
	Static.battleField.time = time;
    } 
    ClientWorld.prototype.changeGalaxy = function(where){
	settings.whereAmI = where;
	var self = this;
	Static.HttpAPI.getGalaxyInfoByName(settings.whereAmI,function(result){
	    if(!result.result){
		console.log("fail to change galaxy");
	    }
	    var g = result.data;
	    if(!g)return false; 
	    self.galaxy = g;
	    Static.battleField.initEnvironment(g);
	    if(!self.syncWorker){
		self.syncWorker = new SyncWorker(g.server.host,g.server.port,Static.gateway);
		self.syncWorker.start();
		return;
	    }
	    self.syncWorker.setServer(g.server.host,g.server.port);
	    self.syncWorker.close();
	});
    }
    ClientWorld.prototype.next = function(){
	ClientWorld.parent.prototype.next.call(this);
	this.solveKeyEvent();
	if(!Static.battleField.ready)return;
	Static.battleField.next(context);
	var context = this.canvas.getContext("2d");
	context.font = "11px Arial";
	context.clearRect(0,0,settings.width,settings.height);
	context.save();
	this.draw(context);
	context.restore();
    }
    ClientWorld.prototype.solveKeyEvent = function(){
	if(this.KEYS[Key.z] && this.KEYS[Key.alt]){
	    if(this.KEYS[Key.shift]){
		Static.battleFieldDisplayer.scale *= 1.1; 
	    }else{
		Static.battleFieldDisplayer.scale *= 0.9;
	    }
	    if(Static.battleFieldDisplayer.scale >=2)Static.battleFieldDisplayer.scale=2;
	    if(Static.battleFieldDisplayer.scale <0.1)Static.battleFieldDisplayer.scale=0.1;
	}
	if(this.KEYS[Key.f] && this.KEYS[Key.alt]){
	    if(this.viewLastChange
	       &&Date.now()-this.viewLastChange<settings.changeViewInterval)return;
	    this.viewLastChange = Date.now();
	    this.KEYS[Key.f] = false;
	    Static.battleFieldDisplayer.followShip = !Static.battleFieldDisplayer.followShip;
	} 
	if(this.KEYS[Key.e] && this.KEYS[Key.alt]){
	    if(this.viewLastChange
	       &&Date.now()-this.viewLastChange<settings.changeViewInterval)return;
	    this.viewLastChange = Date.now();
	    this.KEYS[Key.e] = false;
	    Static.UIDisplayer.itemDisplayer.toggle();
	}
	 
	if(this.KEYS[Key.c] && this.KEYS[Key.alt]){
	    if(this.viewLastChange
	       &&Date.now()-this.viewLastChange<settings.changeViewInterval)return;
	    this.viewLastChange = Date.now();
	    this.KEYS[Key.c] = false;
	    Static.UIDisplayer.chatBox.toggle();
	}
	if(this.KEYS[Key.m] && this.KEYS[Key.alt]){
	    if(this.viewLastChange
	       &&Date.now()-this.viewLastChange<settings.changeViewInterval)return;
	    this.viewLastChange = Date.now();
	    this.KEYS[Key.m] = false;
	    Static.interactionDisplayer.toggleMarks();
	}
    }
    Drawable.mixin(ClientWorld);
    MouseEventConsumer.mixin(ClientWorld);
    exports.ClientWorld = ClientWorld;
})(exports)