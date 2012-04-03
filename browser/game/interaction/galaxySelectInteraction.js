(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var GalaxySelectInteraction = Interaction.sub();
    var GalaxyMark = Drawable.sub();
    GalaxyMark.prototype._init = function(){
	this.count=8;
	this.color = "#60dfff";
    }
    GalaxyMark.prototype.set = function(galaxy){
	this.galaxy = galaxy;
	game.galaxyMap.selectedGalaxy = galaxy;
	if(!galaxy)return;
	this.position = galaxy.position;
	this.size = galaxy.size+4;
	this.rotation =0;
    }
    GalaxyMark.prototype.release = function(){
	this.galaxy = null;
	this.done = false;
    }
    GalaxyMark.prototype.drawSelection = function(context){
	if(!this.galaxy){
	    return;
	}
	this.rotation +=0.15
	context.strokeStyle = this.color;
	context.beginPath();
	context.arc(0,0,this.size,0,Math.PI*2);
	context.stroke();
	
	context.beginPath();
	context.arc(0,this.size,3,0,Math.PI*2);
	context.fillStyle = this.color; 
	context.fill()
    }
    GalaxyMark.prototype.onDraw = function(context){
	if(!this.galaxy){
	    return;
	}
	this.drawSelection(context);
    }
    GalaxySelectInteraction.prototype._init = function(){
	var self = this;
	this.galaxyMark = new GalaxyMark();
	this.handlers = [
	    {
		where:"galaxyMap"
		,type:"mouseUp"
		,handler:function(position){
		    var galaxy =  self.manager.galaxyMap.findGalaxyByPosition(position);
		    if(galaxy){
			self.galaxyMark.set(galaxy); 
			self.manager.galaxyMap.selectGalaxy = galaxy;
			console.log(galaxy.name,"selected");
		    }else{
			self.galaxyMark.set(null); 
			self.manager.galaxyMap.selectGalaxy = null;
			console.log("unselect galaxy");
		    }
		}
	    }
	    ,{
		where:"galaxyMap"
		,type:"mouseMove"
		,handler:function(position){
		    var galaxy =  self.manager.galaxyMap.findGalaxyByPosition(position);
		    if(galaxy){
			self.manager.mouse.pointer.type = self.manager.mouse.pointer.types.onGalaxy;
		    }else{
			self.manager.mouse.pointer.type = self.manager.mouse.pointer.types.normal;
		    }
		}
	    }
	]
    }
    
    GalaxySelectInteraction.prototype.init = function(manager){
	GalaxySelectInteraction.parent.prototype.init.call(this,manager);
	manager.galaxyMap.add(this.galaxyMark);
    }
    GalaxySelectInteraction.prototype.clear = function(){
	GalaxySelectInteraction.parent.prototype.clear.call(this);
	this.manager.galaxyMap.remove(this.galaxyMark);
    }
    exports.GalaxySelectInteraction = GalaxySelectInteraction;
    exports.GalaxyMark = GalaxyMark;
})(exports)
