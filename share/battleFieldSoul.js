(function(exports){
    var Class = require("./util").Class;
    var EventEmitter = require("./util").EventEmitter;
    var Point = require("./util").Point;
    var Container = require("./util").Container;
    var clientCommand = require("./protocol").clientCommand;
    var Math = require("./util").Math;
    var BattleFieldSoul = Container.sub();
    EventEmitter.mixin(BattleFieldSoul);
    var Ship = require("./ship/shipSoul").Ship;
    var StarGate = require("./ship/starGate").StarGate;
    var StarStation = require("./ship/starStation").StarStation;
    //BattleFieldSoul is battleField without drawing functions
    //BattleField do these things:
    //1.hold all the ships
    //2.set ship position acording to the the ship.AI
    //3.listen instructions come from the gateway and conduct it.
    BattleFieldSoul.prototype._init = function(info){
	this.parts = [];
	if(this.size)this.size.release();
	this.size = Point.Point(10000,10000);
	this.listener = [];
	this.instructionQueue = [];
	if(!info)return;
	this.world = info.world;
	var self = this;
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
	this.applyInstruction(this.world.time);
	this.time = this.world.time;
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    this.calculateUnit(item);
	    //if near star gate
	}
	
    }
    BattleFieldSoul.prototype.applyInstruction = function(time){
	this.time = time;
	//console.log("at",this.time,this.instructionQueue.length);
	    /*if(this.instructionQueue[0] && typeof this.instructionQueue[0].time == "number" &&
	      this.instructionQueue[0].time < this.time){
	      console.log("fatal Error! recieve outdated instruction from gateway"); 
	      console.trace(); 
	      //throw "Logic Error";
	      }*/
	    //console.log(this.instructionQueue[0]?this.instructionQueue[0].time:null);
	for(var i=0,length=this.instructionQueue.length;i < length;i++){
	    var item = this.instructionQueue[i];
	    if(item.time<this.time){
		console.error("fatal error");
		process.kill();
	    }
	    if(item.time == this.time){
		var ins = item;
		this._excute(ins);
		this.instructionQueue.splice(i,1);
		i--;
		length--;
	    }
	}
	
    }
    BattleFieldSoul.prototype._excute = function(instruction){
	//see protocol.js => clientCommand to all the command implemented here 
	
	if(instruction.cmd==clientCommand.setModuleTarget){
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
	    var target = this.getShipById(instruction.data.targetId);
	    if(!target){
		console.log("target not exist set target to null");
	    }
	    if(m.setTarget){
		m.setTarget(target);
		return true;
	    }
	    console.log("module can't set target");
	    return false;
	}
	if(instruction.cmd == clientCommand.GOD_shipDocked){
	    var ship = this.getShipById(instruction.data.id);
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",instruction.data.id); 
		console.trace();
		return;
	    }
	    ship.clear();
	    ship.emit("docked",ship);
	    console.log("ship",ship.id,"ship dock accept by GOD");
	}
	//chase target 
	if(instruction.cmd == clientCommand.GOD_removeShip){
	    var ship = this.getShipById(instruction.data.id);
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",instruction.data.id); 
		console.trace();
		return;
	    }
	    ship.clear();
	    console.log("ship",ship.id,"removed by GOD");
	}
	if(instruction.cmd == clientCommand.setDockStation){
	    var ship = this.getShipById(instruction.data.id);
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",instruction.data.id);
		console.trace();
		return;
	    }
	    var station = this.getStarStationByName(instruction.data.stationName);
	    if(station){
		console.log("get station of name:",station.name);
	    }else{
		console.log("invalid station id",instruction.data.stationName);
		return;
	    }
	    ship.AI.setDockStation(station);
	    console.log("ship",ship.id,"is move to station",station.name);
	}
	if(instruction.cmd==clientCommand.chaseTarget){
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
		console.log("set target");
		ship.AI.destination.chaseTarget = target;
	    }
	    else{
		console.warn("target your self?");
		console.trace();
		return;
	    }
	    var radius = instruction.radius;
	    if(!radius){
		console.warn("recievef no radius; Broken instruction");
		return;
	    }
	    var antiClockWise = instruction.antiClockWise?true:false;
	    ship.AI.roundAt(target.cordinates,radius,antiClockWise);
	    return;
	} 
	//chaseTarget 	
	if(instruction.cmd==clientCommand.chaseTarget){
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
		ship.AI.destination.targetPoint = target.cordinates;
	    }
	    else{
		console.warn("target your self?");
		console.trace();
	    }
	    
	    return;
	}
	//enter ship
	if(instruction.cmd == clientCommand.GOD_enterShip){
	    if(instruction.data.ship instanceof Array){
		for(var i=0,length=instruction.data.ship.length;i < length;i++){
		    var item = instruction.data.ship[i];
		    console.log("~~~~~",item);
		    this.initShip(item);
		}
	    }
	    else{
		this.initShip(instruction.data.ship);
	    }
	    console.log("new ship entered",instruction.data.ship);
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
	    ship.AI.moveTo(Point.Point(instruction.data.point));
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
	    ship.AI.roundAt(Point.Point(instruction.data.point)
			    ,instruction.data.radius
			    ,instruction.data.antiClockWise);
	}
	if(instruction.cmd==clientCommand.roundAtTarget){
	    var ship = this.getShipById(instruction.data.id);
	    if(ship){
		console.log("get ship of id:",ship.id);
	    }else{
		console.warn("invalid ship id",instruction.data.id); 
		console.trace();
		return;
	    }
	    var target = this.getShipById(instruction.data.targetId);
	    if(target){
		console.log("get target of id",ship.id);
	    }else{
		console.warn("invalid ship id",instruction.data.id);
		console.trace();
		return;
	    }
	    console.log("round at target",target.id);
	    ship.AI.roundAtTarget(target
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
	console.log("unknow cmd!!");
    }
    //calculate the ships next state
    BattleFieldSoul.prototype.calculateUnit = function(unit){
	if(unit.type == "ship"){
	    unit.next();
	}
	if(unit.type == "gate")return;
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
    BattleFieldSoul.prototype.getStarStationByName = function(name){
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.name === name && item.type == "station"){
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
	ship.missed = true;
	this.remove(ship);
    }
    BattleFieldSoul.prototype.onInstruction = function(instruction){
	//console.log("add instruction at:",this.time,instruction);
	this.instructionQueue.push(instruction);
    }
    BattleFieldSoul.prototype.enterShip = function(ship){
	var ship = new Ship(ship).init(ship.modules);
	var self = this;
	ship.on("dead",function(ship,byWho){
	    self.emit("shipDead",ship,byWho);
	});
	ship.on("docking",function(ship,station){
	    self.emit("shipDocking",ship,station);
	})
	ship.on("docked",function(ship){
	    self.emit("shipDocked",ship,ship.AI.destination.starStation);
	})
	this.add(ship);
	return ship;
    }
    BattleFieldSoul.prototype.onShipDead = function(ship,byWho){
	console.log("ship id:",who.id,"is dead",",killed by",byWho.weapon.ship.id);
	
    }
    BattleFieldSoul.prototype.initEnvironment = function(galaxy){
	this.galaxy = galaxy;
	var self = this;
	var _ships = [];
	//add starga
	for(var i=0;i<this.galaxy.starGates.length;i++){
	    this.add(new StarGate(this.galaxy.starGates[i]));
	}
	for(var i=0;i<this.galaxy.starStations.length;i++){
	    this.add(new StarStation(this.galaxy.starStations[i]));
	}
    }
    BattleFieldSoul.prototype.removeAll = function(type){
	var i=0;
	while(this.parts[i]){
	    if(this.parts[i].type==type){
		this.parts.splice(i,1);
	    }else{
		i++;
	    }
	}
    }
    //add a ship and transform any targetId into a target
    BattleFieldSoul.prototype.initShip = function(ship){
	var ship = this.enterShip(ship);
	if(ship.target){
	    ship.target = this.getShipById(ship.target);
	}
	if(ship.AI&&ship.AI.destination.chaseTarget){
	    var id = ship.AI.destination.chaseTarget;
	    console.log("id",id);
	    ship.AI.destination.chaseTarget = this.getShipById(id);
	} 
	this.emit("shipInitialized",[ship]);
	return ship;
    }
    BattleFieldSoul.prototype.initShips = function(ships){
	this.removeAll("ship");
	var __ships = [];
	for(var i=0;i < ships.length;i++){
	    var ship = ships[i];
	    __ships.push(this.enterShip(ship));
	} 
	ships = __ships;
	for(var i=0;i < ships.length;i++){
	    var ship = ships[i];
	    //target should be valid
	    //this work must be done here
	    //before here:we can't find ship by id
	    //after here:game is already start
	    //invalid target will cause 
	    //fatal unsync
	    for(var j=0,length=ship.moduleManager.parts.length;j < length;j++){
		var item = ship.moduleManager.parts[j];
		if(item.target){
		    item.target = this.getShipById(item.target);
		}
	    }
	    if(ship.AI&&ship.AI.destination.chaseTarget){
		var id = ship.AI.destination.chaseTarget;
		console.log("id",id);
		ship.AI.destination.chaseTarget = this.getShipById(id);
	    }
	    if(ship.AI&&ship.AI.destination.roundTarget){
		var id = ship.AI.destination.roundTarget;
		ship.AI.destination.roundTarget = this.getShipById(id);
	    }
	}
	this.emit("shipInitialized",ships);
    }
    exports.BattleFieldSoul = BattleFieldSoul;
})(exports)
