(function(exports){
    var Weapon = require("../share/ship/module").WeaponSoul.sub();
    var Allumition = (require("../share/ship/module").AllumitionSoul).sub();
    var MissileSoul = require("../share/ship/module").MissileSoul;
    var MissileEmitterSoul = require("../share/ship/module").MissileEmitterSoul;
    var ModuleManager = require("../share/ship/moduleManager").ModuleManager;
    Allumition.prototype.start = function(){
	Allumition.parent.prototype.start.call(this);
	Static.interactionManager.add(this);
	this.position = new Point(this.weapon.ship.AI.destination.target.cordinates);
    }
    Allumition.prototype.stop = function(){
	Static.interactionManager.remove(this);
	Allumition.parent.prototype.stop.call(this);
    }
    var Cannon = CannonSoul.sub().extend(Allumition);
    Cannon.prototype.start = function(){
	CannonSoul.prototype.start.call(this);
	Static.interactionManager.add(this);
	var __p = new Point(this.weapon.ship.AI.destination.target.cordinates);
	__p.x += (Math.random()-0.5) *10;
	__p.y += (Math.random()-0.5)*10;
	this.position = __p
    }
    Cannon.prototype.onDraw = function(context){
	context.beginPath();
	context.arc(0,0,1.5+Math.sin(this.index)/Math.PI,0,Math.PI*2);
	context.fillStyle = "red";
	context.fill();
    }
    var Beam = BeamSoul.sub().extend(Allumition);
    Beam.prototype.start = function(){
	BeamSoul.prototype.start.call(this);
	Static.interactionManager.add(this);
	this.from = this.weapon.ship.cordinates;
	this.to = this.weapon.ship.AI.destination.target.cordinates;
	this.position = {x:0,y:0};
    }
    Beam.prototype.next = BeamSoul.prototype.next;
    Beam.prototype.hit = BeamSoul.prototype.hit;
    Beam.prototype.onDraw = function(context){
	context.beginPath();
	context.moveTo(this.from.x,this.from.y);
	context.lineTo(this.to.x,this.to.y);
	context.strokeStyle = "red";
	context.lineWidth = Math.random()*1.5;
	context.stroke();
    }
    var Missile  = MissileSoul.sub().extend(Allumition);
    Missile.prototype.start = function(){
	Allumition.prototype.start.call(this);
	this.position = new Point(this.weapon.ship.cordinates);
    }
    Missile.prototype.next = MissileSoul.prototype.next;
    Missile.prototype.onDraw = function(context){
	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(5,0);
	context.lineWidth=1.2;
	context.strokeStyle = "red";
	context.stroke();
	context.arc(0,0,1+Math.sin(this.index/4),0,Math.PI*2);
	context.fillStyle = "red";
	context.fill();
    }
    Weapon.prototype._init = function(){
	this.Allumition = Allumition;
	this.autoFire = false;
	this.listen("onPresent");
	this.name = "Weapon"
	this.readyFire = true;//used for indicate fire command hasn't been send
    }
    Weapon.prototype.fire = function(){
	if(this.manager.ship.AI.destination.target){
	    Static.gateway.send((new ShipController(this.manager.ship)).activeModule(this));
	    console.log("send fired");
	    return;
	}
	console.log("can't fire without locking the target");
    }
    Weapon.prototype.active = function(){
	this.readyFire = true;
	WeaponSoul.prototype.active.call(this)
    }
    Weapon.prototype.onNextTick = function(){
	Weapon.parent.prototype.onNextTick.call(this);
	if(this.autoFire && this.manager.ship.AI.destination.target && this.readyState>=this.coolDown && this.readyFire == true){
	    this.fire();
	    this.readyFire = false;
	}
    }
    Weapon.prototype.onPresent = function(objects){
	var self = this;
	objects.push({
	    callback:function(){
		self.autoFire = !self.autoFire;
	    }
	    ,present:function(context){
		context.beginPath();
		context.moveTo(0,0);
		context.lineTo(20,0)
		context.arc(0,0,40,0,Math.PI*2*self.readyState/self.coolDown);
		context.closePath();
		context.fillStyle = "black";
		context.fill();
		context.beginPath();
		context.fillStyle = "white";
		context.textAlign = "center";
		context.fillText(self.name,0,3);
	    }
	});
    }
    var CannonEmitter = CannonEmitterSoul.sub();
    CannonEmitter.extend(Weapon);
    CannonEmitter.prototype._init = function(state){
	CannonEmitter.parent.prototype._init.call(this,state);
	Weapon.prototype._init.call(this);
	this.Allumition = Cannon;
	this.name= "Cannon";
    }
    var BeamEmitter = BeamEmitterSoul.sub();
    BeamEmitter.extend(Weapon);
    BeamEmitter.prototype._init = function(state){
	BeamEmitter.parent.prototype._init.call(this,state);
	Weapon.prototype._init.call(this);
	this.Allumition = Beam;
	this.name= "Beam";
    }
    
    var MissileEmitter = MissileEmitterSoul.sub();
    MissileEmitter.extend(Weapon);
    MissileEmitter.prototype._init = function(state){
	MissileEmitter.parent.prototype._init.call(this,state);
	Weapon.prototype._init.call(this);
	this.Allumition = Missile;
	this.name = "Missile";
    }
    ModuleManager.prototype.moduleEnum = {
	0:CannonEmitter
	,1:BeamEmitter
	,2:MissileEmitter
    }
    exports.MissileEmitter = MissileEmitter;
    exports.Weapon = Weapon;
})(exports)
