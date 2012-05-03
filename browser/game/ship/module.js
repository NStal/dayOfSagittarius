(function(exports){
    var Weapon = require("../share/ship/module").WeaponSoul.sub();
    var Allumition = require("../share/ship/module").AllumitionSoul;
    var MissileSoul = require("../share/ship/module").MissileSoul;
    var MissileEmitterSoul = require("../share/ship/module").MissileEmitterSoul;
    var ModuleManager = require("../share/ship/moduleManager").ModuleManager;
    var Shield = require("../share/ship/moduleManager").Shield;
    var Armor = require("../share/ship/moduleManager").Armor;
    Allumition.prototype.onStart = function(){
	this.type = "ammunition";
	Static.battleFieldDisplayer.add(this);
	this.position = new Point(this.weapon.target.cordinates);
    }
    Allumition.prototype.onStop = function(){
	Static.battleFieldDisplayer.remove(this);
    }
    Allumition.mixin = function(c){
	c.prototype.onStart = Allumition.prototype.onStart;
	c.prototype.onStop = Allumition.prototype.onStop;
    }
    var Cannon = CannonSoul.sub();
    Allumition.mixin(Cannon);
    Cannon.prototype.start = function(){
	CannonSoul.prototype.start.call(this);
	var __p = new Point(this.weapon.target.cordinates);
	__p.x += (Math.random()-0.5) *10;
	__p.y += (Math.random()-0.5)*10;
	this.position = __p;
	this._animateIndex = 3;
    }
    Cannon.prototype.onDraw = function(context){
	this._animateIndex*=1.15;
	context.beginPath();
	context.globalAlpha = 1/this._animateIndex;
	context.arc(0,0,this._animateIndex,0,Math.PI*2);
	context.fillStyle = "red";
	context.fill();
    }
    var Beam = BeamSoul.sub();
    Allumition.mixin(Beam);
    Beam.prototype.start = function(){
	BeamSoul.prototype.start.call(this);
	this.from = this.weapon.ship.cordinates;
	if(this.isMissed){
	    this.to = new Point(this.weapon.target.cordinates);
	    this.to.x += (Math.random()-0.5)/0.5*30; 
	    this.to.y += (Math.random()-0.5)/0.5*30;
	}else{
	    this.to = this.weapon.target.cordinates;
	}
	this.position = {x:0,y:0};
    }
    Beam.prototype.onDraw = function(context){
	context.beginPath();
	context.moveTo(this.from.x,this.from.y);
	context.lineTo(this.to.x,this.to.y);
	context.strokeStyle = "red";
	context.lineWidth = Math.random()*1.5;
	context.stroke();
    }
    var Missile  = MissileSoul.sub();
    Allumition.mixin(Missile);
    Missile.prototype.start = function(){
	Allumition.prototype.start.call(this);
	this.position = new Point(this.weapon.ship.cordinates);
    }
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
	this.listen("onIntent");
	this.name = "Weapon";
	this.readyFire = true;//used for indicate fire command hasn't been send
    }
    Weapon.prototype.fire = function(){
	if(this.target){
	    Static.gateway.send((new ShipController(this.manager.ship)).activeModule(this));
	    console.log("send fired");
	    return;
	}
	console.log("can't fire without locking the target");
    }
    Weapon.prototype.active = function(){
	this.readyFire = true;
	WeaponSoul.prototype.active.call(this)
	this.emit("active",this);
    }
    Weapon.prototype.onNextTick = function(){
	var outDated = 1000;
	Weapon.parent.prototype.onNextTick.call(this);
	if(this.target && this.target.isDead){
	    this.target = null;
	    this.readyState = true;
	}
	if(this.autoFire && this.target && this.readyState>=this.coolDown && (this.readyFire == true||Date.now()-this.lastFireDate>outDated)){
	    this.fire();
	    this.readyFire = false;
	    this.lastFireDate = Date.now();
	}
    }
    Weapon.prototype.onPresent = function(objects){
	var self = this;
	if(!self.shakeEffect){
	    self.shakeEffect = new Twinkle({min:0.6});
	}
	objects.push({
	    onActive:function(){
		//self.autoFire = !self.autoFire;
		new ModuleLockAtInteraction(self).init();
	    }
	    ,onActive2:function(){
		self.autoFire = !self.autoFire; 
	    }
	    ,present:function(context,position){
		if(self.autoFire)self.shakeEffect.onBeforeRender(context);
		//draw intent line to target
		context.save()
		if(self.target){
		    var t = Static.battleFieldDisplayer.battleFieldToScreen(self.target.cordinates).sub(position);
		    context.strokeStyle = "orange";
		    context.lineWidth = 0.5;
		    context.globalAlpha = 1;
		    context.beginPath();
		    context.moveTo(0,0);
		    context.lineTo(t.x,t.y);
		    context.stroke();
		}
		if(self.target 
		   && self.target.cordinates.distance(self.ship.cordinates)
		   > self.ammunitionInfo.range){
		    self.innerColor = "grey";
		}else{
		    self.innerColor = "white";
		}
		context.restore();
		context.beginPath();
		context.arc(0,0,50,0,Math.PI*2);
		context.fillStyle = "#00bbff";
		context.globalAlpha*=0.5;
		context.fill();
		context.globalAlpha *= 2;
		context.beginPath();
		context.arc(0,0,40,0,Math.PI*2); 
		context.shadowBlur = 20;
		context.clip();
		context.beginPath();
		context.moveTo(0,0);
		context.lineTo(20,0)
		context.arc(0,0,40,0,Math.PI*2*self.readyState/self.coolDown);
		context.closePath();
		context.fillStyle = self.innerColor;
		context.fill();
		if(self.weaponImage){
		    context.save();
		    context.drawImage(self.weaponImage,0,0,256,256,-40,-40,80,80);
		    context.restore();
		}else{
		    context.beginPath();
		    context.fillStyle = "black";
		    context.textAlign = "center";
		    context.fillText(self.name,0,3); 
		}
		
	    }
	});
    }
    Weapon.prototype.onIntent = function(objects){
	var self = this;
	if(self.target){
	    objects.push({
		color:"orange"
		,target:self.target
	    })
	}
    }
    var CannonEmitter = CannonEmitterSoul.sub();
    CannonEmitter.extend(Weapon);
    CannonEmitter.prototype._init = function(state){
	CannonEmitter.parent.prototype._init.call(this,state);
	Weapon.prototype._init.call(this);
	this.Allumition = Cannon;
	this.name= "Cannon";
	this.sound = Static.resourceLoader.get("sound_cannon");
	this.on("active",function(){
	    if(this.sound){
		var audio = new Audio(this.sound.src);
		//audio.volume=0.2;
		audio.play();
	    }
	});
    }
    var BeamEmitter = BeamEmitterSoul.sub();
    BeamEmitter.extend(Weapon);
    BeamEmitter.prototype._init = function(state){
	BeamEmitter.parent.prototype._init.call(this,state);
	Weapon.prototype._init.call(this);
	this.weaponImage = Static.resourceLoader.get("weapon_beam");
	this.Allumition = Beam;
	this.name= "Beam";
	this.on("active",function(){
	    (new Audio(Static.resourceLoader.get("sound_beam").src)).play();
	})
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
	,3:Shield
	,4:Armor
    }
    exports.MissileEmitter = MissileEmitter;
    exports.Weapon = Weapon;
})(exports)
