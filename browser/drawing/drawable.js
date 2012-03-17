(function(exports){
    var Container = require("../share/util").Container;
    var Point = require("../share/util").Point;
    var Instance = require("../share/gameUtil").GameInstance;
    //Drawable:
    //1.Has a method onDraw
    //2.Contain some drawing info
    var Drawable = Container.sub();
    Drawable.prototype._init = function(){
	this.color = "black";
	this.position = new Point(0,0);
	this.scale = 1;
	this.rotation = 0;
    }
    Drawable.prototype.draw = function(context){
	//recursive drawing
	context.save();
	if(typeof this.alpha != "undefined"){
	    context.globalAlpha = this.alpha;
	}
	if(this.position){
	    context.translate(this.position.x,this.position.y);
	}
	if(this.rotation){
	    context.rotate(this.rotation);
	}
	if(this.center){
	    context.translate(-this.center.x,-this.center.y); 
	}
	if(this.invert){
	    if(this.invertPadding){
		context.translate(this.invertPadding,0);
	    }
	    context.scale(-1,1);
	}
	if(typeof this.onDraw == "function"){
	    this.onDraw(context);
	}
	if(this.parts){
	    for(var i=0;i<this.parts.length;i++){
		Drawable.prototype.draw.call(this.parts[i],context);
	    }
	}
	if(typeof this.onClear == "function"){
	    this.onClear(context);
	}
	context.restore();
	return;
    }
    //Sprite
    //1.A drawable which can animating
    //2.Sprite hold a instance for drawing
    var Sprite = Drawable.sub();
    Sprite.prototype._init = function(){
	var self = this;
	this.count = 1;
	this._drawControler = new Instance();
	this._index =-1;
	this._drawControler.next = function(){
	    console.log("!!");
	    this._index+=1;
	    if(this._index==this.count){
		this._index =0;
		if(this.onFinish){
		    this.onFinish();
		}
	    }
	}
    }
    Sprite.prototype.start = function(){
	this._drawControler.start();
    }
    Sprite.prototype.pause = function(){
	this._drawControler.pause();
    } 
    Sprite.prototype.stop = function(){
	this._drawControler.stop();
    }
	
    exports.Sprite = Sprite;
    exports.Drawable = Drawable;
})(exports)