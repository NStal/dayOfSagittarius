(function(exports){
    var Drawable = require("./framework/drawable").Drawable;
    var TextPrinter = Drawable.sub();
    TextPrinter.prototype._init = function(){
	this.lineHeight = 18;
	this.color = "black";
	this.shadowBlur = 0;
	this.shadowColor = "black";
	this.alpha = 1;
    }
    TextPrinter.prototype.setText = function(text){
	this.textArray = text.split("\n"); 
    }
    TextPrinter.prototype.onDraw = function(context){
	context.save();
	context.fillStyle = this.color;
	context.shadowBlur = this.shadowBlur;
	context.globalAlpha = this.alpha;
	context.shadowColor = this.shadowColor;
	for(var i=0,length=this.textArray.length;i < length;i++){
	    var item = this.textArray[i]; 
	    context.translate(0,this.lineHeight);
	    context.beginPath();
	    context.fillText(item,0,0);
	}
	context.restore();
    }
    exports.TextPrinter = TextPrinter;
})(exports)