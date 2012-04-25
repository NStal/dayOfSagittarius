(function(exports){
    var Drawable = require("../drawing/drawable").Drawable;
    var ModulePanel = Drawable.sub();
    var Interaction = require("./interaction").Interaction;
    var settings = require("../settings").settings;
    var Point = require("./util").Point;
    var Toaster = Drawable.sub();
    Toaster.prototype._init = function(){
	var self = this;
	this.instance = new Instance();
	this.instance.setRate(30);
	this.instance.next = function(){
	    self.next();
	}
	this.instance.start();
	this.index =0;
	this.fadeTime = 10;
	this.holdTime = 90;
    }
    Toaster.prototype.show = function(text){
	this.text = text;
	this.position = new Point(settings.width/2,settings.height/2);
	Static.UIDisplayer.add(this);
    }
    Toaster.prototype.hide = function(){
	Static.UIDisplayer.remove(this);
	this.instance.stop();
    }
    Toaster.prototype.next = function(){
	this.index++;
    }
    Toaster.prototype.onDraw = function(context){
	if(this.index>=this.fadeTime+this.holdTime){
	    this.hide();
	    return;
	}
	context.save();
	context.textAlign = "center";
	if(this.index>this.holdTime)
	    context.globalAlpha = 1-(this.index-this.holdTime)/this.fadeTime;
	context.beginPath();
	context.font = "20pt";
	context.fillText(this.text,30,30);
	context.restore();
    }
    exports.Toaster = Toaster;
    exports.Toast = function(text){
	new Toaster().show(text);
    }
})(exports)