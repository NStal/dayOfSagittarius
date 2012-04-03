(function(exports){
    var Class = require("../util").Class;
    var Container = require("../util").Container;
    var ModuleManager = Container.sub();
    var Weapon = require("./module").Weapon;
    console.log("weapon",Weapon);
    //Event
    //"OnPresent":
    //parameter:array object
    //description
    ModuleManager.prototype.eventEnum = {
	onDamage:0
	,onPresent:1
	,onNextTick:2
    }
    ModuleManager.prototype.moduleEnum = {
	0:Weapon
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
	if(info==1)return new Weapon()
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