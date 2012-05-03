(function(exports){
    var Drawable = require("../drawing/drawable").Drawable;
    var settings = require("../settings").settings;
    var Point = require("./util").Point;
    var MouseEventConsumer = require("../drawaing/mouseEventDistributer").MouseEventConsumer;
    var ShipInfoDisplayer = Drawable.sub(); 
    ShipInfoDisplayer.prototype._init = function(){
	this.ship = null;
	this.bgImage = Static.resourceLoader.get("ui_basicShipInfoPanel");
	this.ecImage = Static.resourceLoader.get("ui_electricityBar");
	this.position = new Point(settings.width/2,settings.height-180);
	var TextPrinter = require("../framework/textPrinter").TextPrinter;
	this.statusText = new TextPrinter();
	this.add(this.statusText);
	this.statusText.color = "white";
	this.statusText.shadowBlur = 4;
	this.statusText.shadowColor = "black";
	this.statusText.lineHeight = 14;
	this.statusText.position = {x:160,y:45};
    }
    ShipInfoDisplayer.prototype.onDraw = function(context){
	this.position.x = settings.width/2;
	this.position.y = settings.height-180;
	var HPCenter = {x:72,y:73};
	context.drawImage(this.bgImage,0,0);
	//drawStructureetc
	context.save();
	context.translate(HPCenter.x,HPCenter.y);
	//draw shield
	//draw armor
	//draw structure
	var shield = 0,shieldMax=0,armor = 0,armorMax = 0;
	for(var i=0,length=this.ship.moduleManager.parts.length;i < length;i++){
	    var item = this.ship.moduleManager.parts[i];
	    if(item.type == "shield"){
		shield += item.state.capacity;
		shieldMax += item.ability.capacity;
	    }
	    if(item.type == "armor"){
		armor += item.state.resistPoint;
		armorMax += item.ability.resistPoint;
	    }
	}
	if(armorMax==0)armorMax=1;
	if(shieldMax==0)shieldMax=1;
	context.globalAlpha = 0.3;
	this.drawPie(context,"#73d7ed",60
		     ,(shield/shieldMax));
	this.drawPie(context,"#3dc05c",40
		     ,(armor/armorMax));
	this.drawPie(context,"#00bdff",20
		     ,(this.ship.state.structure
		       /this.ship.ability.structure));
	context.restore();
	context.save();
	context.translate(72,2); 
	 
	//drawElectricity
	var ecPercentage = this.ship.state.electricity/this.ship.ability.electricity;
	var height = 53;
	context.rect(0,(1-ecPercentage)*height,300,300);
	context.clip();
	context.drawImage(this.ecImage,0,0);
	context.restore();
	var text = ["pilot:"+this.ship.pilot
		    ,"name:"+this.ship.name
		    ,"maxSpeed:"+this.ship.state.maxSpeed
		    ,"maxRotateSpeed:"+this.ship.state.maxRotateSpeed];
	
	this.statusText.setText(text.join("\n"));
    }
    ShipInfoDisplayer.prototype.drawPie = function(context,color,radius,percentage){
	context.beginPath();
	context.moveTo(0,0);
	context.arc(0,0,radius,0
		    ,Math.PI*2
		    *percentage);
	context.closePath(); 
	context.fillStyle = color;
	context.fill();
	context.beginPath(); 
	context.arc(0,0,radius,0
		    ,Math.PI*2);
	context.strokeStyle = color;
	context.lineWidth = 0.5;
	context.stroke();
    }
    ShipInfoDisplayer.prototype.show = function(ship){
	if(ship){
	    if(!this.isShown){
		Static.UIDisplayer.add(this);
	    }
	    this.isShown = true;
	    this.ship = ship;
	}else{
	    this.ship = null;
	    this.isShown = false;
	    Static.UIDisplayer.remove(this);
	}
    }
    exports.ShipInfoDisplayer = ShipInfoDisplayer;
})(exports)