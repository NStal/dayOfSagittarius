(function(exports){
    var settings = require("./settings").settings;
    var World = require("./share/world").World;
    var BattleField = require("./battleField").BattleField;
    var SyncWorker = require("./syncWorker").SyncWorker;
    var GameInstance = require("./share/gameUtil").GameInstance;
    var runOnce = require("./share/util.js").runOnce;
    var GALAXIES = require("./share/resource/galaxies").GALAXIES;
    var GalaxyMap = require("./galaxy/galaxyMap").GalaxyMap;
    var Toaster = require("./interaction/toast").Toaster;
    //alert(GameInstace);
    var Key = require("./util").Key;
    var Gateway = require("./gateway").Gateway
    var Game = World.sub();
    //Game assambles other Objects like battleFidle gateway etc
    //and holds the worlds' time 
    Game.prototype._init = function(username){
	Game.parent.prototype._init.call(this);
	this.time = 0;
	var self = this;
	//initialze canvas
	this.canvas = document.getElementById(settings.screen);
	this.canvas.width = settings.width;
	this.canvas.height = settings.height;
	this.galaxyMap = new GalaxyMap(GALAXIES);
	this.galaxy = this.galaxyMap.getGalaxyByName(settings.whereAmI);
	this.battleField = new BattleField({time:0});
	this.battleField.world = this;
	this.delay = settings.delay;//300ms
	this.gateway = new Gateway(this.battleField);
	this.interactionManager = new InteractionManager(this);
	this.galaxySelectInteraction = new GalaxySelectInteraction();
	this.gateway.username = username;
	Static.username = username;
	//prepare handle global key event 
    }
    Game.prototype.start = function(){
	Game.parent.prototype.start.call(this); 
	//connect to server to sync battleFieldInfo
	this.changeGalaxy(window.location.hash.replace("#",""));
	var self = this;
	window.onhashchange = function(){
	    self.changeGalaxy(window.location.hash.replace("#",""));
	}
	return this;
    }
    Game.prototype.changeGalaxy = function(where){
	settings.whereAmI = where; 
	var g = this.galaxyMap.getGalaxyByName(settings.whereAmI) 
	if(!g)return false; 
	this.galaxy = g;
	if(!this.syncWorker){
	    this.syncWorker = new SyncWorker(g.server.host,g.server.port,this.gateway);
	    this.syncWorker.start();
	    return;
	}
	this.syncWorker.setServer(g.server.host,g.server.port);
	this.syncWorker.close();
    }
    Game.prototype.next = function(){
	//this is game loops
	//test
	this.solveKeyEvent();
	GameInstance.nextTick();
	this.time+=1;
	var context = this.canvas.getContext("2d");
	context.clearRect(0,0,settings.width,settings.height);
	context.save();
	this.battleField.next(context);
	this.interactionManager.draw(context);
	context.restore();
	context.save();
	if(this.showMap){
	    this.galaxyMap.draw(context);
	}
	this.interactionManager.globalParts.draw(context);
	context.restore();
    }
    Game.prototype.solveKeyEvent = function(){
	if(window.KEY[Key.z]){
	    if(window.KEY[Key.shift]){
		this.battleField.scale*=1.1;
	    }else{
		this.battleField.scale*=0.9; 
	    }
	}
	if(window.KEY[Key.m]){
	    window.KEY[Key.m] = false;
	    if(this.selectedShip){
	    this.interactionManager.pushCriticalInteraction(
		new MoveToInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship");
	    }
	}
	if(window.KEY[Key.r]){
	    window.KEY[Key.r] = false;
	    if(this.selectedShip){
	    this.interactionManager.pushCriticalInteraction(
		new RoundAtInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship"); 
	    }
	}
	if(window.KEY[Key.a]){
	    window.KEY[Key.a] = false;
	    if(this.selectedShip){
	    this.interactionManager.pushCriticalInteraction(
		new LockAtInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship"); 
	    }
	}
	if(window.KEY[Key.g]){
	    window.KEY[Key.g] = false;
	    if(this.showMap){
		this.showMap = false;
		this.interactionManager.popCriticalInteraction(this.galaxySelectInteraction);
	    }
	    else{
		this.interactionManager.pushCriticalInteraction(this.galaxySelectInteraction);
		this.showMap = true;
	    } 
	}
	if(window.KEY[Key.r]){
	    window.KEY[Key.r] = false;
	    if(this.selectedShip){
	    this.interactionManager.pushCriticalInteraction(
		new RoundAtInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship"); 
	    }
	}
	if(window.KEY[Key.a]){
	    window.KEY[Key.a] = false;
	    if(this.selectedShip){
	    this.interactionManager.pushCriticalInteraction(
		new LockAtInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship"); 
	    }
	}
	if(window.KEY[Key.g]){
	    window.KEY[Key.g] = false;
	    if(this.showMap){
		this.showMap = false;
		this.interactionManager.popCriticalInteraction(this.galaxySelectInteraction);
	    }
	    else{
		this.interactionManager.pushCriticalInteraction(this.galaxySelectInteraction);
		this.showMap = true;
	    } 
	}
	if(window.KEY[Key.j]){
	    window.KEY[Key.j] = false;
	    if(this.selectedShip){
		this.interactionManager.pushCriticalInteraction(
		    new PassStarGateInteraction(this.selectedShip)
		);
	    }else{
		console.log("please select a ship"); 
	    }
	}
	
    }
    exports.Game = Game;
})(exports)