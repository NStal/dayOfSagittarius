(function(exports){
    var StarStation = require("../share/ship/starStation").StarStationSoul.sub();
    //Drawable.mixin(StarStation);
    StarStation.prototype._init = function(info){
	if(!info){
	    return;
	}
	StarStation.parent.prototype._init.call(this,info);
	this.color = "blue";
	this.innerColor = "#00bdff";
	this.innerOpacity = 0.2;
	this.blur = 5;
    }
    StarStation.prototype.onDraw = function(context){
	
	context.save();
	context.beginPath(); 
	context.arc(0,0,this.size,0,Math.PI*2);
	context.shadowBlur = this.blur;
	context.shadowColor = this.innerColor; 
	context.globalAlpha = this.innerOpacity;
	context.fillStyle = this.innerColor; 
	context.fill(); 
	
	
	context.textAlign = "center";
	context.beginPath()
	context.fillStyle = "white";
	context.shadowColor = "black";
	context.shadowBlur = 3;
	context.globalAlpha = 1;
	context.fillText(this.name,0,4);
	context.restore();
	context.beginPath();
	context.arc(0,0,this.size,0,Math.PI*2);
	context.strokeStyle = this.innerColor;
	context.stroke();
	
	
    }
    exports.StarStation = StarStation;
})(exports)