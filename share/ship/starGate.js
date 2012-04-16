(function(exports){
    var Class = require("../util").Class;
    var StarGateSoul = Class.sub();
    var Point = require("../util").Point;
    StarGateSoul.prototype._init = function(info){
	this.type = "gate";
	if(!info){
	    return;
	}
	this.to = info.to;
	this.position = new Point(info.position);
	this.id = info.id;
	this.size = 40;
	
    }
    StarGateSoul.prototype.getDestination = function(){
	var gs = require("../resource/galaxies.js").GALAXIES;
	for(var i=0;i < gs.length;i++){
	    if(gs[i].name == this.name)return gs[i];
	}
	console.trace();
	console.log("invalid stargate toGalaxy name",this.to);
	return null;
    }
    exports.StarGateSoul = StarGateSoul; 
    exports.StarGate = StarGateSoul;
})(exports)