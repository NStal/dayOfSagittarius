(function(exports){
    var Class = require("../util").Class
    var Point = require("../util").Point
    var Util = require("../util").Util
    var ShipSoul = Class.sub();
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
	this.id = info.id;
	this.name = info.name
	this.ability = info.ability;
	this.state = info.state?info.state:{};
	this.action = info.action?info.action:{rotateFix:0};
	this.cordinates = new Point(info.cordinates);
	this.physicsState = info.physicsState;
	this.moduleManager = new ModuleManager(this);
	this.AI = new AI(this);
	this.AI.destination = info.AI&&info.AI.destination?info.AI.destination:{};
    }
    ShipSoul.prototype.init = function(modules){
	for(var i=0;i<modules.length;i++){
	    var module = this.moduleManager.moduleEnum[modules[i]];
	    if(!module){
		throw "recieve invalid module index";
	    }
	    this.moduleManager.add(new module());
	}
	this.applyAbility();
	return this;
    }
    ShipSoul.prototype.applyAbility = function(){
	Util.update(this.state
		    ,this.ability); 
    }
    ShipSoul.prototype.toData = function(){
	var data ={
	    id:this.id
	    ,name:this.name
	    ,cordinates:{x:this.cordinates.x
			 ,y:this.cordinates.y}
	    ,ability:this.ability
	    ,state:this.state
	    ,physicsState:this.physicsState
	    ,action:this.action
	    ,AI:this.AI.toData()
	    ,modules:this.moduleManager.toData()
	}
	console.log(data);
	return data;
    }
    ShipSoul.prototype.clear = function(){
	this.parentContainer.remove(this);
    }
    ShipSoul.prototype.onHit = function(byWho){
	var value = 1000;
	if(this.isDead == true)return;
	value = require("../util").HashRandomInt(byWho.weapon.manager.ship.parentContainer.time
						 ,value);
	for(var i=0;i<this.moduleManager.events.onDamage.length;i++){
	    var item = this.moduleManager.events.onDamage[i];
	    value = item(value);
	}
	console.log("recieve ",value,"points of hit");
	this.state.structure-=1000;
	if(this.state.structure<=0){
	    this.clear();
	    console.log(this.name,"is dead");
	    this.isDead = true;
	}
    }
    ShipSoul.prototype.nextTick = function(){
	var events = this.moduleManager.events.onNextTick;
	for(var i=0;i < events.length;i++){
	    events[i]();
	}
    }
    
    exports.ShipSoul = ShipSoul;
})(exports)