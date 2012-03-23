(function(exports){
    var Class = require("./share/util").Class;
    var settings = require("./settings").settings;
    var ShipController = Class.sub();
    //ShipController do
    //1.Manage the protocol,translate action to
    //transportable json
    ShipController.prototype._init = function(ship){
	this.ship = ship;
    }
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
	console.log("gate ,,,",gate);
	return {
	    time:this.ship.parentContainer.time+settings.delay
	    ,cmd:6
	    ,data:{
		id:this.ship.id
		,gateId:gate.id
	    }
	}
    }
    exports.ShipController = ShipController;
})(exports)