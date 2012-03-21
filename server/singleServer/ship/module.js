(function(exports){
    var Class = require("../util").Class
    var Module = Class.sub();
    var GameInstance = require("../gameUtil").GameInstance;
    var settings = require("../settings").settings;
    Module.prototype._init = function(){
	this.handlers = {};
    }
    Module.prototype.init = function(moduleManager){
	this.manager = moduleManager;
	for(var item in this.handlers){
	    moduleManager.register(item,this.handlers[item]);
	}
    }
    Module.prototype.clear = function(){
	for(var item in this.handlers){
	    this.manager.unregister(item);
	}
	this.manager = null;
	
    }
    Module.prototype.listen = function(event){
	var self = this;
	if(!event || !self[event]){
	    console.trace();
	    throw "no " + event + "handler";
	};
	this.handlers[event] = function(){
	    return self[event].apply(self,arguments);
	}
    }
    var AllumitionSoul = GameInstance.sub();
    AllumitionSoul.prototype._init = function(weapon){
	if(!weapon){
	    return;
	}
	this.count = 30;
	this.rate = settings.rate;
	this.index = 0;
	this.target = weapon.manager.ship.AI.destination.target;
	this.weapon = weapon;
    }
    AllumitionSoul.prototype.next = function(){
	this.index++;
	if(this.index==this.count){
	    this.stop(); 
	    this.target.onHit(this);
	}
    }
    var WeaponSoul = Module.sub();
    WeaponSoul.prototype._init = function(){
	this.listen("onNextTick");
	this.coolDown = 30;
	this.readyState = 0;
	this.Allumition = AllumitionSoul;
    }
    WeaponSoul.prototype.onNextTick = function(){
	this.readyState+=1;
    }
    WeaponSoul.prototype.active = function(){
	if(!this.manager.ship.AI.destination.target){
	    console.log("can't fire without target");
	    console.trace();
	    return;
	}
	if(this.readyState>=this.coolDown){
	    this.readyState = 0;
	}else{
	    console.log("weapon not ready");
	    return;
	}
	var target = this.manager.ship.AI.destination.target; 
	var allumition = new this.Allumition(this);
	
	allumition.start();
	console.log("fired!");
	this.readyState = 0;
    }
    WeaponSoul.prototype.toData = function(){
	return 0;
    }
    exports.AllumitionSoul = AllumitionSoul;
    exports.WeaponSoul = WeaponSoul;
    exports.Weapon = WeaponSoul;

    var a = 5;
})(exports)