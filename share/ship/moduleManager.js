(function(exports){
    var Class = require("../util").Class;
    var Util = require("../util").Util; 
    var Container = require("../util").Container;
    var ModuleManager = Container.sub();
    var Weapon = require("./module").Weapon;
    var MissileEmitter = require("./module").MissileEmitter;
    var CannonEmitter = require("./module").CannonEmitter;
    var BeamEmitter = require("./module").BeamEmitter;
    var Shield = require("./module").Shield;
    var Static = require("../static").Static;
    var Armor = require("./module").Armor;
    var Engine = require("./module").Engine;
    var RemoteShieldRecharger = require("./module").RemoteShieldRecharger;
    //Event
    //"OnPresent":
    //parameter:array object
    //description
    ModuleManager.prototype.eventEnum = {
	onDamage:0
	,onPresent:1
	,onNextTick:2
	,onIntent:3
	,onBeforeHit:4
	,onDamage:5
	,onShieldRecharge:6
    }
    ModuleManager.prototype.moduleEnum = {
	0:CannonEmitter
	,1:BeamEmitter
	,2:MissileEmitter
	,3:Shield
	,4:Armor
	,5:RemoteShieldRecharger
	,6:Engine
    }
    ModuleManager.prototype._init = function(ship){
	this.ship = ship;
	this.events = {};
	for(var item in this.eventEnum){
	    this.events[item] = [];
	}
    }
    ModuleManager.prototype.validate = function(module){
	return true;
    }
    
    ModuleManager.prototype.add = function(module){
	if(this.validate(module)){
	    this.consume(module);
	    module.init(this);
	    ModuleManager.parent.prototype.add.call(this,module);
	}else{
	    console.trace();
	    throw "install module that don't meet requirement";
	}
    }
    ModuleManager.prototype.toData = function(){
	var data = [];
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    data.push(item.toData());
	}
	return data;
    }
    ModuleManager.prototype.register = function(event,handler){
	if(typeof this.events[event]=="undefined")return false;
	this.events[event].push(handler);
    }
    ModuleManager.prototype.unregister = function(event,handler){
	if(typeof this.events[event]=="undefined")return false;
	var handlers = this.events[event]
	for(var i=0;i< handlers.length ;i++){
	    if(handlers[i]==handler){
		handlers.splice(i,1);
		return true;
	    }
	}
	return false;
    }
    ModuleManager.prototype.getModuleByInfo = function(info){
	if(typeof info == "number"){
	    //comeform database 
	    var itemInfo = Static.gameResourceManager.get(info);
	    if(!itemInfo){
		console.error("invalid item id",info);
		console.trace();
		return;
	    }
	    var module =  new (this.moduleEnum[itemInfo.attribute.moduleId])();
	    module.attachItemInfo(itemInfo);
	    return module;
	}
	var itemInfo = Static.gameResourceManager.get(info.itemId);
	if(!itemInfo){
	    console.error("invalid item id",info.itemId);
	    console.trace();
	    return;
	}
	var module = new (this.moduleEnum[itemInfo.attribute.moduleId])(info);
	module.attachItemInfo(itemInfo)
	//update sth like readyState ,capacity left ,to the module
	Util.update(module,info);
	return module;
    }
    ModuleManager.prototype.remove = function(module){
	if(ModuleManager.parent.prototype.remove.call(this,module)){
	    module.clear(this);
	    this.produce(module);
	}
	else{
	    console.trace();
	    throw "remove module that not installed";
	}
    }
    ModuleManager.prototype.consume = function(module){
	//consume what modules requires
    }
    ModuleManager.prototype.produce = function(module){
	//produce what module requires
    }
    exports.ModuleManager = ModuleManager;
})(exports)