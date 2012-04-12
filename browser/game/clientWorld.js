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
    var Interaction = require("./interaction/interaction").Interaction;
    var Key = require("./util").Key;
    var Gateway = require("./gateway").Gateway
    var ClientWorld = World.sub();
    //ClientWorld inherit from World
    //Do the quite same things but optimized for browsers
    ClientWorld.prototype._init = function(worldInfo){
	ClientWorld.parent.prototype._init.call(this,worldInfo);
	var self = this;
	//initialze canvas
	this.canvas = document.getElementById(settings.screen);
	this.canvas.width = settings.width;
	this.canvas.height = settings.height;
	//default net work delay
	this.delay = worldInfo.delay;//300ms 
	Static.battleField = new BattleField({world:this,time:worldInfo.time}); 
	Static.gateway = new Gateway(Static.battleField);
	//setup user auth info
	Static.gateway.username = worldInfo.username;
	//setup galaxy
	Static.galaxyMap = new GalaxyMap(GALAXIES);
	Static.world = this;
	this.galaxy = Static.galaxyMap.getGalaxyByName(settings.whereAmI);
	//initialize interaction
	Static.interactionManager = new InteractionManager(this);
	this.galaxySelectInteraction = new GalaxySelectInteraction();
    }
    ClientWorld.prototype.start = function(){
	ClientWorld.parent.prototype.start.call(this);
	Static.waitingPage.startWaiting();
	//connect to server to sync battleFieldInfo
	this.changeGalaxy("Nolava");
	var self = this;
	/*window.onhashchange = function(){
	    self.changeGalaxy(window.location.hash.replace("#",""));
	}*/
	return this;
    }
    ClientWorld.prototype.setTime = function(time){
	this.time = time;
	Static.battleField.time = time;
    }
    ClientWorld.prototype.changeGalaxy = function(where){
	settings.whereAmI = where;
	var g = Static.galaxyMap.getGalaxyByName(settings.whereAmI);
	console.log(g.server.host,g.server.port,g.name);
	if(!g)return false; 
	this.galaxy = g;
	if(!this.syncWorker){
	    this.syncWorker = new SyncWorker(g.server.host,g.server.port,Static.gateway);
	    this.syncWorker.start();
	    return;
	}
	this.syncWorker.setServer(g.server.host,g.server.port);
	this.syncWorker.close();
    }
    ClientWorld.prototype.next = function(){
	ClientWorld.parent.prototype.next.call(this);
	this.solveKeyEvent();
	var context = this.canvas.getContext("2d");
	context.clearRect(0,0,settings.width,settings.height);
	context.save();
	Static.battleField.next(context);
	context.restore();
	context.save();
	if(this.showMap){
	    this.galaxyMap.draw(context);
	}
	Static.interactionManager.globalParts.draw(context);
	context.restore();
    }
    ClientWorld.prototype.solveKeyEvent = function(){
	if(window.KEY[Key.z]){
	    if(window.KEY[Key.shift]){
		if(Static.battleField.scale>=1)return;
		Static.battleField.scale*=1.1;
	    }else{
		if(Static.battleField.scale<0.1)return;
		Static.battleField.scale*=0.9;
	    }
	}
	if(window.KEY[Key.left]){
	    Static.battleField.position.x+=10;
	} 
	if(window.KEY[Key.right]){
	    Static.battleField.position.x-=10; 
	} 
	if(window.KEY[Key.up]){
	    Static.battleField.position.y+=10;
	}
	if(window.KEY[Key.down]){
	    Static.battleField.position.y-=10;
	}
	if(window.KEY[Key.m]){
	    window.KEY[Key.m] = false;
	    if(this.selectedShip){
		if(this.selectedShip.owner != Static.username)return;
		Static.interactionManager.pushCriticalInteraction(
		    new MoveToInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship");
	    }
	}
	if(window.KEY[Key.r]){
	    window.KEY[Key.r] = false;
	    if(this.selectedShip){
		if(this.selectedShip.owner != Static.username)return;
		Static.interactionManager.pushCriticalInteraction(
		new RoundAtInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship"); 
	    }
	}
	if(window.KEY[Key.a]){
	    window.KEY[Key.a] = false;
	    if(this.selectedShip){
		if(this.selectedShip.owner != Static.username)return;
		Static.interactionManager.pushCriticalInteraction(
		new LockAtInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship"); 
	    }
	}
	if(window.KEY[Key.g]){
	    window.KEY[Key.g] = false;
	    if(this.showMap){
		this.showMap = false;
		Static.interactionManager.popCriticalInteraction(this.galaxySelectInteraction);
	    }
	    else{
		Static.interactionManager.pushCriticalInteraction(this.galaxySelectInteraction);
		this.showMap = true;
	    } 
	}
	if(window.KEY[Key.r]){
	    window.KEY[Key.r] = false;
	    if(this.selectedShip){
		
		if(this.selectedShip.owner != Static.username)return;
	    Static.interactionManager.pushCriticalInteraction(
		new RoundAtInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship"); 
	    }
	}
	if(window.KEY[Key.a]){
	    window.KEY[Key.a] = false;
	    if(this.selectedShip){
		
		if(this.selectedShip.owner != Static.username)return;
		Static.interactionManager.pushCriticalInteraction(
		    new LockAtInteraction(this.selectedShip));
	    }else{
		console.log("please select a ship"); 
	    }
	}
	if(window.KEY[Key.g]){
	    window.KEY[Key.g] = false;
	    if(this.showMap){
		this.showMap = false;
		Static.interactionManager.popCriticalInteraction(this.galaxySelectInteraction);
	    }
	    else{
		Static.interactionManager.pushCriticalInteraction(this.galaxySelectInteraction);
		this.showMap = true;
	    } 
	}
	if(window.KEY[Key.j]){
	    window.KEY[Key.j] = false;
	    if(this.selectedShip){
		
		if(this.selectedShip.owner != Static.username)return;
		Static.interactionManager.pushCriticalInteraction(
		    new PassStarGateInteraction(this.selectedShip)
		);
	    }else{
		console.log("please select a ship"); 
	    }
	}
	
    }
    exports.ClientWorld = ClientWorld;
})(exports)