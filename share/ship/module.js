(function(exports){
    var Class = require("../util").Class; 
    var Point = require("../util").Point;
    var EventEmitter = require("../util").EventEmitter;
    var Module = EventEmitter.sub();
    var GameInstance = require("../gameUtil").GameInstance;
    var Static = require("../static").Static;
    var BattleJudge = require("./battleJudge").BattleJudge;
    var Static = require("../static").Static;
    var ShipController = require("../shipController").ShipController;
    //Some basic model of modules.
    //Weapon,Shield,Armor
    //Weapon defined what ammunition can be used
    //while ammunition actually defined accuracy,damage and etc.
    
    //Allumition and it's sub class is only a weapon module
    //they don't store any information
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
    Module.prototype.attachItemInfo = function(itemInfo){
	for(var item in itemInfo.attribute){
	    this[item] = itemInfo.attribute[item];
	}
	this.itemId = itemInfo.id;
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
    var Engine = Module.sub();
    Engine.prototype._init = function(state){
	this.type="engine";
	Engine.parent.prototype._init.call(this,state);
	this.listen("onCalculateSpeedFactor");
	if(!this.speedFactor){
	    console.warn("no speed factor")
	    this.speedFactor = 1;
	}
	this.moduleId = 5;
    }
    Engine.prototype.onCalculateSpeedFactor = function(){
	return this.speedFactor;
    }
    Engine.prototype.toData = function(){
	return {
	    itemId:this.itemId
	};
    }
    var Shield = Module.sub();
    Shield.prototype._init = function(state){
	this.type = "shield";
	Shield.parent.prototype._init.call(this,state);
	/*this.ability.capacity = 1000;
	  this.ability.recoverInterval = 900; // 300point/30s
	  this.ability.recoverAmmount = 300;
	  this.ability.electricityConsumption = 300;*/
	this.listen("onBeforeHit");
	this.listen("onNextTick");
	this.listen("onShieldRecharge");
	this.moduleId = 3;
	if(state){
	    if(typeof state.capacity == "number")
		this.state.capacity = state.capacity;
	    if(typeof state.recoverState == "number")
		this.state.recoverState = state.recoverState;
	}
    }
    //check if recover it.
    Shield.prototype.onShieldRecharge = function(value){
	if(this.ability.capacity-this.state.capacity>value){
	    this.state.capacity+=value;
	    return 0;
	}
	var used = this.ability.capacity - this.state.capacity;
	this.state.capacity = this.ability.capacity;
	return value - used;
    }
    Shield.prototype.onNextTick = function(){
	if(this.ship.state.electricity<=0)return; 
	if(this.state.capacity>=this.ability.capacity)return;
	if(this.state.recoverState<this.ability.recoverInterval){
	    this.state.recoverState+=1;
	}
	if(this.state.recoverState>=this.ability.recoverInterval 
	   && this.ship.state.electricity>this.ability.electricityConsumption){
	    this.state.recoverState = 0; 
	    this.ship.state.electricity -= this.ability.electricityConsumption;
	    this.state.capacity+=this.ability.recoverAmmount;
	    if(this.state.capacity>this.ability.capacity)this.state.capacity=this.ability.capacity;
	}
    }
    Shield.prototype.init = function(manager){
	Module.prototype.init.call(this,manager);
	if(typeof this.state.capacity != "number"){
	    this.state.capacity = this.ability.capacity;
	}
	
	if(typeof this.state.recoverState != "number"){
	    this.state.recoverState = 0;
	}
    }
    Shield.prototype.onBeforeHit = function(value,bywho){
	var left = this.state.capacity-value;
	//debug
	if(left<=0){
	    this.state.capacity = 0;
	    return -left;
	}
	this.state.capacity = left;
	return 0;
    }
    Shield.prototype.toData = function(){
	return {
	    itemId:this.itemId
	    ,capacity:this.state.capacity
	    ,recoverState:this.state.recoverState

	};
    }
    var Armor = Module.sub();
    Armor.prototype._init = function(state){
	Armor.parent.call(this,state);
	this.listen("onDamage");
	this.type = "armor";
	if(state&&typeof state.resistPoint == "number"){
	    this.state.resistPoint = state.resistPoint;
	}
    }
    Armor.prototype.init = function(manager){
	Module.prototype.init.call(this,manager);
	if(typeof this.state.resistPoint != "number"){
	    this.state.resistPoint = this.ability.resistPoint;
	}
    }
    Armor.prototype.onDamage = function(value,bywho){
	var left = this.state.resistPoint-value;
	//debug
	if(left<=0){
	    this.state.resistPoint = 0;
	    return -left;
	}
	this.state.resistPoint = left;
	return 0;
    }
    Armor.prototype.toData = function(){
	return {
	    itemId:this.itemId
	    ,resistPoint:this.state.resistPoint
	};
    }
    var Allumition = GameInstance.sub();
    Allumition.prototype._init = function(weapon,info){
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
    Allumition.prototype.start = function(){
	Allumition.parent.prototype.start.call(this);
	if(Static.needDisplay){
	    //for browser
	    Static.battleFieldDisplayer.add(this);
	    this.position = new Point(this.weapon.target.cordinates);
	}
    }
    Allumition.prototype.stop = function(){
	//this.emit("stop");
	if(this.onStop)this.onStop();
	Allumition.parent.prototype.stop.call(this);
	if(Static.needDisplay){
	    Static.battleFieldDisplayer.remove(this);
	}
    }
    Allumition.prototype.next = function(){
	if(this.index==0){
	    if(!this.isMissed){
		this.hit(); 
		
	    }
	}
	if(this.index==this.count){
	    //end explotion
	    this.stop();
	}
	this.index++;
    }
    Allumition.prototype.hit = function(){
	this.target.onHit(this,this.damagePoint); 
    }
    
    var ShieldRepairPulse = Allumition.sub();
    ShieldRepairPulse.prototype._init = function(weapon,info){
	ShieldRepairPulse.parent.prototype._init.call(this,weapon,info);
	if(info){
	    this.repairAmmount = info.repairAmmount;
	    this.count = info.count;
	}
    }
    ShieldRepairPulse.prototype.start = function(){
	ShieldRepairPulse.parent.prototype.start.call(this);
	if(this.weapon.ship.cordinates.distance(this.target)>this.range){
	    this.isMissed = true;
	}else{
	    this.isMissed = false;
	}
	if(Static.needDisplay){
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
    }
    
    ShieldRepairPulse.prototype.onDraw = function(context){
	context.beginPath();
	context.moveTo(this.from.x,this.from.y);
	context.lineTo(this.to.x,this.to.y);
	context.strokeStyle = "blue";
	context.lineWidth = Math.random()*1.5;
	context.stroke();
    }
    ShieldRepairPulse.prototype.next = function(){
	if(this.index==0){
	    if(!this.isMissed){
		console.log("hit repair",this.repairAmmount);
		var left = this.repairAmmount;
		var tempArr = this.target.moduleManager.events["onShieldRecharge"]
		for(var i=0,length=tempArr.length;i < length;i++){
		    var item = tempArr[i];
		    left = item(left); 
		}
	    }
	}
	if(this.index==this.count){
	    this.stop();
	}
	this.index++;
    }
    var Cannon = Allumition.sub();
    Cannon.prototype._init = function(weapon,info){
	Cannon.parent.prototype._init.call(this,weapon,info); 
	this.count = 8;
    }
    Cannon.prototype.onDraw = function(context){
	this._animateIndex*=1.15;
	context.beginPath();
	context.globalAlpha = 1/this._animateIndex;
	context.arc(0,0,this._animateIndex*1.2,0,Math.PI*2);
	context.fillStyle = "red";
	context.fill();
    }
    Cannon.prototype.start = function(){
	Cannon.parent.prototype.start.call(this);
	this.isMissed = BattleJudge.isMissed(this); 
	if(Static.needDisplay){
	    var __p = Point.Point(this.weapon.target.cordinates);
	    __p.x += (Math.random()-0.5) *10;
	    __p.y += (Math.random()-0.5)*10;
	    if(this.position)
		this.position.release();
	    this.position = __p;
	    this._animateIndex = 3;
	}
    }
    var Beam = Allumition.sub();
    Beam.prototype._init = function(weapon,info){
	Beam.parent.prototype._init.call(this,weapon,info);
    }
    Beam.prototype.start = function(){
	Beam.parent.prototype.start.call(this);
	//judge is missed;
	this.isMissed = BattleJudge.isMissed(this); 
	if(Static.needDisplay){
	    
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
    }
    
    Beam.prototype.onDraw = function(context){
	context.beginPath();
	context.moveTo(this.from.x,this.from.y);
	context.lineTo(this.to.x,this.to.y);
	context.strokeStyle = "red";
	context.lineWidth = Math.random()*1.5;
	context.stroke();
    }
    Beam.prototype.hit = function(){
	this.target.onHit(this,this.damagePoint);
    }
    Beam.prototype.next = function(){
	this.index++;
	if(!this.isMissed){
	    this.hit();
	}
	if(this.index==this.count){
	    this.stop();
	}
    }
    var Missile = Allumition.sub();
    Missile.prototype._init = function(weapon,info){
	if(!weapon){
	    return;
	}
	Missile.parent.prototype._init.call(this,weapon,info);
	this.speed = 1;
	this.maxSpeed = 7;
	this.position = new Point(weapon.ship.cordinates);
    }
    
    Missile.prototype.start = function(){
	Missile.parent.prototype.start.call(this);
	if(Static.needDisplay){
	    this.position = new Point(this.weapon.ship.cordinates);
	}
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
    Missile.prototype.next = function(){
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
    var Weapon = Module.sub();
    Weapon.prototype._init = function(state){
	Weapon.parent.prototype._init.call(this,state);
	this.type = "weapon";
	this.listen("onNextTick");
	this.coolDown = 120;
	this.readyState = this.readyState?this.readyState:0;
	this.Allumition = Allumition;
	this.moduleId = 0;
	this.target = null;
	//above is used for clientside
	this.autoFire = false;
	this.readyFire = true;
	this.listen("onPresent");
	this.listen("onIntent"); 
    }
    //fire is for clientSide
    
    Weapon.prototype.fire = function(){
	if(this.target){
	    Static.gateway.send((new ShipController(this.manager.ship)).activeModule(this));
	    console.log("send fired");
	    return;
	}
	console.log("can't fire without locking the target"); 
    }
    Weapon.prototype.isReady = function(){
	return this.coolDown<=this.readyState;
    }
    Weapon.prototype.onNextTick = function(){
	var outDated = 1000; 
	this.readyState+=1;
	//
	if(this.target && (this.target.isDead||this.target.isMissed)){
	    this.target = null;
	    this.readyState = true;
	}
	if(Static.clientSide 
	   &&this.autoFire 
	   && this.target 
	   && this.readyState>=this.coolDown 
	   && (this.readyFire == true||Date.now()-this.lastFireDate>outDated)){
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
		    context.lineTo(-15,-53);
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
    Weapon.prototype.setAllumition = function(allumition){
	this.Allumition = allumition;
    }
    Weapon.prototype.setTarget = function(target){
	this.target = target;
	if(this.target){
	    this.emit("target",this,this.target);
	}
    }
    Weapon.prototype.releaseTarget = function(){
	this.emit("release","target");
	this.target = null;
    }
    Weapon.prototype.active = function(){
	this.readyFire = true;
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
	console.log("fired");
	this.emit("active");
	this.readyState = 0;
    }
    Weapon.prototype.toData = function(){
	return {
	    readyState:this.readyState
	    ,target:this.target?this.target.id:undefined
	    ,itemId:this.itemId
	}
    }
    var CannonEmitter = Weapon.sub();
    CannonEmitter.prototype._init = function(){
	Weapon.prototype._init.call(this);
	this.Allumition = Cannon;
	if(Static.browser){
	    this.name = "CannonEmitter";
	    this.sound = Static.resourceLoader.get("sound_cannon");
	    this.on("active",function(){
		if(this.sound){
		    var audio = new Audio(this.sound.src);
		    //audio.volume=0.2;
		    audio.play();
		}
	    });
	}
	/*
	  this.moduleId=0;
	  this.coolDown=30; 
	  this.ammunitionInfo = {
	  damagePoint:220
	  ,range:300
	  ,count:8
	  }*/
    }
    var BeamEmitter = Weapon.sub();
    BeamEmitter.prototype._init = function(){
	Weapon.prototype._init.call(this);
	this.Allumition = Beam;
	if(Static.browser){
	    
	    this.name = "BeamEmitter";
	    this.weaponImage = Static.resourceLoader.get("weapon_beam");
	    this.on("active",function(){
		(new Audio(Static.resourceLoader.get("sound_beam").src)).play();
	    })
	}
    }
    var RemoteShieldRecharger = Weapon.sub();
    RemoteShieldRecharger.prototype._init = function(state){
	RemoteShieldRecharger.parent.prototype._init.call(this,state);
	this.Allumition = ShieldRepairPulse;
	if(Static.browser){
	    this.name = "RemoteShieldRecharger";
	    this.on("active",function(){
		(new Audio(Static.resourceLoader.get("sound_beam").src)).play();
	    })
	}
    } 
    
    RemoteShieldRecharger.prototype.onPresent = function(objects){
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
		    context.strokeStyle = "green";
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
    RemoteShieldRecharger.prototype.onIntent = function(objects){
	var self = this;
	if(self.target){
	    objects.push({
		color:"green"
		,target:self.target
	    })
	}
    }
    
    var MissileEmitter = Weapon.sub();
    MissileEmitter.prototype._init = function(state){
	MissileEmitter.parent.prototype._init.call(this,state);
	this.Allumition = Missile; 
	this.name = "MissileEmitter";
    }
    exports.Engine = Engine;
    exports.RemoteShieldRecharger = RemoteShieldRecharger;
    exports.ShieldRepairPulse = ShieldRepairPulse;
    exports.Shield = Shield;
    exports.Shield = Shield;
    exports.Armor = Armor;
    exports.Armor = Armor;
    
    exports.Allumition = Allumition;
    exports.Weapon = Weapon;
    exports.CannonEmitter = CannonEmitter;
    exports.Cannon = Cannon;
    exports.BeamEmitter = BeamEmitter;
    exports.Beam = Beam; 
    exports.MissileEmitter = MissileEmitter;
    exports.Missile = Missile;

    var a = 5;
})(exports)