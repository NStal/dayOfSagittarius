(function(exports){
    var Class = require("../util").Class;
    var Point = require("../util").Point;
    var Galaxy = Drawable.sub();
    Galaxy.prototype._init = function(info){
	this.position = new Point(info.position);
	this.color = info.color;
	this.name = info.name;
	this.size = info.size;
	this.type = "galaxy";
	this.to = info.to;
	this.server = info.server;
    }
    Galaxy.prototype.onDraw = function(context){
	context.lineWidth = 0.4;
	context.beginPath();
	context.arc(0,0,this.size,0,Math.PI*2);
	context.fillStyle = "white";
	context.fill(); 
	context.strokeStyle = this.color;
	context.stroke();
	
	if(this.name != settings.whereAmI)return;
	//show user current galaxy
	context.beginPath();
	context.textAlign ="center";
	context.fillStyle = "black";
	context.fillText("U",0,4);
	context.fill();
	context.fillWidth = 1;
    }
    exports.Galaxy = Galaxy;
})(exports)