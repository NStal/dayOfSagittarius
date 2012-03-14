(function(exports){
    var Class = require("../util").Class
    var Point = require("../util").Point
    var Util = require("../util").Util
    var ShipSoul = Class.sub();
    ShipSoul.prototype._init = function(info){
	if(!info){
	    return;
	}
	this.id = info.id;
	this.name = info.name
	this.ability = {
	    maxSpeed:1
	    ,maxRotateSpeed:0.2
	    ,speedFactor:0.8
	};
	this.state = {};
	this.action = {};
	this.cordinates = new Point(info.position);
	this.action.speedFix = 1;
	this.action.rotateFix = 1;
	this.physicsState = {
	    toward:0
	} 
    }
    
    ShipSoul.prototype.init = function(){
	this.applyAbility();
	return this;
    }
    ShipSoul.prototype.applyAbility = function(){
	Util.update(this.state
		    ,this.ability); 

    }
    ShipSoul.prototype.toData = function(){
	var data ={
	    id:this.id
	    ,name:this.name
	    ,position:{x:this.cordinates.x
		       ,y:this.cordinates.y}
	    ,ability:this.ability
	    ,state:this.state
	    ,physicsState:this.physicsState 
	}
	console.log(data);
	return data;
    }
    exports.ShipSoul = ShipSoul;
})(exports)