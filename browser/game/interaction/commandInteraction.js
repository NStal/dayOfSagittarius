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
	this.ship = ship;
	this.shipController = new ShipController(ship); 
    }
    MoveToInteraction.prototype.init = function(){
	var self = this;
	Static.globalCaptureLayer.capture("mouseDown",function(e){
	    var p = Static.battleFieldDisplayer.screenToBattleField(e);
	    Static.gateway.send(self.shipController.moveTo(p));
	    Static.globalCaptureLayer.release("mouseDown");
	    return true;
	})
    }
    var RoundAtInteraction = Drawable.sub();
    RoundAtInteraction.prototype._init = function(ship){
	if(!ship){
	    return;
	}	
	var ShipController = require("../shipController").ShipController;
	var self = this;
	this.ship = ship;
	this.shipController = new ShipController(ship);
	this.color = "grey"
    }
    RoundAtInteraction.prototype.init = function(manager){
	var self = this;
	Static.interactionDisplayer.add(this);
	Static.globalCaptureLayer.capture("mouseUp",function(e){
	    Static.globalCaptureLayer.release("mouseDown");
	    Static.globalCaptureLayer.release("mouseMove"); 
	    Static.globalCaptureLayer.release("mouseUp");
	    Static.interactionDisplayer.remove(self);
	    var p = Static.battleFieldDisplayer.screenToBattleField(e); 
	    var cmd = self.shipController.roundAt(self.centerPoint,p.distance(self.position),true);
	    Static.gateway.send(cmd);
	    return true
	});
	Static.globalCaptureLayer.capture("mouseDown",function(e){
	    if(!self.centerPoint){
		self.centerPoint = Static.battleFieldDisplayer.screenToBattleField(e);
		return true;
	    }
	    return true;
	})
	Static.globalCaptureLayer.capture("mouseMove",function(e){
	    self.mousePoint = Static.battleFieldDisplayer.screenToBattleField(e);
	})
    }
    RoundAtInteraction.prototype.onDraw = function(context){
	if(!this.centerPoint)return;
	this.position = this.centerPoint;
	context.beginPath();
	context.arc(0,0,3,0,Math.PI*2);
	context.closePath();
	context.strokeStyle = this.color;
	context.stroke();
	context.beginPath();
	context.arc(0,0,this.mousePoint.distance(this.position),0,Math.PI*2);
	context.stroke();
    }
    var LockAtInteraction = Drawable.sub();
    LockAtInteraction.prototype._init = function(ship){	
	if(!ship){
	    return;
	} 
	var ShipController = require("../shipController").ShipController;
	var self = this;
	this.ship = ship;
	this.shipController = new ShipController(ship); 
    }
    LockAtInteraction.prototype.init = function(){
	var self = this;
	Static.globalCaptureLayer.capture("mouseDown",function(e){
	    var p = Static.battleFieldDisplayer.screenToBattleField(e);
	    var ship =Static.battleFieldDisplayer.findShipByPosition(p);
	    if(!ship){
		Toast("please select a ship");
		return true;
	    }
	    if(ship == self.ship){
		Toast("Lock yourself? No.");
		return true;
	    }
	    Static.gateway.send(self.shipController.lockAt(ship));
	    Static.globalCaptureLayer.release("mouseDown");
	    return true;
	});
    }
    var DockAtInteraction = Drawable.sub();
    DockAtInteraction.prototype._init = function(ship){	
	if(!ship){
	    return;
	} 
	var ShipController = require("../shipController").ShipController;
	var self = this;
	this.ship = ship;
	this.shipController = new ShipController(ship); 
    }
    DockAtInteraction.prototype.init = function(){
	var self = this;
	Static.globalCaptureLayer.capture("mouseDown",function(e){
	    var p = Static.battleFieldDisplayer.screenToBattleField(e);
	    var station =Static.battleFieldDisplayer.findStarStationByPosition(p);
	    if(!station){
		Toast("please select a Station");
		return true;
	    }
	    Static.gateway.send(self.shipController.setDockStation(station));
	    Static.globalCaptureLayer.release("mouseDown");
	    return true;
	});
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
		where:"battleFieldDisplayer"
		,type:"mouseUp"
		,handler:function(position){
		    position = self.manager.battleFieldDisplayer.screenToBattleField(position);
		    var gate = self.manager.battleFieldDisplayer.findStarGateByPosition(position);
		    if(!gate){
			return;
		    }
		    Static.gateway.send(self.shipController.passStarGate(gate));
		    self.manager.popCriticalInteraction(self);
		}
	    }
	    ,{
		where:"battleFieldDisplayer"
		,type:"mouseMove"
		,handler:function(position){
		    position = self.manager.battleFieldDisplayer.screenToBattleField(position);
		    var gate = self.manager.battleFieldDisplayer.findStarGateByPosition(position);
		    var pointer = Static.interactionManager.mouse.pointer;
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
    var ModuleLockAtInteraction = Drawable.sub();
    ModuleLockAtInteraction.prototype._init = function(module){	
	if(!module){
	    return;
	} 
	var ShipController = require("../shipController").ShipController;
	var self = this;
	this.ship = module.ship;
	this.module = module;
	this.shipController = new ShipController(module.ship);
    }
    ModuleLockAtInteraction.prototype.init = function(){
	var self = this;
	Static.globalCaptureLayer.capture("mouseDown",function(e){
	    var p = Static.battleFieldDisplayer.screenToBattleField(e);
	    var ship =Static.battleFieldDisplayer.findShipByPosition(p);
	    if(!ship){
		Toast("please select a ship");
		return true;
	    }
	    if(ship == self.ship){
		Toast("ModuleLock yourself? No.");
		return true;
	    }
	    Static.gateway.send(self.shipController.setModuleTarget(self.module,ship));
	    Static.globalCaptureLayer.release("mouseDown");
	    return true;
	});
    }
    
    exports.ModuleLockAtInteraction = ModuleLockAtInteraction;
    exports.DockAtInteraction = DockAtInteraction;
    exports.LockAtInteraction = LockAtInteraction;
    exports.RoundAtInteraction = RoundAtInteraction;
    exports.MoveToInteraction = MoveToInteraction;
    exports.PassStarGateInteraction = PassStarGateInteraction;
})(exports)

