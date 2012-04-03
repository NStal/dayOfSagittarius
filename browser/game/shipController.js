(function(exports){
    var Class = require("./share/util").Class;
    var settings = require("./settings").settings;
    var ShipController = Class.sub();
    //ShipController do
    //1.Manage the protocol that related to one ship, 
    //andtranslate instruction  to transportable json format
    ShipController.prototype._init = function(ship){
	this.ship = ship;
    }
    //instructions
    ShipController.prototype.moveTo = function(point){
	return {
	    time:this.ship.parentContainer.time+settings.delay
	    ,cmd:2
	    ,data:{
		id:this.ship.id
		,point:point
	    }
	}
    }
    ShipController.prototype.roundAt = function(point,radius,antiClockWise){
	antiClockWise = antiClockWise?true:false;
	return {
	    time:this.ship.parentContainer.time+settings.delay
	    ,cmd:3
	    ,data:{
		id:this.ship.id
		,point:point
		,radius:radius
		,antiClockWise:antiClockWise
	    }
	}
    }
    ShipController.prototype.lockAt = function(target){
	return {
	    time:this.ship.parentContainer.time+settings.delay
	    ,cmd:4
	    ,data:{
		id:this.ship.id
		,targetId:target.id
	    }
	}
    }
    ShipController.prototype.activeModule = function(which){
	return {
	    time:this.ship.parentContainer.time+settings.delay
	    ,cmd:5
	    ,data:{
		id:this.ship.id
		,moduleId:this.ship.moduleManager.indexOf(which)
	    }
	}
    }
    ShipController.prototype.passStarGate = function(gate){
	return {
	    time:this.ship.parentContainer.time+settings.delay
	    ,cmd:6
	    ,data:{
		id:this.ship.id
		,gateId:gate.id
	    }
	}
    }
    ShipController.prototype._genTemplate = function(cmdNumber){
	return {
	    time:this.ship.parentContainer.time+settings.delay
	    ,cmd:cmdNumber
	    ,data:{
		id:this.ship.id
	    }
	}
    }
    ShipController.prototype.chaseTarget = function(target){
	var d = this._genTemplate(8);
	d.data.targetId = target.id;
	return d;
    }
    ShipController.prototype.roundAtTarget =function(target,radius,antiClockWise){
	return {
	    time:this.ship.parentContainer.time+settings.delay
	    ,cmd:9
	    ,data:{
		id:this.ship.id
		,targetId:target.id
		,radius:radius
		,antiClockWise:antiClockWise
	    }
	}
    }
    
    exports.ShipController = ShipController;
})(exports)