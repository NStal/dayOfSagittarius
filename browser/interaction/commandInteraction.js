(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var ShipMark = require("./shipSelectInteraction").ShipMark;
    var MoveToInteraction = Interaction.sub();
    MoveToInteraction.prototype._init = function(ship){
	
	if(!ship){
	    return;
	}
	
	var ShipController = require("../shipController").ShipController;
	var self = this;
	this.shipMark = new ShipMark();
	this.shipMark.set(ship);
	this.ship = ship;
	this.shipController = new ShipController(ship);
	this.handlers = [
	    {
		where:"battleField"
		,type:"mouseUp"
		,handler:function(position){
		    position = self.manager.battleField.screenToBattleField(position);
		    game.syncWorker.send(self.shipController.moveTo(position));
		    self.manager.popCriticalInteraction(self);
		}
	    }
	];
    }
    MoveToInteraction.prototype.init = function(manager){
	MoveToInteraction.parent.prototype.init.call(this,manager);
	manager.add(this.shipMark);
    }
    MoveToInteraction.prototype.clear = function(){
	MoveToInteraction.parent.prototype.clear.call(this);
	this.manager.remove(this.shipMark);
    }
    var RoundMarker = Drawable.sub();
    RoundMarker.prototype._init = function(obj){
	this.obj = obj; 
	this.color = "#60dfff";
    }
    RoundMarker.prototype.onDraw = function(context){
	if(!this.obj)return;
	if(!this.obj.point||!this.obj.r)return;
	var p = this.obj.point;
	context.beginPath();
	context.arc(p.x,p.y,this.obj.r
		    ,0,Math.PI*2);
	context.strokeStyle = this.color;
	context.stroke();
	context.beginPath();
	context.arc(p.x,p.y,2
		    ,0,Math.PI*2);
	context.fillStyle = this.color;
	context.fill();
    }
    var RoundAtInteraction = Interaction.sub();
    RoundAtInteraction.prototype._init = function(ship){
	
	if(!ship){
	    return;
	}	
	var ShipController = require("../shipController").ShipController;
	var self = this;
	this.shipMark = new ShipMark();
	this.shipMark.set(ship);
	this.roundMark = new RoundMarker(this);
	this.ship = ship;
	this.shipController = new ShipController(ship);
	this.handlers = [
	    {
		where:"battleField"
		,type:"mouseDown"
		,handler:function(position){
		    self.point = self.manager.battleField.screenToBattleField(position);
		    //self.manager.popCriticalInteraction(self);
		    console.log(self.point);
		}
	    }
	    ,{
		where:"battleField"
		,type:"mouseMove"
		,handler:function(position){
		    console.log(self.point)
		    if(!self.point)return;
		    self.r = self.manager.battleField.screenToBattleField(position).distance(self.point); 		}
	    }
	    ,{
		where:"battleField"
		,type:"mouseUp"
		,handler:function(position){
		    if(!self.point)return false;
		    if(!self.r)return false;
		    if(self.r < 10)self.r=10;
		    game.syncWorker.send(self.shipController.roundAt(self.point,self.r,true));
		    self.manager.popCriticalInteraction(self);
		}
	    }
	];
    }
    RoundAtInteraction.prototype.init = function(manager){
	RoundAtInteraction.parent.prototype.init.call(this,manager);
	manager.add(this.shipMark);
	manager.add(this.roundMark);
    }
    RoundAtInteraction.prototype.clear = function(){
	RoundAtInteraction.parent.prototype.clear.call(this);
	this.manager.remove(this.shipMark);
	this.manager.remove(this.roundMark);
    }

    var LockAtInteraction = Interaction.sub();
    LockAtInteraction.prototype._init = function(ship){
	if(!ship){
	    return;
	} 
	var ShipController = require("../shipController").ShipController;
	var self = this;
	this.shipMark = new ShipMark();
	this.shipMark.set(ship);
	this.ship = ship;
	this.shipController = new ShipController(ship);
	this.handlers = [
	    {
		where:"battleField"
		,type:"mouseUp"
		,handler:function(position){
		    position = self.manager.battleField.screenToBattleField(position);
		    var target = self.manager.battleField.findShipByPosition(position);
		    if(!target)return;
		    game.syncWorker.send(self.shipController.lockAt(target));
		    self.manager.popCriticalInteraction(self);
		}
	    }
	    ,{
		where:"battleField"
		,type:"mouseMove"
		,handler:function(position){
		    //change cursor type to attack style
		    position = self.manager.battleField.screenToBattleField(position);
		    var target = self.manager.battleField.findShipByPosition(position);
		    var pointer = game.interactionManager.mouse.pointer;
			
		    if(target){
			pointer.type = pointer.types.attack;
		    }
		    else{
			pointer.type = pointer.types.normal; 
		    }
		}
	    }
	    
	];
    }
    LockAtInteraction.prototype.init = function(manager){
	LockAtInteraction.parent.prototype.init.call(this,manager);
	manager.add(this.shipMark);
    }
    LockAtInteraction.prototype.clear = function(){
	LockAtInteraction.parent.prototype.clear.call(this);
	this.manager.remove(this.shipMark);
    }
    var PassStarGateInteraction = Interaction.sub();
    PassStarGateInteraction.prototype._init = function(ship){
	if(!ship){
	    return;
	}
	var ShipController = require("../shipController").ShipController;
	var self = this;
	this.shipMark = new ShipMark();
	this.shipMark.set(ship);
	this.ship = ship;
	this.shipController = new ShipController(ship);
	this.handlers = [
	    {
		where:"battleField"
		,type:"mouseUp"
		,handler:function(position){
		    position = self.manager.battleField.screenToBattleField(position);
		    var gate = self.manager.battleField.findStarGateByPosition(position);
		    if(!gate){
			return;
		    }
		    game.syncWorker.send(self.shipController.passStarGate(gate));
		    self.manager.popCriticalInteraction(self);
		}
	    }
	    ,{
		where:"battleField"
		,type:"mouseMove"
		,handler:function(position){
		    position = self.manager.battleField.screenToBattleField(position);
		    var gate = self.manager.battleField.findStarGateByPosition(position);
		    var pointer = game.interactionManager.mouse.pointer; 
		    if(!gate){
			pointer.type = pointer.types.normal;
			return; 
		    }else{
			pointer.type = pointer.types.onStarGate;
		    }
		    
		}
	    }
	];
    }
    PassStarGateInteraction.prototype.init = function(manager){
	PassStarGateInteraction.parent.prototype.init.call(this,manager);
	manager.add(this.shipMark);
    }
    PassStarGateInteraction.prototype.clear = function(){
	PassStarGateInteraction.parent.prototype.clear.call(this);
	this.manager.remove(this.shipMark);
    }
    exports.LockAtInteraction = LockAtInteraction;
    exports.RoundAtInteraction = RoundAtInteraction;
    exports.MoveToInteraction = MoveToInteraction;
    exports.PassStarGateInteraction = PassStarGateInteraction;
})(exports)

