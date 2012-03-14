(function(exports){
    var BattleField = require("./share/battleFieldSoul").BattleFieldSoul.sub()
    var Point = require("./util").Point;
    BattleField.prototype._init = function(info){
	BattleField.parent.prototype._init.call(this,info);
	this.position = new Point(0,0);
    }
    BattleField.prototype.act = function(msg){
	console.log(act);
    }
    BattleField.prototype.next = function(context){
	//has connect to server?
	if(!this.ready)return false;
	BattleField.parent.prototype.next.call(this);
	this.draw(context);
    }
    BattleField.prototype.draw = function(context){
	console.log("draw");
	
	//recursive drawing
	context.save();
	if(typeof this.alpha != "undefined"){
	    context.globalAlpha = this.alpha;
	}
	if(this.position){
	    context.translate(this.position.x,this.position.y);
	}
	if(this.rotation){
	    context.rotate(this.rotation);
	}
	if(this.center){
	    context.translate(-this.center.x,-this.center.y); 
	}
	if(this.invert){
	    if(this.invertPadding){
		context.translate(this.invertPadding,0);
	    }
	    context.scale(-1,1);
	}
	if(typeof this.onDraw == "function"){
	    this.onDraw(context);
	}
	if(this.parts){
	    for(var i=0;i<this.parts.length;i++){
		BattleField.prototype.draw.call(this.parts[i],context);
	    }
	}
	if(typeof this.onClear == "function"){
	    this.onClear(context);
	}
	context.restore();
	return;
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
	console.log(ships.length);
	for(var i=0;i < ships.length;i++){
	    var ship = new Ship(ships[i]).init();
	    console.log(ship.cordinates.toString());
	    //test
	    ship.onDraw = function(context){
		context.beginPath();
		context.arc(0,0,20,0,Math.PI*2);
		context.fillStyle = "black";
		context.fill();
	    }
	    this.add(ship);
	}
    }
    exports.BattleField = BattleField;
})(exports)
