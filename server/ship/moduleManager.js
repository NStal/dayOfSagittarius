(function(exports){
    var Class = require("../util").Class;
    var Container = require("../util").Container;
    var ModuleManager = Container.sub();
    ModuleManager.prototype.eventEnum = {
	onDamage:0
	,onFire:1
    }
    ModuleManager.prototype._init = function(ship){
	this.ship = ship;
	this.events = {};
	for(var item in this.eventEnum){
	    this.events[item] = [];
	}
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
    ModuleManager.prototype.register = function(event,handler){
	if(typeof this.events[event]=="undefined")return false;
	this.events[event].push(handler);
    }
    ModuleManager.prototype.unregister = function(event,handler){
	if(typeof this.events[event]=="undefined")return false;
	var handlers = this.events[event]
	for(var i=0;i< handlers.length ;i++){
	    if(handlers[i]==handler){
		handlers.splice(i,handler);
		return true;
	    }
	}
	return false;
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
    var Module = Class.sub();
    Module.prototype._init = function(){
	return;
    }
})(exports)