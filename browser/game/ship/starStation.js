(function(exports){
    var StarStation = require("../share/ship/starStation").StarStationSoul.sub();
    //Drawable.mixin(StarStation);
    StarStation.prototype._init = function(info){
	if(!info){
	    return;
	}
	StarStation.parent.prototype._init.call(this,info);
	this.color = "blue";
    }
    StarStation.prototype.onDraw = function(context){
	context.beginPath(); 
	context.arc(0,0,this.size,0,Math.PI*2);
	context.strokeStyle = this.color;
	context.stroke();
	
	context.fillStyle = this.color;
	context.textAlign = "center";
	context.beginPath()
	context.fillText(this.name,0,4);
    }
    exports.StarStation = StarStation;
})(exports)