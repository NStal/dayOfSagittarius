(function(exports){
    var Class = require("../util").Class; 
    var Point = require("../util").Point;
    var EventEmitter = require("../util").EventEmitter;
    var Module = EventEmitter.sub();
    var GameInstance = require("../gameUtil").GameInstance;
    var Static = require("../static").Static;
    var BattleJudge = require("./battleJudge").BattleJudge;
    //Some basic model of modules.
    //Weapon,Shield,Armor
    //Weapon defined what ammunition can be used
    //while ammunition actually defined accuracy,damage and etc.
    Module.prototype._init = function(state){
	this.handlers = {};
	if(state){
	    this.state = state;
	}
	else{
	    this.state = {};
	}
	this.ability = {};
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
    var ShieldSoul = Module.sub();
    ShieldSoul.prototype._init = function(state){
	this.type = "shield";
	ShieldSoul.parent.call(this,state);
	this.ability.capacity = 1000;
	this.listen("onBeforeHit");
	this.moduleId = 3;
	if(state && typeof state.capacity == "number"){
	    this.state.capacity = state.capacity;
	}
    }
    ShieldSoul.prototype.init = function(manager){
	Module.prototype.init.call(this,manager);
	if(typeof this.state.capacity != "number"){
	    this.state.capacity = this.ability.capacity;
	}
    }
    ShieldSoul.prototype.onBeforeHit = function(value,bywho){
	var left = this.state.capacity-value;
	//debug
	if(left<=0){
	    this.state.capacity = 0;
	    return -left;
	}
	this.state.capacity = left;
	return 0;
    }
    ShieldSoul.prototype.toData = function(){
	return {
	    id:this.moduleId
	    ,capacity:this.state.capacity
	};
    }
    var ArmorSoul = Module.sub();
    ArmorSoul.prototype._init = function(state){
	ArmorSoul.parent.call(this,state);
	this.ability.resistPoint = 1000;
	this.listen("onDamage");
	this.type = "armor"
	this.moduleId = 4;
	if(state&&typeof state.resistPoint == "number"){
	    this.state.resistPoint = state.resistPoint;
	}
    }
    ArmorSoul.prototype.init = function(manager){
	Module.prototype.init.call(this,manager);
	if(typeof this.state.resistPoint != "number"){
	    this.state.resistPoint = this.ability.resistPoint;
	}
    }
    ArmorSoul.prototype.onDamage = function(value,bywho){
	var left = this.state.resistPoint-value;
	//debug
	if(left<=0){
	    this.state.resistPoint = 0;
	    return -left;
	}
	this.state.resistPoint = left;
	return 0;
    }
    ArmorSoul.prototype.toData = function(){
	return {
	    id:this.moduleId
	    ,resistPoint:this.state.resistPoint
	};
    }
    var AllumitionSoul = GameInstance.sub();
    AllumitionSoul.prototype._init = function(weapon,info){
	if(!weapon){
	    return;
	} 
	this.target = weapon.target;
	this.weapon = weapon;
	this.count = 15;
	this.index = 0;
	this.range = info.range;
	this.damagePoint = info.damagePoint;
	this.count = info.count;
    }
    AllumitionSoul.prototype.start = function(){
	AllumitionSoul.parent.prototype.start.call(this);
	//this.emit("start");
	if(this.onStart)this.onStart();
    }
    AllumitionSoul.prototype.stop = function(){
	//this.emit("stop");
	if(this.onStop)this.onStop();
	AllumitionSoul.parent.prototype.stop.call(this);
    }
    AllumitionSoul.prototype.next = function(){
	this.index++;
	if(this.index==this.count){
	    if(!this.isMissed)
		this.hit();
	    this.stop();
	}
    }
    AllumitionSoul.prototype.hit = function(){
	this.target.onHit(this,this.damagePoint); 
    }
    var CannonSoul = AllumitionSoul.sub();
    CannonSoul.prototype._init = function(weapon,info){
	CannonSoul.parent.prototype._init.call(this,weapon,info);
    }
    CannonSoul.prototype.start = function(){
	CannonSoul.parent.prototype.start.call(this); 
	this.isMissed = BattleJudge.isMissed(this); 
    }
    var BeamSoul = AllumitionSoul.sub();
    BeamSoul.prototype._init = function(weapon,info){
	BeamSoul.parent.prototype._init.call(this,weapon,info);
    }
    BeamSoul.prototype.start = function(){
	BeamSoul.parent.prototype.start.call(this);
	//judge is missed;
	this.isMissed = BattleJudge.isMissed(this); 
    }
    BeamSoul.prototype.hit = function(){
	this.target.onHit(this,this.damagePoint);
    }
    BeamSoul.prototype.next = function(){
	this.index++;
	if(!this.isMissed){
	    this.hit();
	}
	if(this.index==this.count){
	    this.stop();
	}
    }
    var MissileSoul = AllumitionSoul.sub();
    MissileSoul.prototype._init = function(weapon,info){
	if(!weapon){
	    return;
	}
	MissileSoul.parent.prototype._init.call(this,weapon,info);
	this.speed = 1;
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
	    this.stop();
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
	this.type = "weapon";
	this.listen("onNextTick");
	this.coolDown = 120;
	this.readyState = this.readyState?this.readyState:0;
	this.Allumition = AllumitionSoul;
	this.moduleId = 0;
	this.target = null;
    }
    WeaponSoul.prototype.isReady = function(){
	return this.coolDown<=this.readyState;
    }
    WeaponSoul.prototype.onNextTick = function(){
	this.readyState+=1;
    }
    WeaponSoul.prototype.setAllumition = function(allumition){
	this.Allumition = allumition;
    }
    WeaponSoul.prototype.setTarget = function(target){
	if(!this.targetLostHandler){
	    var self = this;
	    this.targetLostHandler=function(who,byWho){
		if(who==self.target)
		    self.releaseTarget(); 
	    }
	}
	if(this.target){
	    this.target.unbind("dead",this.targetLostHandler);
	}
	this.target = target;
	var self = this;
	this.target.on("dead",this.targetLostHandler);
	this.emit("target",this,this.target);
    }
    WeaponSoul.prototype.releaseTarget = function(){
	this.emit("release","target");
	this.target = null;
    }
    WeaponSoul.prototype.active = function(){
	if(!this.target){
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
	var target = this.target;
	var allumition = new (this.Allumition)(this,this.ammunitionInfo);
	allumition.start();
	console.log("fired!");
	this.readyState = 0;
    }
    WeaponSoul.prototype.toData = function(){
	return {
	    id:this.moduleId
	    ,readyState:this.readyState
	    ,target:this.target?this.target.id:undefined
	}
    }
    var CannonEmitterSoul = WeaponSoul.sub();
    CannonEmitterSoul.prototype._init = function(){
	WeaponSoul.prototype._init.call(this);
	this.Allumition = CannonSoul;
	this.moduleId=0;
	this.coolDown=30; 
	this.ammunitionInfo = {
	    damagePoint:220
	    ,range:300
	    ,count:8
	}
    }
    var BeamEmitterSoul = WeaponSoul.sub();
    BeamEmitterSoul.prototype._init = function(){
	WeaponSoul.prototype._init.call(this);
	this.Allumition = BeamSoul;
	this.moduleId = 1;
	this.coolDown = 100; 
	this.accuracyFactor = 1.4;
	this.ammunitionInfo = {
	    damagePoint:30
	    ,count:15
	    ,range:600
	}
    }
    var MissileEmitterSoul = WeaponSoul.sub();
    MissileEmitterSoul.prototype._init = function(state){
	MissileEmitterSoul.parent.prototype._init.call(this,state);
	this.Allumition = MissileSoul; 
	this.coolDown = 250;
	this.moduleId = 2;
	this.ammunitionInfo = {
	    damagePoint:800
	    ,range:1800
	}
    }
    exports.ShieldSoul = ShieldSoul;
    exports.Shield = ShieldSoul;
    exports.ArmorSoul = ArmorSoul;
    exports.Armor = ArmorSoul;
    
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