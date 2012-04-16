(function(exports){
    var StarGate = require("../share/ship/starGate").StarGateSoul.sub();
    StarGate.prototype._init = function(info){
	this.color = "black";
	StarGate.parent.prototype._init.call(this,info);
    }
    StarGate.prototype.onDraw = function(context){
	context.beginPath();
	context.arc(0,0,this.size,0,Math.PI*2);
	context.strokeStyle = this.color;
	context.stroke();
	
	context.fillStyle = this.color;
	context.textAlign = "center";
	context.beginPath();
	context.fillText("StarGate",0,4);
    }
    exports.StarGate = StarGate;
})(exports)