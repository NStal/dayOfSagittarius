(function(exports){
    var Util = {};
    var Class = function(){};
    Class.sub = function(){
	var parent = this;
	var c =  function(){
	    parent.call(this);
	    if(c.prototype._init){
		c.prototype._init.apply(this,arguments);
	    }
	}
	c.parent = this;
	c.prototype = new c.parent();
	c.sub = Class.sub;
	c.changeRoot = Class.changeRoot;
	return c;
    }
    Class.changeRoot = function(c,parent){
	var _c = parent.sub();
	Util.update(_c.prototype,c.prototype);
	return _c;
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
	this.setRate(1);
	this._timeId = null;
	this.garenteed = true;
	this.wait = 0;
	//lag 3000 ms make it impossible to run 
	//at current rate 
	//thus throught Exception to
	//stop the program
	this.failDelay = 10*1000;
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
	this.jump =0 ;
	this.type = type;
	var self = this;
	this.finished = false;
	if(type == "timeout"){
	    this._timeId = setTimeout(function(){
		self.loop();
	    },0)
	};
	this._shouldBe = Date.now();
	if(type == "interval"){
	    this._timeId = setInterval(function(){
		self.loop();
	    },this.coolDown);
	}
    }
    Instance.prototype.setRate = function(rate){
	if(typeof rate!= "undefined"){
	    this.rate = rate;
	    this.coolDown = 1000/rate;
	    this.coolDownDelay = this.coolDown;0.8
	}
    }
    Instance.prototype.loop = function(){
	var self = this;
	var result = false;
	if(this.wait>1){
	    this.wait-=1;
	    return;
	}
	if(this.next){
	    result = this.next();
	}
	if(typeof result!="undefined" && !result){
	    this.stop();
	    return;
	}
	if(this.garenteed){
	    this._shouldBe += this.coolDown;
	    var delay = Date.now() -  this._shouldBe;
	    if(delay > this.failDelay){
		console.trace();
		throw "Too heavy to garenteed the Instance work at rate "+this.rate;
		return;
	    }
	    if(delay> this.coolDownDelay){
		console.log("promise jump");
		this.loop()
	    }else{
		if((delay)< -this.coolDownDelay){
		    console.log("promise wait");
		    this.wait++;
		}
	    }
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
    var Container = Class.sub();
    Container.prototype._init = function(){
	this.parts = [];
    }
    Container.prototype.add = function(item){
	this.parts.push(item);
	item.parentContainer = this;
    }
    Container.prototype.remove = function(item){
	for(var i=0;i<this.parts.length;i++){
	    var _item = this.parts[i]
	    if(_item===item){
		this.parts.splice(i,1);
		return true;
	    }
	}
	return false;
    }
    Container.prototype.indexOf = function(item){
	for(var i=0;i<this.parts.length;i++){
	    var _item = this.parts[i];
	    if(item==_item)return i;
	}
	return -1;
    }
    Container.prototype.removeAll = function(){
	this.parts = [];
    }
    var HashInt =function(a){
	a = (a+0x7ed55d16) + (a<<12);
	a = (a^0xc761c23c) ^ (a>>19);
	a = (a+0x165667b1) + (a<<5);
	a = (a+0xd3a2646c) ^ (a<<9);
	a = (a+0xfd7046c5) + (a<<3);
	a = (a^0xb55a4f09) ^ (a>>16);
	if( a < 0 ) a = 0xffffffff + a;
	return a;
    }
    var HashRandom = function(a){
	return (HashInt(a)%1000000)/1000000;
    }
    var HashRandomInt = function(seed,lessThan){
	if(!lessThan)lessThan=1000000;
	return parseInt(HashRandom(seed)*lessThan);
    }
    var _runOnceArray = [];
    var runOnce =function(handler,code){
	for(var i=0;i<_runOnceArray.length;i++){
	    if(code==_runOnceArray[i]){
		return;
	    }
	}
	_runOnceArray.push(code);
	handler();
    }
    exports.runOnce = runOnce;
    exports.HashInt = HashInt;
    exports.HashRandom = HashRandom;
    exports.HashRandomInt = HashRandomInt;
    exports.Class=Class;
    exports.Math=Math;
    exports.Point = Point;
    exports.Util = Util;
    exports.Instance = Instance;
    exports.EventEmitter = EventEmitter;
    exports.Key = Key;
    exports.Container = Container;
    
})(exports)