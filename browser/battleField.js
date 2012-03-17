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
	    item.position = item.cordinates;
	    item.rotation = item.physicsState.toward; 
	}
	context.save();
	this.setViewPort(context);
	this.drawGrid(context);
	this.draw(context);
	context.restore();
    }
    BattleField.prototype.setViewPort = function(context){
	//context.translate(this.position.x,this.position.y);
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
	if(instruction.c==Protocol.clientCommand.sync){
	    this.initByShips(instruction.d.ships);
	    console.log("here");
	    return;
	}
	BattleField.parent.prototype.onInstruction.call(this,instruction);
    }
    BattleField.prototype.initByShips = function(ships){
	this.parts = [];
	for(var i=0;i < ships.length;i++){
	    var ship = new Ship(ships[i]).init();
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
    BattleField.prototype.findShipByPosition = function(p){
	var distance = 9999999999;
	var ship = null;
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
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
