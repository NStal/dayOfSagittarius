(function(exports){
    var BattleFieldSoul = require("./share/battleFieldSoul").BattleFieldSoul;
    var Class = require("./util").Class;
    var BattleField = Class.changeRoot(BattleFieldSoul,Drawable).sub();
    var Point = require("./util").Point;
    BattleField.prototype._init = function(info){
	BattleField.parent.prototype._init.call(this,info);
	this.position = new Point(0,0);
	this.scale = 1;
    }
    BattleField.prototype.next = function(context){
	//has connect to server?
	if(!this.ready)return false;
	BattleField.parent.prototype.next.call(this);
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i]
	    if(item.type=="ship"){
		item.position = item.cordinates;
		item.rotation = item.physicsState.toward; 
	    }
	}
	this.setViewPort(context);
	this.drawGrid(context);
	this.draw(context);
    }
    BattleField.prototype.setViewPort = function(context){
	context.translate(this.position.x,this.position.y);
	context.scale(this.scale,this.scale);
    }
    BattleField.prototype.drawGrid = function(context){
	context.strokeStyle = "#999";
	context.lineWidth = 0.4;
	context.beginPath();
	for(var i=0;i < this.size.x;i+=100){
	    context.moveTo(i,0);
	    context.lineTo(i,this.size.y);
	} 
	for(var i=0;i < this.size.y;i+=100){
	    context.moveTo(0,i);
	    context.lineTo(this.size.x,i);
	}
	context.stroke();
    }
    BattleField.prototype.onInstruction = function(instruction){
	var Protocol = require("./share/protocol");
	BattleField.parent.prototype.onInstruction.call(this,instruction);
    }
    BattleField.prototype.addShip = function(ship){
	var ship = new Ship(ships[i]).init(ship.modules); 
	ship.onDraw = function(context){
	    context.beginPath();
	    context.moveTo(-6,-3);
	    context.lineTo(6,0);
	    context.lineTo(-6,3);
	    context.closePath();
	    context.fillStyle = "black";
	    context.fill();
	}
	this.add(ship);
    }
    BattleField.prototype.passStarGate = function(ship,gate){
	var g = game.galaxyMap.getGalaxyByName(gate.to);
	if(!g){
	    console.log("error pass invalid gate");
	    console.trace();
	}
	this.remove(ship);
	window.location.hash = gate.to;
    }
    BattleField.prototype.initByShips = function(ships,galaxy){
	var StarGate = require("./ship/starGate").StarGate;
	this.parts.length = 0;
	var _ships = [];
	console.log(ships);
	for(var i=0;i < ships.length;i++){
	    var ship = new Ship(ships[i]).init(ships[i].modules);
	    _ships.push(ship);
	    //test
	    ship.onDraw = function(context){
		context.beginPath();
		context.moveTo(-6,-3);
		context.lineTo(6,0);
		context.lineTo(-6,3);
		context.closePath();
		context.fillStyle = "black";
		context.fill();
	    }
	    this.add(ship);
	} 
	for(var i=0;i<galaxy.starGates.length;i++){
	    this.add(new StarGate(galaxy.starGates[i]));
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
    BattleField.prototype.screenToBattleField = function(p){
	var p = new Point(p);
	p.x -= this.position.x;
	p.y -= this.position.y;
	p.x /= this.scale;
	p.y /= this.scale;
	return p;
    }
    BattleField.prototype.battleFieldToScreen = function(p){
	var p = new Point(p); 
	p.x *= this.scale;
	p.y *= this.scale;
	p.x += this.position.x;
	p.y += this.position.y;
	return p;
    }
    BattleField.prototype.findStarGateByPosition = function(p){
	var distance = 9999999999;
	var gate = null;
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.type!="gate")continue;
	    var _dis = item.position.distance(p);
	    if(_dis < distance 
	       && _dis < item.size){
		distance = _dis;
		gate = item;
	    }
	}
	return gate;
    }
    BattleField.prototype.enterShip = function(ship){
	var ship = new Ship(ship).init(ship.modules);
	console.log(ship.cordinates);
	this.add(ship);
    }
    BattleField.prototype.findShipByPosition = function(p){
	var distance = 9999999999;
	var ship = null;
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.type!="ship")continue;
	    var _dis = item.cordinates.distance(p);
	    if(_dis < distance 
	       && _dis < item.state.size){
		distance = _dis;
		ship = item;
	    }
	}
	return ship;
    }
    exports.BattleField = BattleField;
})(exports)
