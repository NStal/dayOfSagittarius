(function(exports){
    var Drawable = require("../drawing/drawable").Drawable;
    var Galaxy = require("./galaxy").Galaxy;
    var settings = require("./settings").settings;
    var GalaxyMap = Drawable.sub();
    GalaxyMap.prototype._init = function(mapInfos){
	this.bgColor = "white";
	for(var i=0;i < mapInfos.length;i++){
	    this.add(new Galaxy(mapInfos[i]));
	}
    }
    GalaxyMap.prototype.onDraw = function(context){
	context.beginPath();
	context.rect(0,0,settings.width,settings.height);
	context.fillStyle = this.bgColor;
	context.fill();
	this.drawStarRoad(context);
	if(this.selectGalaxy){
	    context.beginPath();
	    context.textAlign = "center";
	    context.fillStyle = "black";
	    context.fillText(this.selectGalaxy.name,settings.width/2,30);
	    context.fill();
	}
    }
    GalaxyMap.prototype.drawStarRoad = function(context){
	context.strokeStyle = "black";
	context.lineWidth = 0.3;
	context.beginPath();
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(!item.to)continue;
	    for(var j=0;j < item.to.length;j++){
		var toItem = this.getGalaxyByName(item.to[j]);
		if(!toItem){
		    console.trace();
		    throw "Broken Galaxy Map no galaxy named "+item.to[j];
		}
		context.moveTo(item.position.x,item.position.y);
		context.lineTo(toItem.position.x,toItem.position.y);
	    }
	}
	context.stroke();
	context.lineWidth = 1;
    }
    GalaxyMap.prototype.getGalaxyByName = function(name){
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.name == name && item.type =="galaxy")return item;
	}
	return null;
    }
    GalaxyMap.prototype.findGalaxyByPosition = function(point){
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i]
	    if(item.position.distance(point)<item.size
	       &&item.type=="galaxy"){
		return item;
	    }
	}
    }
    exports.GalaxyMap = GalaxyMap
})(exports)