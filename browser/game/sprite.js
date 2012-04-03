var RawSprite = Class.sub();
RawSprite.prototype._init = function(name){
    this.scale = {x:0,y:0};
    this.rate = 0;
    this.repeat = 0;
    this.count = 1;
    if(!name){
	return false;
    } 
    this.name = name
}
RawSprite.prototype.folk = function(){
    return new SpriteInstance(this);
}

RawSprite.prototype.draw = null;

var Sprite = RawSprite.sub();
Sprite.prototype._init = function(ro){
    if(!ro){
	return;
    }
    RawSprite.call(this,ro.get("name",null));
    this.src = ro.get("src",null); 
    this.size = {};
    this.size.x = ro.get("width",null);
    this.size.y = ro.get("height",null); 
    this.count = ro.get("count",null);
    if(this.name === null  || this.src === null 
       || this.size.x === null || this.size.y === null
       ||this.count === null){
	console.trace();
	throw new Error("Resource Sprite invalid require:name,src,width,height,count");
    }
    this.image = new Image();
    this.image.src = this.src;
    this.scale.x = ro.get("scaleX",1);
    this.scale.y = ro.get("scaleY",1);
    this.row = ro.get("row",0);
    this.rate = ro.get("rate",15);
    this.offsetIndex = ro.get("offsetIndex",0);
    this.repeat = ro.get("repeat",false);
    this.offset = {};
    this.offset.x = ro.get("offsetX",0);
    this.offset.y = ro.get("offsetY",0);
}
Sprite.prototype.draw = function(context,theIndex){
    if(!theIndex){
	var index = 0;
    }else{
	var index = theIndex;
    }
    if(index>=this.count){
	console.log("sprite draw out of index");
	console.trace();
	return;
    }
    var offset = {};
    var realIndex = index + this.offsetIndex;
    if(this.row==0){
	//row of 0 indicate Infinet row length;
	//index will only belimited by index;
	var row = realIndex;
	var line = 0;
    }else{
	var row = realIndex % this.row;
	var line = (realIndex -row) / this.row;
    }
    offset.x = this.offset.x + row * this.size.x;
    offset.y = this.offset.y + line * this.size.y;
    var image = this.image;
    var size = this.size;
    context.drawImage(image
		      ,offset.x
		      ,offset.y
		      ,size.x
		      ,size.y
		      ,0,0 // position should always be 0,0
		      ,this.size.x*this.scale.x
		      ,this.size.y*this.scale.y);
}
//Instance is object that store the drawing information
//such current frame, is finished,is repeat,frame rate
//and fire some event like onStart , onFinished
var SpriteInstance = Instance.sub();
SpriteInstance.prototype._init = function(sprite){
    if(sprite){
	this.sprite = sprite;
	this.rate = sprite.rate;
	this.repeat = sprite.repeat;
	this.index = 0;
    }
}
SpriteInstance.prototype.changeSprite =function(sprite){
    this._init(sprite);
}
SpriteInstance.prototype.next = function(){
    this.index+=1;
    if(this.index==this.sprite.count){
	this.index = 0;
	if(this.repeat){
	    return true;
	}else{
	    this.finished = true;
	    this.fire("finish");
	    return false;
	}
    }
    return true;
}
SpriteInstance.prototype.draw = function(context){
    this.sprite.draw(context,this.index);
}

var Unit = Class.sub();
Unit.prototype._init = function(){
    this.instances = [];
    this.position = new Point(0,0);
    this.rotation = 0;
    this.alpha = 1;
    this.invert = false;
    this.parts = [];
    this.center = new Point(0,0);
}
Unit.prototype.onDraw = function(context,onlyDraw){
    if(this.calculate && !onlyDraw)
	this.calculate();
    for(var i=0;i<this.instances.length;i++){
	this.instances[i].draw(context);
    }
}
Unit.prototype.add = function(unit){
    this.parts.push(unit);
}
Unit.prototype.remove = function(unit){
    for(var i=0;i<this.parts.length;i++){
	var item = this.parts[i]
	if(item === unit){
	    this.parts.splice(i,1);
	    return unit;
	}
    }
    return null;
}
Unit.prototype.removeAll = function(){
    this.parts = [];
}
Unit.prototype.addInstance = function(instance){
    for(var i=0;i < this.instances.length;i++){
	if(this.instances[i] === instance){
	    return false;
	}
    }
    instance.start();
    this.instances.push(instance);
    return true;
}
Unit.prototype.removeInstance = function(instance){
    for(var i=0;i < this.instances.length;i++){
	if(this.instances[i] === instance){
	    this.instances.splice(i,1);
	    instance.stop();
	    return true;
	}
    }
    return false;
}
Unit.prototype.removeAllInstance = function(){
    
    for(var i=0;i < this.instances.length;i++){
	this.instances[i].stop();
    }
    this.instances = [];
    return true;
}
