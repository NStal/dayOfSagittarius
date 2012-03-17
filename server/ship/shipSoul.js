(function(exports){
    var Class = require("../util").Class
    var Point = require("../util").Point
    var Util = require("../util").Util
    var ShipSoul = Class.sub();
    var AI = require("./ai").AI;
    //ShipSoul Holds a shipInformation
    //it contain everything you want in a ship 
    //except:the intention of the ship 
    //is stored in it's AI;
    ShipSoul.prototype._init = function(info){
	if(!info){
	    return;
	}
	this.id = info.id;
	this.name = info.name
	this.ability = info.ability;
	this.state = info.state?info.state:{};
	this.action = info.action?info.action:{rotateFix:0};
	this.cordinates = new Point(info.cordinates);
	this.physicsState = info.physicsState;
	this.AI = new AI(this);
	this.AI.destination = info.AI&&info.AI.destination?info.AI.destination:{};
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
	    ,cordinates:{x:this.cordinates.x
		       ,y:this.cordinates.y}
	    ,ability:this.ability
	    ,state:this.state
	    ,physicsState:this.physicsState
	    ,action:this.action
	    ,AI:this.AI.toData()
	}
	console.log(data);
	return data;
    }
    exports.ShipSoul = ShipSoul;
})(exports)