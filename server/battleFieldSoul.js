(function(exports){
    var Class = require("./util").Class;
    var Point = require("./util").Point;
    var settings = require("./settings").settings;
    var BattleFieldSoul = Class.sub();
    //BattleFieldSoul is battleField without drawing functions
    //BattleField do these things:
    //1.hold all the ships
    //2.set ship position acording to the the ship.AI
    //3.listen instructions come from the gateway and conduct it.
    
    BattleFieldSoul.prototype._init = function(info){
	this.parts = [];
	this.size = new Point(500,500);
	this.listener = [];
	this.instructionQueue = [];
	if(!info)return;
	this.time = info.time;
    }
    BattleFieldSoul.prototype.genFieldState = function(){
	var ships = [];
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    ships.push(item.toData());
	}
	return {
	    ships:ships
	};
    }
    BattleFieldSoul.prototype.next = function(){
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    this.calculateUnit(item);
	}
	this.applyInstruction();
    }
    BattleFieldSoul.prototype.applyInstruction = function(){
	while(true){
	    if(this.instructionQueue[0] && 
	       this.instructionQueue[0].time == this.time){
		var ins = this.shift();
		this._excute(instruction);
		continue;
	    }
	    return;
	}
    }
    BattleFieldSoul.prototype._excute = function(instruction){
	console.log(instruction.position);
    }
    BattleFieldSoul.prototype.add = function(ship){
	this.parts.push(ship);
	return true;
    }
    BattleFieldSoul.prototype.remove = function(ship){
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i]
	    if(item===ship){
		this.parts.splice(i,1);
		return true;
	    }
	}
	return false;
    }
    //clear the battleField (which contain all the ships);
    BattleFieldSoul.prototype.clear = function(ship){
	this.parts = [];
    }
    //calculate the ships next state
    BattleFieldSoul.prototype.calculateUnit = function(ship){
	//move ship
	var fix = ship.action.speedFix;
	//speedFactor is effected by ship engine and some other field
	var speed = (1-ship.state.speedFactor)*ship.state.maxSpeed; 
	//console.log("ship.state.speedFactor",ship.state.speedFactor);

	ship.cordinates.x+=Math.cos(ship.physicsState.toward)*speed*fix;
	ship.cordinates.y+=Math.sin(ship.physicsState.toward)*speed*fix;
	//console.log("speed",speed);

	//field edge dectection
	if(ship.cordinates.x<-1)ship.cordinates.x =1; 
	if(ship.cordinates.y<-1)ship.cordinates.y =1; 
	if(ship.cordinates.x>this.size.x)
	    ship.cordinates.x=this.size.x;
	if(ship.cordinates.y>this.size.y)
	    ship.cordinates.y=this.size.y;
    }
    BattleFieldSoul.prototype._dispatch = function(instruction){
	for(var i=0;i<this.listener.length;i++){
	    var item = this.listener[i];
	    item(instruction);
	}
    }
    BattleFieldSoul.prototype.addListener = function(){
	for(var i=0;i<arguments.length;i++){
	    var item  = arguments[i];
	    this.listener.push(item);
	} 
    }
    BattleFieldSoul.prototype.removeListener = function(){
	for(var i=0;i<arguments.length;i++){
	    var item  = arguments[i];
	    for(var j=0;j<this.listener.length;j++){
		var subItem = this.listener[j];
		if(item === subItem){
		    this.listener.splice(j,0);
		    break;
		}
	    }
	} 
    }
    BattleFieldSoul.prototype.getShipById = function(id){
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.id === id){
		return item;
	    }
	}
	return null;
    }
    BattleFieldSoul.prototype.onInstruction = function(instruction){
	this.instructionQueue.push(instruction);
    }
    BattleFieldSoul.prototype.initByShips = function(ships){
	
    }
    var ControlCommand = {
	moveTo:{
	    id:0
	    ,d:{p:{
		x:0
		,y:0
	    }}
	}
    }
    
    exports.BattleFieldSoul = BattleFieldSoul;
})(exports)
