(function(exports){
    var StarGate = require("../share/ship/starGate").StarGateSoul.sub();
    StarGate.prototype._init = function(info){
	StarGate.parent.prototype._init.call(this,info);
	this.blur = 10;
	this.innerOpacity = 0.1;
	this.borderColor = "#00bbff";
	this.innerColor = "#00bbff";
	this.name = this.to;
    }
    StarGate.prototype.onDraw = function(context){
	
	context.save();
	context.beginPath(); 
	context.arc(0,0,this.size,0,Math.PI*2);
	context.shadowBlur = this.blur;
	context.shadowColor = "#00bbff";
	context.globalAlpha = this.innerOpacity;
	context.fillStyle = this.innerColor; 
	context.fill(); 
	
	
	context.textAlign = "center";
	context.beginPath()
	context.fillStyle = "white";
	context.shadowColor = "#00bbff";
	//context.shadowBlur = 10;
	context.globalAlpha = 1;
	context.fillText(this.name,0,4);
	context.restore();
	context.beginPath();
	context.arc(0,0,this.size,0,Math.PI*2);
	context.strokeStyle = this.borderColor;
	context.stroke();
	
    }
    exports.StarGate = StarGate;
})(exports)