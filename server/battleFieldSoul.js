(function(exports){
    var Class = require("./util").Class;
    var Point = require("./util").Point;
    var Container = require("./util").Container;
    var clientCommand = require("./protocol").clientCommand;
    var settings = require("./settings").settings;
    var Math = require("./util").Math;
    var BattleFieldSoul = Container.sub();
    //BattleFieldSoul is battleField without drawing functions
    //BattleField do these things:
    //1.hold all the ships
    //2.set ship position acording to the the ship.AI
    //3.listen instructions come from the gateway and conduct it.
    
    BattleFieldSoul.prototype._init = function(info){
	this.parts = [];
	this.size = new Point(10000,10000);
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
	this.time+=1 
	this.applyInstruction();
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    this.calculateUnit(item);
	}
    }
    BattleFieldSoul.prototype.applyInstruction = function(){
	//console.log("at",this.time,this.instructionQueue.length);
	while(true){
	    if(this.instructionQueue[0] && 
	       this.instructionQueue[0].time == this.time){
		
		var ins = this.instructionQueue.shift();
		this._excute(ins);
		continue;
	    }
	    return;
	}
    }
    BattleFieldSoul.prototype._excute = function(instruction){
	//move Instruction
	if(instruction.cmd==clientCommand.moveTo){
	    var ship = this.getShipById(instruction.data.id);
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",ship.id); 
		console.trace();
		return;
	    }
	    console.log("move to",instruction.data.point);
	    ship.AI.moveTo(new Point(instruction.data.point)); 
	}
	if(instruction.cmd==clientCommand.roundAt){
	    var ship = this.getShipById(instruction.data.id);
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",ship.id); 
		console.trace();
		return;
	    }
	    console.log("round at",instruction.data.point);
	    ship.AI.roundAt(new Point(instruction.data.point)
			    ,instruction.data.radius
			    ,instruction.data.antiClockWise);
	}
	if(instruction.cmd==clientCommand.lockTarget){
	    var ship = this.getShipById(instruction.data.id); 
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",ship.id);
		console.trace();
		return;
	    }
	    var target = this.getShipById(instruction.data.targetId)
	    if(target){
		console.log("find target of id:",target.id);
	    }else{
		console.warn("invalid target id");
		console.trace();
		return;
	    }
	    if(target!=ship){
		//can't target your self
		console.log("set target") 
		ship.AI.destination.target = target;
	    }
	    else{
		console.warn("target your self?");
		console.trace();
	    }
	    
	    return;
	} 
	if(instruction.cmd==clientCommand.activeModule){
	    var ship = this.getShipById(instruction.data.id);
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",ship.id);
		console.trace();
		return;
	    }
	    if(instruction.data.moduleId>=ship.moduleManager.parts.length){
		console.log("invalid module id");
		return;
	    }
	    var m = ship.moduleManager.parts[instruction.data.moduleId];
	    if(!m){
		console.log("get module of"+m);
		console.trace();
		return false;
	    }
	    console.log("get here")
	    if(m.active){
		m.active();
		return true;
	    }
	    console.log("module can't active");
	    return false;
	}
    }
    //calculate the ships next state
    BattleFieldSoul.prototype.calculateUnit = function(ship){
	ship.AI.calculate();
	ship.nextTick();
	//console.log("at",this.time,ship.cordinates.toString());
	var fix = ship.action.rotateFix;
	if(fix>1 || fix < -1){
	    console.trace();
	    return;
	}
	rotateSpeed = (1-ship.state.speedFactor)*ship.state.maxRotateSpeed;
	ship.physicsState.toward += fix*rotateSpeed;
	ship.physicsState.toward = Math.mod(ship.physicsState.toward,Math.PI*2); 

	var fix = ship.action.speedFix;
	var speed = (1-ship.state.speedFactor)*ship.state.maxSpeed;
	//move
	ship.cordinates.x+=Math.cos(ship.physicsState.toward) *speed*fix;
	ship.cordinates.y+=Math.sin(ship.physicsState.toward) *speed*fix;
	

	//map edge detection;
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
	console.log("add instruction at:",this.time,instruction);
	
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
