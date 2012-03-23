(function(exports){
    var Class = require("./util").Class;
    var Point = require("./util").Point;
    var Container = require("./util").Container;
    var clientCommand = require("./protocol").clientCommand;
    var settings = require("./settings").settings;
    var Math = require("./util").Math;
    var BattleFieldSoul = Container.sub();
    var ShipSoul = require("./ship/shipSoul").ShipSoul;
    var StarGate = require("./ship/starGate").StarGateSoul;
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
	    if(item.type!="ship")continue;
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
	    //if near star gate
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
	//come from starGate
	if(instruction.cmd == clientCommand.comeFromGate){
	    this.enterShip(instruction.data.ship);
	    console.log("new ship",instruction.data.ship,"is entered!");
	}
	
	//pass star gate instruction
	if(instruction.cmd == clientCommand.passStarGate){
	    var ship = this.getShipById(instruction.data.id);
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",instruction.data.id); 
		console.trace();
		return;
	    }
	    var gate = this.getStarGateById(instruction.data.gateId);
	    if(gate){
		console.log("get gate of id:",gate.id);
	    }else{
		console.log("invalid gate id",instruction.data.gateId);
		return;
	    }
	    ship.AI.passStarGate(gate);
	    console.log("ship",ship.id,"is move to stargate");
	}
	//move Instruction
	if(instruction.cmd==clientCommand.moveTo){
	    var ship = this.getShipById(instruction.data.id);
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",instruction.data.id); 
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
		console.warn("invalid ship id",instruction.data.id); 
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
		console.warn("invalid ship id",instruction.data.id);
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
		console.warn("invalid ship id",instruction.data.id);
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
    BattleFieldSoul.prototype.calculateUnit = function(unit){
	if(unit.type == "ship"){
	    unit.next();
	}
	if(unit.type == "gate")return;
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
	    if(item.id === id && item.type == "ship"){
		return item;
	    }
	}
	return null;
    }
    BattleFieldSoul.prototype.getStarGateById = function(id){
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.id === id && item.type == "gate"){
		return item;
	    }
	}
    }
    BattleFieldSoul.prototype.passStarGate = function(ship,gate){
	var g = null;
	try{
	    g = require("./resource/map/"+gate.to)[gate.to];
	}
	catch(e){
	    console.log(e);
	    console.log("./resource/map/"+gate.to);
	    console.log("pass invalid gate!!!");
	    return;
	}
	for(var i=0;i<this.listener.length;i++){
	    var item = this.listener[i];
	    if(item.type=="onPassStarGate"){
		item.handler(ship,gate); 
	    }
	}
	this.remove(ship);
    }
    BattleFieldSoul.prototype.onInstruction = function(instruction){
	console.log("add instruction at:",this.time,instruction);
	
	this.instructionQueue.push(instruction);
    }
    BattleFieldSoul.prototype.enterShip = function(ship){
	var ship = new ShipSoul(ship).init(ship.modules);
	console.log(ship.cordinates);
	this.add(ship);
    }
    BattleFieldSoul.prototype.initByShips = function(ships,galaxy){
	this.galaxy = galaxy;
	var _ships = [];
	for(var i=0;i<this.galaxy.starGates.length;i++){
	    this.add(new StarGate(this.galaxy.starGates[i]));
	}
	for(var i=0;i < ships.length;i++){
	    var ship = new ShipSoul(ships[i]).init(ships[i].modules);
	    _ships.push(ship);
	    //test
	    this.add(ship);
	}
	//add AI;
	ships = _ships;
	for(var i=0;i < ships.length;i++){
	    var ship = ships[i];
	    if(ship.AI&&ship.AI.destination.target){
		var id = ship.AI.destination.target;
		if(typeof id == "undefined")continue;
		//target should be valid
		//this work must be done here
		//before here:we can't find ship by id
		//after here:game is already start
		//invalid target will cause 
		//fatal unsync
		console.log("id",id);
		ship.AI.destination.target = this.getShipById(id);
	    }
	}
    }
    
    
    exports.BattleFieldSoul = BattleFieldSoul;
})(exports)
