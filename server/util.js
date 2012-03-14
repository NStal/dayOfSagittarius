(function(exports){
    var Class = function(){};
    Class.sub = function(){
	var parent = this;
	var c =  function(){
	    parent.call(this);
	    //if(parent.prototype._init){
	    //parent.prototype._init.call(this);
	    //}
	    if(c.prototype._init){
		c.prototype._init.apply(this,arguments);
	    }
	}
	c.parent = this;
	c.prototype = new c.parent();
	c.sub = Class.sub;
	return c;
    }

    var EventEmitter = Class.sub();
    EventEmitter.prototype._init = function(){
	this.event = {};
    }
    EventEmitter.prototype.fire = function(event){
	var self = this;
	if(typeof self.event[event] == "function"){
	    self.event[event]();
	}
    }
    EventEmitter.prototype.on = function(event,callback){
	this.event[event] = callback;
	return false;
    }
    EventEmitter.prototype.off = function(event){
	this.event[event] = null;
	return true;
    }
    var Instance = EventEmitter.sub();
    Instance.prototype._init = function(){
	this.finished = true;
	this.rate = 1;
	this._timeId = null;
    }
    Instance.prototype.start = function(type){
	if(!type){
	    type = "interval";
	}
	if(this._timeId){
	    console.log("Instance already running");
	    console.trace();
	    return false;
	} 
	this.type = type;
	var self = this;
	this.finished = false;
	if(type == "timeout"){
	    this._timeId = setTimeout(function(){
		self.loop();
	    },0)
	};
	if(type == "interval"){
	    this._timeId = setInterval(function(){
		self.loop();
	    },1000/this.rate);
	}
    }
    Instance.prototype.setRate = function(rate){
	if(typeof rate!= "undefined")
	    this.rate = rate;
    }
    Instance.prototype.loop = function(sprite){
	var self = this;
	var result = false;
	if(this.next){
	    result = this.next();
	}
	if(typeof result!="undefined" && !result){
	    this.stop();
	    return;
	}
	//next time
	if(this.type=="timeout"){
	    this._timeId = setTimeout(function(){
		self.loop();
	    },1000/this.rate);
	}
    }
    Instance.prototype.stop = function(){
	this.finished = true;
	if(this._timeId!=null) {
	    if(this.type == "timeout"){
		clearTimeout(this._timeId);
		
	    }
	    if(this.type == "interval")
		clearInterval(this._timeId);
	    this._timeId = null;
	}
	return;
    }
    Instance.prototype.next = null;
    Key = {}
    Key.a=65;
    Key.b=66;
    Key.c=67;
    Key.d=68;
    Key.e=69;
    Key.f=70;
    Key.g=71;
    Key.h=72;
    Key.i=73;
    Key.j=74;
    Key.k=75;
    Key.l=76;
    Key.m=77;
    Key.n=78;
    Key.o=79;
    Key.p=80;
    Key.q=81;
    Key.r=82;
    Key.s=83;
    Key.t=84;
    Key.u=85;
    Key.v=86;
    Key.w=87;
    Key.x=88;
    Key.y=89;
    Key.z=90;
    Key.space = 32;
    Key.shift = 16;
    Key.ctrl = 17;

    var MathFunc = {};
    MathFunc.curve = function(a,b,c,x){
	return a*x*x+b*x+c;
    }

    Math.minFloat = 0.002;
    Math.pointEqual = function(a,b){
	if(Math.abs(a.x-b.x) < Math.minFloat && Math.abs(a.y-b.y) < Math.minFloat)
	    return true
	return false;
    }
    Math.floatZero = function(f){
	if(Math.abs(f)<Math.minFloat){
	    return true;
	}
	return false;
    }
    Math.floatEqual = function(a,b){
	if(Math.abs(a-b)<Math.minFloat)
	    return true;
	return false;
    }
    Math.mod = function(a,b){
	var result =  a%b;
	return result>=0? result :result+b;
    }
    Math.grad = function(a,b){
	return (b.y-a.y)/(b.x-a.x);
    }
    Math.pointRad = function(p){
	if(p.x==0){
	    if(p.y<0){
		return Math.PI*3/2;
	    }
	    if(p.y>0){
		return Math.PI/2;
	    }
	    if(p.y==0){
		return NaN;
	    }
	}else{
	    if(p.y==0){
		if(p.x>0){
		    return 0;
		}
		else{
		    //x==0 can't reach here'
		    return Math.PI;
		}
	    }
	}
	var c = Math.atan(Math.grad({x:0,y:0},p));
	if(p.x*p.y<0){
	    c+=Math.PI;
	}
	if(p.y < 0){
	    c+= Math.PI;
	}
	return c;
    }
    Math.toDegree = function(r){
	return 180*r/Math.PI;
    }
    Math.radSub = function(a,b){
	var result = Math.mod(b-a,Math.PI*2);
	if(result>Math.PI){
	    return result - Math.PI*2;
	}
	return result;
    }
    var Point = Class.sub();
    Point.prototype._init = function(x,y){
	if(typeof x == "undefined")return;
	if(x.x){
	    this.x = x.x;
	    this.y = x.y;
	    return;
	}
	this.x = x;
	this.y = y;
    }
    Point.prototype.clone = function(){
	return new Point(this);
    }
    Point.prototype.sub = function(p2){
	return new Point(this.x-p2.x,this.y-p2.y);
    }
    Point.prototype.grad = function(){
	return Math.grad({x:0,y:0},this);
    }
    Point.prototype.rad = function(){
	return Math.pointRad(this);
    }
    Point.prototype.degree = function(){
	return Math.toDegree(this.rad());
    }
    Point.prototype.equal = function(p){
	return Math.pointEqual(this,p)
    }
    Point.prototype.intEqual = function(p){
	if(Math.abs(p.x - this.x)<1 && Math.abs(p.y-this.y)<1)
	    return true;
	return false;
    }
    Point.prototype.distance = function(p){
	return Math.sqrt((this.x-p.x)*(this.x-p.x)
			 +(this.y-p.y)*(this.y-p.y));
    }
    Point.prototype.toString = function(){
	return "("+this.x+","+this.y+")";
    }
    var Util = Class.sub();
    Util.update = function(a,b){
	if(!a || !b) return;
	for(var item in b){
	    a[item] = b[item];
	}
    }
    Util.tryUntil = function(handler,interval){
	var _interval;
	if(interval){
	    _interval = interval;
	}else{
	    _interval = 100;
	}
	var _id = setInterval(function(){
	    var result = handler();
	    if(result == true)
		clearInterval(_id);
	},_interval);
    }
    exports.Class=Class;
    exports.Math=Math;
    exports.Point = Point;
    exports.Util = Util;
    exports.Instance = Instance;
    exports.EventEmitter = EventEmitter;
    exports.Key = Key;
})(exports)