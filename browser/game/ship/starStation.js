(function(exports){
    var StarStation = require("../share/ship/starStation").StarStationSoul.sub();
    StarStation.prototype._init = function(info){
	this.color = "blue";
	StarStation.parent.prototype._init.call(this,info);
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