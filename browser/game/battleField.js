(function(exports){
    var BattleFieldSoul = require("./share/battleFieldSoul").BattleFieldSoul;
    var Drawable = require("./drawings/drawable.js").Drawable;
    var Class = require("./util").Class;
    var BattleField = BattleFieldSoul.sub();
    var BattleFieldDisplayer = Drawable.sub();
    var Point = require("./util").Point;
    //BattleFieldDisplayer is also a decorator for battleField
    BattleFieldDisplayer.prototype._init = function(bf){
	this.battleField = bf;
	this.position = new Point(0,0);
	this.scale = 1;
	this.parts= bf.parts;
	this.size = new Point(10000,10000);
    }
    BattleFieldDisplayer.prototype.onDraw = function(context){
	if(!this.battleField.ready){
	    return false;
	}
	this.drawGrid(context);
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.cordinates)
		item.position = item.cordinates;
	    if(item.physicsState)
		item.rotation = item.physicsState.toward;
	}
    }
    BattleFieldDisplayer.prototype.setViewPort = function(context){
	context.translate(this.position.x,this.position.y);
	context.scale(this.scale,this.scale);
    }
    BattleFieldDisplayer.prototype.drawGrid = function(context){
	context.beginPath();
	for(var i=0;i < this.size.x;i+=100){
	    context.moveTo(i,0);
	    context.lineTo(i,this.size.y);
	} 
	for(var i=0;i < this.size.y;i+=100){
	    context.moveTo(0,i);
	    context.lineTo(this.size.x,i);
	} 
	context.globalAlpha = 0.3;
	context.strokeStyle = "black";
	context.lineWidth = 1;
	context.stroke();
	context.globalAlpha = 1;
    }
    BattleFieldDisplayer.prototype.screenToBattleField = function(p){
	var p = new Point(p);
	p.x -= this.position.x;
	p.y -= this.position.y;
	p.x /= this.scale;
	p.y /= this.scale;
	return p;
    }
    BattleFieldDisplayer.prototype.battleFieldToScreen = function(p){
	var p = new Point(p); 
	p.x *= this.scale;
	p.y *= this.scale;
	p.x += this.position.x;
	p.y += this.position.y;
	return p;
    }
    BattleFieldDisplayer.prototype.findStarGateByPosition = function(p){
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
    BattleFieldDisplayer.prototype.findShipByPosition = function(p){
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
    exports.BattleFieldDisplayer = BattleFieldDisplayer;
})(exports)
