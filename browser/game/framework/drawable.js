(function(exports){
    var Container = require("../share/util").Container;
    var Point = require("../share/util").Point;
    var Instance = require("../share/gameUtil").GameInstance;
    //Drawable:
    //1.Has a method onDraw
    //2.Contain some drawing info
    var Drawable = Container.sub();
    Drawable.prototype._init = function(){
	this.rotation = 0;
	this.position = new Point(0,0);
	this.scale = 1;
	this.parts = [];
    }
    Drawable.mixin = function(_Class){
	var drawable = new Drawable();
	for(var item in drawable){
	    if(!_Class.prototype[item]){
		_Class.prototype[item] = drawable[item];
	    }
	}
	var oldInit = _Class.prototype._init;
	_Class.prototype._init = function(){
	    Drawable.prototype._init.call(this);
	    oldInit.apply(this,arguments);
	}
    }
    Drawable.prototype.draw = function(context){
	//recursive drawing
	context.save();
	if(typeof this.alpha != "undefined" && this.alpha!=1){
	    context.globalAlpha = this.alpha;
	}else{
	    this.alpha = 1;
	}
	if(this.position){
	    context.translate(this.position.x,this.position.y);
	}
	else{
	    this.position = new Point(0,0);
	}
	if(this.rotation){
	    context.rotate(this.rotation);
	}else{
	    this.rotation = 0;
	}
	if(this.center){
	    context.translate(-this.center.x,-this.center.y); 
	}
	if(typeof this.scale =="number"){
	    context.scale(this.scale,this.scale);
	}else{
	    this.scale = 1;
	}
	if(this.invert){
	    if(this.invertPadding){
		context.translate(this.invertPadding,0);
	    }
	    context.scale(-1,1);
	}
	for(var i=0;this.effects&&i<this.effects.length;i++){
	    if(this.effects[i].onBeforeRender)
		this.effects[i].onBeforeRender(context);
	}
	if(this.effectQueue && this.effectQueue[0] && this.effectQueue[0].onBeforeRender){
	    if(this.effectQueue[0].onBeforeRender(context)){
		this.effectQueue.shift();
	    }
	}
	if(typeof this.onDraw == "function"){
	    this.onDraw(context);
	}
	if(this.parts && this.parts.length>0){
	    for(var i=0;i<this.parts.length;i++){
		Drawable.prototype.draw.call(this.parts[i],context);
	    }
	}
	for(var i=0;this.effects&&i<this.effects.length;i++){
	    if(this.effects[i].onAfterRender)
		this.effects[i].onAfterRender(context);
	}
	context.restore();
	return;
    }
    Drawable.prototype.addEffect = function(item){
	item.init(this);
	if(!this.effects){
	    this.effects = [];
	}
	this.effects.push(item);
    }
    Drawable.prototype.removeEffect = function(item){
	if(!this.effects){
	    return;
	}
	for(var i=0;i<this.effects.length;i++){
	    if(this.effects[i]==item){
		this.effects.splice(i,1);
		return;
	    }
	}
	//may be syncEffect at effectQueue
    }
    Drawable.prototype.addSyncEffect = function(item){
	if(!this.effectQueue)this.effectQueue = [];
	item.init(this);
	this.effectQueue.push(item);
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