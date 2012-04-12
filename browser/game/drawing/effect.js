(function(exports){
    var Class = require("../../share/util").Class;
    //Effect
    //add to Drawable to make easy effect like shake,shrink,rotate,round;
    Effect = Class.sub();
    Effect.prototype._init = function(){
	this.repeat = true;
	this.index = 0;
    }
    Effect.prototype.init = function(target){
	this.target = target;
    }
    Effect.prototype.remove = function(){
	if(this.target){
	    this.target.removeEffect(this);
	    this.target = null;
	}
    }
    Effect.prototype.onBeforeRender = function(){
	if(!this.repeat && this.length<=this.index){
	    this.remove();
	    return true;
	}
	this.index++;
	return false;
    }
    var Shake = Effect.sub();
    Shake.prototype._init = function(info){
	Shake.parent.prototype._init.call(this);
	if(!info){
	    var info = {};
	}
	this.repeat = info.repeat?info.repeat:true;
	this.range = info.range?info.range:30;
	this.radian = info.angle?info.angle/180*Math.PI:0;
	this.length = info.length?info.length:30;
	this.time = info.frequency?info.time:10;
    }
    Shake.prototype.onBeforeRender = function(context){
	var result = Shake.parent.prototype.onBeforeRender.call(this,context);
	var A = Math.sin((this.index/this.time)*Math.PI*2)*this.range;
	var x = Math.cos(this.radian)*A;
	var y = Math.sin(this.radian)*A;
	context.translate(x,y);
	return result;
    }
    var Twinkle = Effect.sub();
    Twinkle.prototype._init = function(info){
	Twinkle.parent.prototype._init.call(this);
	if(!info){
	    var info = {};
	}
	this.repeat = info.repeat?info.repeat:true;
	this.max = info.max?info.max:1;
	this.min = info.min?info.min:0;
	this.time = info.frequency?info.time:20; 
	this.length = info.length?info.length:30;
	this.index = 0;
    }
    Twinkle.prototype.onBeforeRender = function(context){
	var result = Twinkle.parent.prototype.onBeforeRender.call(this,context);
	var alpha = (Math.sin((this.index/this.time)*Math.PI*2)+1)*(this.max-this.min)/2+this.min;
	context.globalAlpha = alpha;
	return result;
    }
    var Expand = Effect.sub();
    Expand.prototype._init = function(info){
	Expand.parent.prototype._init.call(this)
	if(!info){
	    var info = {};
	}
	this.repeat = false;
	this.vertical = info.vertical?true:false;
	
	this.length = info.length?info.length:10;
    }
    Expand.prototype.onBeforeRender = function(context){
	var result = Expand.parent.prototype.onBeforeRender.call(this,context);
	var scale = this.index/this.length;
	if(this.vertical){
	    context.scale(scale,1);
	}else{
	    context.scale(1,scale);
	}
	return result;
    }
    exports.Effect = Effect;
    exports.Shake = Shake;
    exports.Expand = Expand;
    exports.Twinkle = Twinkle;
})(exports)