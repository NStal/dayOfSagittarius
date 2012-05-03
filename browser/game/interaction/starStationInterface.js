(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var MouseEventConsumer = require("./drawing/mouseEventDistributer").MouseEventConsumer;
    var StarStationInterface = Drawable.sub(); 
    var StarStationInterfaceItem = Drawable.sub();
    StarStationInterface.prototype._init = function(){
	this.count=8;
	this.color = "#60dfff";
    }
    StarStationInterface.prototype.show = function(station){
	if(!station){
	    this.release();
	    return;
	}
	this.station = station;
	this.position = station.position;
	this.done =false;
	this.minAlpha = 0.3;
	this.maxAlpha = 1;
	this.alpha = 1;
	this.alphaStep = 0.03;
	this.parts.length = 0;
	this.index = 0;
	this.length = 6;
	var self = this;
	this.commands = [{
	    name:"info"
	    ,callback:function(){
		Static.UIDisplayer.starStationInfoDisplayer.show(self.station);
		//new MoveToInteraction(self.station).init();
	    }
	},{
	    name:"round"
	    ,callback:function(){
		//new RoundAtInteraction(self.station).init();
	    }
	},{
	    name:"lock"
	    ,callback:function(){
		//new LockAtInteraction(self.station).init();
	    }
	},{
	    name:"dock"
	    ,callback:function(){
		//new DockAtInteraction(self.station).init();
	    }
	},{
	    name:"warp"
	    ,callback:function(){
		//console.log("warp");
	    }
	},{
	    name:"jump"
	    ,callback:function(){
		//console.log("jump");
	    }
	}];
	var self = this;
	for(var i=0,length=this.commands.length;i < length;i++){
	    var item = this.commands[i];
	    item = new StarStationInterfaceItem(item.name,function(item){return function(){
		item.callback();
		self.release();
	    }}(item))
	    item.index = i;
	    this.add(item);
	}
    }
    StarStationInterface.prototype.release = function(){
	this.station = null;
	this.done = false;
	this.parts.length = 0;
	this.index = 0;
	this.rotation = -Math.PI/3;
    }
    StarStationInterface.prototype.onDraw = function(context){
	if(!this.station){
	    return;
	}
	this.position = Static.battleFieldDisplayer.battleFieldToScreen(this.station.position);
	if(!this.done){
	    this.index++;
	    if(this.index==this.length)this.done = true;
	}
	this.rotation=Math.PI/3*(1-this.index/this.length);
    }
    StarStationInterfaceItem.prototype._init = function(name,callback){
	this.name = name;
	this.callback = callback;
	this.borderLength = 33;
	this.mouseReactSize = 32;
	this.position = new Point(100,100);
	this.lineWidth = 0.2;
	this.consumeType.mouseEnter = true;
	this.consumeType.mouseLeave = true;
	this.consumeType.mouseUp = true;
	this.consumeType.mouseDown = true;
	this.extendToBe = this.borderLength*1.8;
	this.extend = this.extendToBe/2;
	this.extendSpeed = 5;
	var self = this;
	this.on("mouseEnter",function(e){
	    self.lineWidthToBe = 0.8;
	    return true;
	})
	this.on("mouseLeave",function(e){
	    self.lineWidthToBe = 0.3;
	})
	this.on("mouseDown",function(e){
	    self.down = true;
	    return true;
	})
	this.on("mouseUp",function(e){
	    if(self.down)
		self.callback();
	    self.down = false;
	    return true;
	})
    }
    StarStationInterfaceItem.prototype.onDraw = function(context){
	context.beginPath();
	context.save();
	//context.rotate(-0.03);
	context.moveTo(this.borderLength,0);
	for(var i=0;i<6;i++){
	    context.rotate(Math.PI/3);
	    context.lineTo(this.borderLength,1);
	}
	if(this.extend>this.extendToBe){
	    if(this.fix>0){
		this.extend=this.extendToBe
		this.fix = 0;
	    }else{
		this.fix=-1;
	    }
	}
	if(this.extend<this.extendToBe){
	    if(this.fix<0){
		this.extend=this.extendToBe
		this.fix = 0;
	    }else{
		this.fix=+1;
	    } 
	}
	this.extend+=this.fix*this.extendSpeed;
	this.position.x =Math.sin(Math.PI+Math.PI*2/6*this.index)*this.extend;
	this.position.y =Math.cos(Math.PI+Math.PI*2/6*this.index)*this.extend;
	context.closePath();
	context.strokeStyle = "black";
	context.lineWidth=this.lineWidth; 
	context.fillStyle = "white";
	context.fill();
	
	if(this.lineWidth>this.lineWidthToBe)this.lineWidth-=0.1;
	if(this.lineWidth<this.lineWidthToBe)this.lineWidth+=0.1;
	context.stroke();
	context.restore();
	context.textAlign="center";
	context.translate(0,6);
	context.beginPath();
	context.fillText(this.name,0,0);
    }
    MouseEventConsumer.mixin(StarStationInterfaceItem);
    exports.StarStationInterface = StarStationInterface;
})(exports)
