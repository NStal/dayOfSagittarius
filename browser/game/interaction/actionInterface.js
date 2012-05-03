(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var MouseEventConsumer = require("./drawing/mouseEventDistributer").MouseEventConsumer;
    var ActionInterface = Drawable.sub(); 
    var ActionInterfaceItem = Drawable.sub();
    ActionInterface.prototype._init = function(){
	this.count=8;
	this.color = "#60dfff";
    }
    ActionInterface.prototype.show = function(point){
	this.ship = Static.battleFieldDisplayer.selectedShip;
	//if(!this.isShown)Static.UIDisplayer.add(this);
	//this.isShown = true;
	if(!this.ship){
	    console.warn("no ship select but into action");
	    console.trace();
	    console.return;
	} 
	(new Audio(Static.resourceLoader.get("sound_click2").src)).play();
	if(this.point)this.point.release();
	this.point = point;
	this.target = Static.battleFieldDisplayer.findShipByPosition(this.point);
	if(this.target)
	    this.point = this.target.cordinates;
	this.station = Static.battleFieldDisplayer.findStarStationByPosition(this.point);
	if(this.station)
	    this.point = this.station.position;
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
	    name:"move"
	    ,callback:function(){
		var action = new MoveToInteraction(self.ship);
		action.init();
		//simulate a move to interaction
		Static.globalCaptureLayer.emit("mouseDown",self.position)
		self.hide();
	    }
	},{
	    name:"round"
	    ,callback:function(){
		var action = new RoundAtInteraction(self.ship);
		action.init();
		if(self.target){
		    Static.globalCaptureLayer.emit(
			"mouseDown"
			,Static.battleFieldDisplayer.battleFieldToScreen(
			    self.target.cordinates));
		}
		else{
		    if(!self.position){
			self.position = Static.battleFieldDisplayer.battleFieldToScreen(self.point);
		    } 
		    console.log(self.position.toString());
		    Static.globalCaptureLayer.emit("mouseDown",self.position);
		}
		
		Static.globalCaptureLayer.emit("mouseMove",self.position);
		self.hide();
	    }
	},{
	    name:"lock"
	    ,callback:function(){
		new LockAtInteraction(self.ship).init();
	    }
	},{
	    name:"dock"
	    ,callback:function(){
		if(self.station){
		    new DockAtInteraction(self.ship).init();
		    Static.globalCaptureLayer.emit(
			"mouseDown"
			,Static.battleFieldDisplayer.battleFieldToScreen(self.station.position));
		}
		self.hide();
		//new DockAtInteraction(self.ship).init();
	    }
	},{
	    name:"warp"
	    ,callback:function(){
		console.log("warp");
	    }
	},{
	    name:"jump"
	    ,callback:function(){
		console.log("jump");
	    }
	}];
	var self = this;
	for(var i=0,length=this.commands.length;i < length;i++){
	    var item = this.commands[i];
	    item = new ActionInterfaceItem(item.name,function(item){return function(){
		item.callback();
	    }}(item))
	    item.index = i;
	    this.add(item);
	}
    }
    ActionInterface.prototype.hide = function(){
	this.release(); 
	//this.isShown = false; 
	//console.log("r",Static.UIDisplayer.remove(this));
    }
    ActionInterface.prototype.release = function(){
	this.ship = null;
	this.done = false;
	this.parts.length = 0;
	this.index = 0;
	this.rotation = -Math.PI/3;
    }
    ActionInterface.prototype.onDraw = function(context){
	if(!this.ship){
	    return;
	}
	if(this.position)this.position.release();
	this.position = Static.battleFieldDisplayer.battleFieldToScreen(this.point);

	this.index++;
	if(!this.done){
	    if(this.index==this.length)this.done = true;
	}
	
	if(this.index>this.length){
	    var index=this.length
	}else{
	    var index=this.index; 
	}
	context.save();
	context.fillStyle = "#60dfff"
	context.beginPath();
	context.arc(0,0,2+Math.sin(Math.PI*2*this.index/this.length/3)*1,0,Math.PI*2);
	context.fill();
	context.restore();
	this.rotation=Math.PI/3*(1-index/this.length);
    }
    ActionInterfaceItem.prototype._init = function(name,callback){
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
	this.extendToBe = this.borderLength*2.2;
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
	    if(self.down){
		self.callback();
	    }
	    self.down = false;
	    return true;
	})
    }
    ActionInterfaceItem.prototype.onDraw = function(context){
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
    MouseEventConsumer.mixin(ActionInterfaceItem);
    exports.ActionInterface = ActionInterface;
})(exports)
