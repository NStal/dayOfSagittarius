(function(exports){
    var BattleFieldSoul = require("./share/battleFieldSoul").BattleFieldSoul;
    var Drawable = require("./drawings/drawable.js").Drawable;
    var Class = require("./util").Class;
    var BattleField = BattleFieldSoul.sub();
    var BattleFieldDisplayer = Drawable.sub();
    var Point = require("./util").Point;
    var MouseEventConsumer = require("./drawing/mouseEventDistributer").MouseEventConsumer;
    var ShipMarkSelected = require("./interaction/shipMarkSelected").ShipMarkSelected;
    //BattleFieldDisplayer is also a decorator for battleField
    BattleFieldDisplayer.prototype._init = function(bf){
	//for test 

	this.battleField = bf;
	this.position = new Point(0,0);
	this.scale = 1;
	this.parts= bf.parts;
	this.size = new Point(10000,10000);
	this.shipMark = new ShipMarkSelected();
	Static.interactionDisplayer.add(this.shipMark);
	//listen mouseUp for ship selection;
	this.consumeType.mouseDown = true;
	this.consumeType.mouseMove = true;
	this.consumeType.rightMouseUp = true;
	this.consumeType.rightMouseDown = true;
	
	var self = this;
	this.gridPattern = new Image();
	this.gridPattern.src = "image/grid.png";
	this.gridPattern.onload = function(){
	    self.gridPattern.ready = true;
	}
	this.on("rightMouseDown",function(){
	    Static.UIDisplayer.modulePanel.show(null);
	    Static.UIDisplayer.shipInterface.show(null);
	    Static.UIDisplayer.starStationInterface.show(null); 
	    return true;
	})
	this.on("rightMouseUp",function(){
	    return true;
	})
	this.on("mouseDown",function(e){
	    var ship = self.findShipByPosition(self.screenToBattleField(e));
	    if(!ship){
		var station = self.findStarStationByPosition(self.screenToBattleField(e));
		Static.UIDisplayer.starStationInterface.show(station);
		return;
	    } 
	    self.shipMark.set(ship);
	    Static.UIDisplayer.modulePanel.show(ship);
	    Static.UIDisplayer.shipInterface.show(ship);
	    return true;
	});
	this.on("mouseMove",function(e){
	    var ship = self.findShipByPosition(self.screenToBattleField(e));
	    var mouse = Static.UIDisplayer.mouse;
	    if(ship){
		if(ship.owner==Static.username)
		    mouse.type = mouse.types.onShip;
		else{
		    mouse.type = mouse.types.attack;
		}
	    }else{
		mouse.type = mouse.types.normal;
	    }
	})
	this.mouseReactSize = 9999;
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
	//return;
	if(!this.gridPattern.ready)return;
	context.rect(0,0,this.size.x,this.size.y);
	var pattern = context.createPattern(this.gridPattern,"repeat");
	context.fillStyle = pattern;
	context.fill();
	
	/*
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
	context.globalAlpha = 1;*/
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
    BattleFieldDisplayer.prototype.findStarStationByPosition = function(p){
	var distance = 9999999999;
	var  stationSize = 50;
	var ship = null;
	var station = null;
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.type!="station")continue;
	    var _dis = item.position.distance(p);
	    if(_dis < distance 
	       && _dis < stationSize){
		distance = _dis;
		station = item;
	    }
	}
	return station;
    } 
    MouseEventConsumer.mixin(BattleFieldDisplayer);
    exports.BattleField = BattleField;
    exports.BattleFieldDisplayer = BattleFieldDisplayer;
})(exports)
