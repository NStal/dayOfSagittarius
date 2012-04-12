(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Container = require("../drawing/drawable").Drawable;
    var MouseInteraction = require("./interaction/mouseInteraction").MouseInteraction; 
    var Interaction = Class.sub();
    //Other interaction subClasses get world through super class
    //Interaction
    Interaction.prototype._init = function(){
	
    }
    Interaction.prototype.init = function(manager){
	if(!manager&&!this.manager){
	    console.log("Interaction init need a InteractionManager"); 
	    console.trace();
	}
	for(var i=0;i<this.handlers.length;i++){
	    var item = this.handlers[i];
	    manager.register(item);
	}
	this.manager = manager;
	return this;
    }
    Interaction.prototype.clear = function(){
	for(var i=0;i<this.handlers.length;i++){
	    var item = this.handlers[i];
	    this.manager.unregister(item);
	}
    }
    exports.Interaction = Interaction;
})(exports)