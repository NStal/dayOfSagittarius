(function(exports){
    var settings = require("./settings").settings;
    var World = require("./share/world.js").World;
    var BattleField = require("./battleField").BattleField;
    var SyncWorker = require("./syncWorker").SyncWorker;
    var GameInstance = require("./share/gameUtil").GameInstance;
    //alert(GameInstace);
    var Key = require("./util").Key;
    var Gateway = require("./gateway").Gateway
    var Game = World.sub();
    //Game assambles other Objects like battleFidle gateway etc
    //and holds the worlds' time 
    Game.prototype._init = function(){
	Game.parent.prototype._init.call(this);
	this.time = 0;
	var self = this;
	//initialze canvas
	this.canvas = document.getElementById(settings.screen);
	this.canvas.width = settings.width;
	this.canvas.height = settings.height;
	this.battleField = new BattleField({time:0});
	this.battleField.world = this;
	this.delay = 10;//300ms
	this.gateway = new Gateway(this.battleField);
	
	this.interactionManager = new InteractionManager(this);
	//prepare handle global key event 
    }
    Game.prototype.start = function(){
	Game.parent.prototype.start.call(this);
	//connect to server to sync battleFieldInfo
	this.syncWorker = new SyncWorker("ws://115.156.219.166:10000"
					 ,this.gateway);
	this.syncWorker.start();
	return this;
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
    }
    exports.Game = Game;
})(exports)