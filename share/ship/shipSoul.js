(function(exports){
    var Class = require("../util").Class;
    var EventEmitter = require("../util").EventEmitter;
    
    var Point = require("../util").Point;
    var Util = require("../util").Util;
    var ShipSoul = EventEmitter.sub();
    var ModuleManager = require("./moduleManager").ModuleManager;
    var Module = require("./module").Module;
    var AI = require("./ai").AI;
    //ShipSoul Holds a shipInformation
    //it contain everything you want in a ship
    //except:the intention of the ship
    //is stored in it's AI;
    ShipSoul.prototype._init = function(info){
	if(!info){
	    return;
	}
	if(!info.itemId){
	    console.warn("info",info);
	    console.warn("no ship prototype provide");
	    return;
	}
	//console.log("infoQ",info.cordinates);
	this.type = "ship";
	if(info.id)
	    this.id = info.id;
	if(info._id)
	    this.id = info._id.toString();
	if(!this.id){
	    console.warn("!!!!","no id!!!!");
	}
	console.log("id",this.id);
	this.itemId = info.itemId; 
	var GRM = require("../static").Static.GRM;
	var shipPrototype = GRM.get(info.itemId);
	this.name = info.name
	this.ability = {};
	Util.update(this.ability,shipPrototype.ability);
	this.state = info.state?info.state:null;
	this.action = info.action?info.action:{
	    rotateFix:0
	};
	this.cordinates = Point.Point(info.cordinates);
	this.physicsState = info.physicsState;
	this.moduleManager = new ModuleManager(this);
	this.AI = new AI(this);
	this.AI.destination = info.AI&&info.AI.destination?info.AI.destination:{};
	this.passing = false
	this.owner = info.owner;
	this.pilot = info.pilot;
	this.reward = info.reward;
	this.cagos = info.cagos?info.cagos:[];
    }
    ShipSoul.prototype.init = function(modules){
	for(var i=0;i<modules.length;i++){
	    var module = this.moduleManager.getModuleByInfo(modules[i]);
	    if(!module){
		throw "recieve invalid module index";
	    }
	    this.moduleManager.add(module);
	}
	if(!this.state)
	    this.applyAbility();
	return this;
    }
    ShipSoul.prototype.applyAbility = function(){
	this.state = {};
	Util.update(this.state
		    ,this.ability);
    }
    ShipSoul.prototype.toData = function(){
	var data ={
	    id:this.id
	    ,itemId:this.itemId
	    ,name:this.name
	    ,cordinates:{x:this.cordinates.x
			 ,y:this.cordinates.y}
	    //,ability:this.ability
	    ,state:this.state
	    ,physicsState:this.physicsState
	    ,action:this.action
	    ,AI:this.AI.toData()
	    ,modules:this.moduleManager.toData()
	    ,owner:this.owner
	    ,pilot:this.pilot
	    ,reward:this.reward
	    ,cagos:this.cagos
	}
	return data;
    }
    ShipSoul.prototype.clear = function(){
	this.parentContainer.remove(this);
	this.emit("cleared");
	this.isMissed = true;
    }
    ShipSoul.prototype.onHit = function(byWho,value){
	if(this.isDead == true)return;
	this.emit("hit",byWho,value);
	value = require("../util").HashRandomInt(byWho.weapon.manager.ship.parentContainer.time
						 ,value);
	
	for(var i=0;i<this.moduleManager.events.onBeforeHit.length;i++){
	    var item = this.moduleManager.events.onBeforeHit[i];
	    value = item(value);
	} 
	for(var i=0;i<this.moduleManager.events.onDamage.length;i++){
	    var item = this.moduleManager.events.onDamage[i];
	    value = item(value);
	}
	/*console.log("at",byWho.weapon.manager.ship.parentContainer.time
	  ,"recieve ",value,"points of hit");*/
	this.state.structure-=value;
	//console.log(this.state.structure);
	if(this.state.structure<=0){
	    this.onDead(byWho);
	}
    }
    ShipSoul.prototype.onDead = function(byWho){
	this.clear();
	console.log(this.name,"is dead");
	this.isDead = true;
	this.emit("dead",this,byWho);
    }
    ShipSoul.prototype.nextTick = function(){
	var events = this.moduleManager.events.onNextTick;
	for(var i=0;i < events.length;i++){
	    events[i]();
	}
    }
    ShipSoul.prototype.passStarGate = function(gate){
	if(this.passing)return;
	this.parentContainer.passStarGate(this,gate);
	this.passing = true;
    }
    ShipSoul.prototype.next = function(){
	this.AI.calculate();
	this.nextTick();
	this.emit("next");
	//console.log("at",this.time,this.cordinates.toString());
	var fix = this.action.rotateFix;
	if(fix>1 || fix < -1){
	    console.trace();
	    return;
	}
	//console.log(this.state);
	rotateSpeed = (1-this.state.speedFactor)*this.state.maxRotateSpeed;
	this.physicsState.toward += fix*rotateSpeed;
	this.physicsState.toward = Math.mod(this.physicsState.toward,Math.PI*2);
	var fix = this.action.speedFix;
	var speed = (1-this.state.speedFactor)*this.state.maxSpeed;
	//move
	this.cordinates.x+=Math.cos(this.physicsState.toward) *speed*fix;
	this.cordinates.y+=Math.sin(this.physicsState.toward) *speed*fix;
	this.action.speedFix = 0;
	this.action.rotateFix = 0;
	//map edge detection;
	if(this.cordinates.x<-1)this.cordinates.x =1; 
	if(this.cordinates.y<-1)this.cordinates.y =1; 
	if(this.cordinates.x>this.parentContainer.size.x)
	    this.cordinates.x=this.parentContainer.size.x;
	if(this.cordinates.y>this.parentContainer.size.y)
	    this.cordinates.y=this.parentContainer.size.y;
    }
    exports.ShipSoul = ShipSoul;
    exports.Ship = ShipSoul;
})(exports)