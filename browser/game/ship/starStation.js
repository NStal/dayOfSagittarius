(function(exports){
    var StarStation = require("../share/ship/starStation").StarStationSoul.sub();
    //Drawable.mixin(StarStation);
    StarStation.prototype._init = function(info){
	if(!info){
	    return;
	}
	StarStation.parent.prototype._init.call(this,info);
	this.innerColor = "#ffb400";
	this.borderColor = "#ffc600";
	this.innerOpacity = 0.10;
	this.blur = 10;
    }
    StarStation.prototype.onDraw = function(context){
	
	context.save();
	context.beginPath(); 
	context.arc(0,0,this.size,0,Math.PI*2);
	context.shadowBlur = this.blur;
	context.shadowColor = "#b86800";
	context.globalAlpha = this.innerOpacity;
	context.fillStyle = this.innerColor; 
	context.fill(); 
	
	
	context.textAlign = "center";
	context.beginPath()
	context.fillStyle = "white";
	context.shadowColor = "#b86800";
	//context.shadowBlur = 10;
	context.globalAlpha = 1;
	context.fillText(this.name,0,4);
	context.restore();
	context.beginPath();
	context.arc(0,0,this.size,0,Math.PI*2);
	context.strokeStyle = this.borderColor;
	context.stroke();
	
	
    }
    exports.StarStation = StarStation;
})(exports)