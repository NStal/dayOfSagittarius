(function(exports){
    
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Container = require("../drawing/drawable").Drawable;
    var MouseInteraction = require("./interaction/mouseInteraction").MouseInteraction; 
    var InteractionManager = Drawable.sub();
    var ShipSelectInteraction = require("./interaction/shipSelectInteraction").ShipSelectInteraction; 
    var MouseEventDistributer = require("../drawaing/mouseEventDistributer").MouseEventDistributer;
    
    var InteractionDisplayer = Drawable.sub();
    MouseEventConsumer.mixin(InteractionDisplayer);
    InteractionDisplayer.prototype._init = function(world){
	this.world = world;
	this.marks = []; 
	var self = this; 
	var ShipInfoMark = require("./shipInfoMark").ShipInfoMark; 
	Static.battleField.on("initialize",function(){
	    self.init();
	}) 
	this.shipMark = new ShipMarkSelected();
	this.add(this.shipMark);
	Static.battleField.on("shipInitialized",function(ships){
	    var tempArr = ships;
	    for(var i=0,length=tempArr.length;i < length;i++){
		var item = tempArr[i];
		self.marks.push(new ShipInfoMark(item));
	    }
	    self.showMarks();
	})
    }
    InteractionDisplayer.prototype.init = function(){
	this.marks.length = 0;
	this.parts.length = 0;
	this.add(this.shipMark);
	this.shipMark.set(null);
    }
    InteractionDisplayer.prototype.showMarks = function(){
	var tempArr = this.marks;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    item.show();
	}
	this.isMarkShown = true;
    }
    InteractionDisplayer.prototype.hideMarks = function(){
	var tempArr = this.marks;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    item.hide();
	}
	this.isMarkShown = false;
    }
    InteractionDisplayer.prototype.toggleMarks = function(){
	if(this.isMarkShown)this.hideMarks();
	else this.showMarks();
    }
    InteractionDisplayer.prototype.onDraw = function(){
	
	this.position = Static.battleFieldDisplayer.position;
	this.scale = Static.battleFieldDisplayer.scale;
    }
    InteractionDisplayer.prototype.isPointInScreen = function(p){
	var w = settings.width;
	var h = settings.height;
	var scale=Static.battleFieldDisplayer.scale;
	//console.log(p.toString(),Static.battleFieldDisplayer.position.toString());
	return (p.x>-Static.battleFieldDisplayer.position.x/scale
		&& p.y>-Static.battleFieldDisplayer.position.y/scale
		&&p.x<-Static.battleFieldDisplayer.position.x/scale+w
		&&p.y<-Static.battleFieldDisplayer.position.y/scale+h);
    }
    exports.InteractionDisplayer = InteractionDisplayer;
})(exports)