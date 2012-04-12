(function(exports){
    var Class = require("../util").Class; 
    var Point = require("../util").Point;
    var Module = Class.sub();
    var GameInstance = require("../gameUtil").GameInstance;
    //Some basic model of modules.
    //Weapon,Shield,Armor
    Module.prototype._init = function(state){
	this.handlers = {};
	if(state){
	    this.state = state;
	}
	else{
	    this.state = {};
	}
    }
    Module.prototype.init = function(moduleManager){
	this.manager = moduleManager;
	this.ship = this.manager.ship;
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
	}
	this.handlers[event] = function(){
	    //console.log(event,self);
	    return self[event].apply(self,arguments);
	}
    }
    var AllumitionSoul = GameInstance.sub();
    AllumitionSoul.prototype._init = function(weapon){
	if(!weapon){
	    return;
	}
	this.count = 15;
	this.index = 0;
	this.target = weapon.ship.AI.destination.target;
	this.weapon = weapon;
    }
    AllumitionSoul.prototype.next = function(){
	this.index++;
	if(this.index==this.count){
	    this.hit();
	}
    }
    AllumitionSoul.prototype.hit = function(){
	this.target.onHit(this,this.damagePoint); 
	this.stop();
    }
    var CannonSoul = AllumitionSoul.sub();
    CannonSoul.prototype._init = function(weapon){
	CannonSoul.parent.prototype._init.call(this,weapon);
	this.damagePoint = 20;
    }
    var BeamSoul = AllumitionSoul.sub();
    BeamSoul.prototype._init = function(weapon){
	BeamSoul.parent.prototype._init.call(this,weapon);
	this.damagePoint = 2;
	this.count = 30; 
    }
    BeamSoul.prototype.hit = function(){
	this.target.onHit(this,this.damagePoint);
    }
    BeamSoul.prototype.next = function(){
	this.index++;
	this.hit();
	console.log("ne~~");
	console.log(this.index,this.count);
	if(this.index==this.count){
	    this.stop();
	}
    }
    var MissileSoul = AllumitionSoul.sub();
    MissileSoul.prototype._init = function(weapon){
	if(!weapon){
	    return;
	}
	MissileSoul.parent.prototype._init.call(this,weapon);
	this.speed = 1; 
	this.damagePoint = 300;
	this.maxSpeed = 7;
	this.position = new Point(weapon.ship.cordinates);
    }
    MissileSoul.prototype.next = function(){
	this.index++;
	this.speed+=0.2;
	if(this.speed>this.maxSpeed)this.speed=this.maxSpeed;
	var distance = this.target.cordinates.distance(this.position);
	if(distance<0.2){
	    this.hit();
	    return;
	}
	if(distance<this.speed){
	    this.position = this.target.cordinates;
	    return;
	}
	this.toward = this.target.cordinates.sub(this.position).rad();
	this.rotation = this.toward;
	this.position.x+=Math.cos(this.toward)* this.speed;
	this.position.y+=Math.sin(this.toward)* this.speed;
    }
    var WeaponSoul = Module.sub();
    WeaponSoul.prototype._init = function(state){
	WeaponSoul.parent.prototype._init.call(this,state);
	this.listen("onNextTick");
	this.coolDown = 120;
	this.readyState = 0;
	this.Allumition = AllumitionSoul;
	this.moduleId = 0;
    }
    WeaponSoul.prototype.onNextTick = function(){
	this.readyState+=1;
    }
    WeaponSoul.prototype.setAllumition = function(allumition){
	this.Allumition = allumition;
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
	var allumition = new (this.Allumition)(this); 
	allumition.start();
	console.log("fired!");
	this.readyState = 0;
    }
    WeaponSoul.prototype.toData = function(){
	return this.moduleId;
    }
    var CannonEmitterSoul = WeaponSoul.sub();
    CannonEmitterSoul.prototype._init = function(){
	WeaponSoul.prototype._init.call(this);
	this.Allumition = CannonSoul;
	this.moduleId=0;
	this.coolDown=30;
    }
    var BeamEmitterSoul = WeaponSoul.sub();
    BeamEmitterSoul.prototype._init = function(){
	WeaponSoul.prototype._init.call(this);
	this.Allumition = BeamSoul;
	this.moduleId = 1;
	this.coolDown = 100;
    }
    var MissileEmitterSoul = WeaponSoul.sub();
    MissileEmitterSoul.prototype._init = function(state){
	MissileEmitterSoul.parent.prototype._init.call(this,state);
	this.Allumition = MissileSoul; 
	this.coolDown = 200;
	this.moduleId = 2;
    }
    exports.AllumitionSoul = AllumitionSoul;
    exports.WeaponSoul = WeaponSoul;
    exports.CannonEmitterSoul = CannonEmitterSoul;
    exports.CannonSoul = CannonSoul;
    exports.BeamEmitterSoul = BeamEmitterSoul;
    exports.BeamSoul = BeamSoul; 
    exports.MissileEmitterSoul = MissileEmitterSoul;
    exports.MissileSoul = MissileSoul;

    var a = 5;
})(exports)