(function(exports){
    var Class = require("../util").Class;
    var StarStationSoul = Class.sub();
    var Point = require("../util").Point;
    StarStationSoul.prototype._init = function(info){
	this.type = "station";
	if(!info){
	    return;
	}
	this.name = info.name;
	this.ships = [];
	this.position = new Point(info.position);
	this.id = info.id;
	this.size = 40;
    }
    StarStationSoul.prototype.getDestination = function(){
	var gs = require("../resource/galaxies.js").GALAXIES;
	for(var i=0;i < gs.length;i++){
	    if(gs[i].name == this.name)return gs[i];
	}
	console.trace();
	console.log("invalid starStation toGalaxy name",this.to);
	return null;
    }
    exports.StarStationSoul = StarStationSoul;
    exports.StarStation = StarStationSoul;
})(exports)