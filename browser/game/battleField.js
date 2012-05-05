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
	if(this.position)this.position.release();
	this.position = Point.Point(0,0);
	this.scale = 1;
	this.parts= bf.parts;
	if(this.size)this.size.release();
	this.size = Point.Point(10000,10000);
	this.shipMark = new ShipMarkSelected();
	Static.interactionDisplayer.add(this.shipMark);
	//listen mouseUp for ship selection;
	this.consumeType.mouseDown = true;
	this.consumeType.mouseMove = true;
	this.consumeType.rightMouseUp = true;
	this.consumeType.rightMouseDown = true; 
	this.followShip = true;
	var self = this;
	this.battleField.on("shipInitialized",function(ship){
	    for(var i=0,length=ship.length;i < length;i++){
		var item = ship[i];
		console.log(item.pilot);
		if(item.pilot == Static.username){
		    self.userOnShip = item;
		    return;
		}
	    }
	})
	this.gridImage = Static.resourceLoader.get("grid");
	console.log(this.gridImage);
	this.on("rightMouseDown",function(e){
	    //Static.UIDisplayer.modulePanel.show(null);
	    //Static.UIDisplayer.shipInterface.show(null);
	    //Static.UIDisplayer.starStationInterface.show(null); 
	    //Static.UIDisplayer.shipInfoDisplayer.show(null);
	    if(self.selectedShip && self.selectedShip.owner==Static.username){
		var p =self.screenToBattleField(e)
		Static.UIDisplayer.actionInterface.show(p);
		p.release();
	    }
	    return true;
	})
	this.on("rightMouseUp",function(){
	    return true;
	})
	this.on("mouseDown",function(e){
	    var ship = self.findShipByPosition(self.screenToBattleField(e)); 
	    Static.UIDisplayer.actionInterface.hide();
	    if(!ship){
		return;
		var station = self.findStarStationByPosition(self.screenToBattleField(e));
		Static.UIDisplayer.starStationInterface.show(station);
		return;
	    }
	    self.shipMark.set(ship);
	    self.selectedShip = ship;
	    Static.UIDisplayer.shipInfoDisplayer.show(ship);
	    Static.UIDisplayer.modulePanel.show(ship);
	    //Static.UIDisplayer.shipInterface.show(ship);
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
	if(this.followShip)
	    this.setViewPort(context);
    }
    BattleFieldDisplayer.prototype.setViewPort = function(context){
	var min = 6;
	if(this.userOnShip){
	    //make a animation to move view to the followed ship
	    var targetX = -(this.userOnShip.cordinates.x-settings.width/2);
	    var targetY = -(this.userOnShip.cordinates.y-settings.height/2);
	    if(Math.abs(targetX-this.position.x)<min){
		this.position.x = targetX;
	    }else{
		this.position.x += (targetX-this.position.x)*1/2;
	    } 
	    //not directly set,move it;
	    if(Math.abs(targetY-this.position.y)<min){
		this.position.y = targetY;
	    }else{
		this.position.y += (targetY-this.position.y)*1/2;
	    }
	    if(this.position.x>0){
		this.position.x=0;
	    }
	    if(this.position.y>0){
		this.position.y=0;
	    }
	    if(this.position.x<=(-this.size.x+settings.width)){
		this.position.x = (-this.size.x+settings.width);
	    }
	    
	    if(this.position.y<=(-this.size.y+settings.height)){
		this.position.y = (-this.size.y+settings.height);
	    }
	}
	//context.translate(-this.position.x,-this.position.y);
	//console.log(this.position.toString());
	//context.scale(this.scale,this.scale);
    }
    BattleFieldDisplayer.prototype.drawGrid = function(context){
	context.beginPath();
	context.rect(0,0,this.size.x,this.size.y);
	if(!this.gridPattern){
	    this.gridPattern = context.createPattern(this.gridImage,"repeat");
	    console.log("pattern",this.gridPattern);
	}
	context.fillStyle = this.gridPattern;
	//context.fillStyle = "#444";
	context.fill();
	return;
	for(var i=0;i < this.size.x;i+=50){
	    context.moveTo(i,0);
	    context.lineTo(i,this.size.y);
	} 
	for(var i=0;i < this.size.y;i+=50){
	    context.moveTo(0,i);
	    context.lineTo(this.size.x,i);
	} 
	context.globalAlpha = 0.3;
	context.strokeStyle = "#666";


	context.lineWidth = 1;
	context.stroke();
	context.globalAlpha = 1;
    }
    BattleFieldDisplayer.prototype.screenToBattleField = function(p){
	var p = Point.Point(p);
	p.x -= this.position.x;
	p.y -= this.position.y;
	p.x /= this.scale;
	p.y /= this.scale;
	return p;
    }
    BattleFieldDisplayer.prototype.battleFieldToScreen = function(p){
	var p = Point.Point(p); 
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
    BattleFieldDisplayer.prototype.findNearestNoFriend = function(p,maxDistance){
	var distance = 9999999999;
	if(!maxDistance){
	    var maxDistance = 800;
	}
	var ship = null;
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.type!="ship" || item.owner==Static.username)continue;
	    var _dis = item.cordinates.distance(p);
	    if(_dis < distance 
	       && _dis < maxDistance){
		distance = _dis;
		ship = item;
	    }
	}
	return ship;
    }
    BattleFieldDisplayer.prototype.findNearestShip = function(p,maxDistance){
	var distance = 9999999999;
	if(!maxDistance){
	    var maxDistance = 800;
	}
	var ship = null;
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.type!="ship")continue;
	    var _dis = item.cordinates.distance(p);
	    if(_dis < distance 
	       && _dis < maxDistance){
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
