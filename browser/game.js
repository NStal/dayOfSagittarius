(function(exports){
    var settings = require("./settings").settings;
    var World = require("./share/world.js").World;
    var BattleField = require("./battleField").BattleField;
    var SyncWorker = require("./syncWorker").SyncWorker;
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

	this.gateway = new Gateway(this.battleField);
	//prepare handle global key event
	window.KEY = {};
	window.onkeydown = function(e){
	    window.KEY[e.which] = true; 
	}
	window.onkeyup = function(e){
	    window.KEY[e.which] = false;
	}
    }
    Game.prototype.start = function(){
	Game.parent.prototype.start.call(this);
	//connect to server to sync battleFieldInfo
	this.syncWorker = new SyncWorker("ws://vuvu:10000",
					 this.gateway);
	this.syncWorker.start();
    }
    Game.prototype.next = function(){
	//this is game loops
	//test
	if(window.KEY[Key.o]){
	    window.KEY[Key.o] = false;
	    //send moveRight
	    this.syncWorker.send({
		t:this.time
		,c:0
	    });
	}
	if(window.KEY[Key.p]){
	    window.KEY[Key.p] = false;
	    //send moveLeft
	} 
	this.time+=1;
	var context = this.canvas.getContext("2d");
	context.save();
	this.battleField.next(context);
	context.restore();
    }	
    exports.Game = Game;
})(exports)