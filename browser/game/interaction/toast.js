(function(exports){
    var Drawable = require("../drawing/drawable").Drawable;
    var ModulePanel = Drawable.sub();
    var Interaction = require("./interaction").Interaction;
    var settings = require("../settings").settings;
    var Point = require("./util").Point;
    var Toaster = Drawable.sub();
    Toaster.count = 0;
    Toaster.items = []
    Toaster.add = function(item){
	this.count++;
	this.items.push(item);
	item.position.y = settings.height/2+18*this.count;
    }
    Toaster.remove = function(toRemove){
	var hasRemove = false;
	for(var i=0,length=this.items.length;i < length;i++){
	    var item = this.items[i];
	    if(item==toRemove){
		this.items.splice(i,1);
		this.count--;
		hasRemove = true;
		continue;
	    }
	    if(hasRemove){
		if(item)
		    item.position.y -=18;
	    }
	}
	if(hasRemove)return true;
	return false;
    }
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
	this.position = Point.Point(settings.width/2,settings.height/2);
	Static.UIDisplayer.add(this); 
	Toaster.add(this);
    }
    Toaster.prototype.hide = function(){
	Toaster.remove(this);
	Static.UIDisplayer.remove(this);
	this.position.release();
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