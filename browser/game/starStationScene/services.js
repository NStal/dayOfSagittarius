var ShipModifier = Class.sub();
var GalaxyEntry = Class.sub();
var Service;
(function(exports){
    ShipModifier.prototype._init = function(facility){
	Widget.call(this,Static.template.shipModifier);
	//this.info = Static.starStationScene.ships;
	var self = this;
	this.name="Ship Modifier"
	facility.on("show",function(){
	    self.prepareCanvas();
	    self.shipDesigner.start();
	    //recalculate the canvas size
	    self.shipDesigner.resize(self.canvas.width,self.canvas.height);
	});
	facility.on("hide",function(){
	    self.shipDesigner.stop();
	})
	var shipInfos = Static.starStationScene.ships;
	this.shipInfos = shipInfos;
	this.canvas = this.screenNode;
	this.shipDesigner = new ShipDesigner(this.listJ,this.canvas);
	this.changeShip(this.shipInfos[0]);
    }
    ShipModifier.prototype.prepareCanvas = function(){
	this.canvas.width = $(this.canvas).width();
	this.canvas.height = $(this.canvas).height(); 
	console.log(this.canvas.width);
    }
    ShipModifier.prototype.onClickSave = function(eq){
	if(this.currentShip._id)this.currentShip.id = this.currentShip._id;
	alert(this.shipDesigner.blueprint.isArchitectureValid());
	Static.HttpAPI.updateShipModules(this.currentShip.id
					 ,JSON.stringify(this.shipDesigner.blueprint.toEquipmentData())
					 ,function(rsp){
					     console.error(rsp);
					 });
    }
    //Ship can only equip the modules in it's cago
    ShipModifier.prototype.changeShip = function(ship){
	this.shipDesigner.workOn(ship); 
	this.currentShip = ship;
    } 
    GalaxyEntry.prototype._init = function(){
	Widget.call(this,Static.template.galaxyEntry); 
	this.name = "Galaxy Entry"
	
    }
    GalaxyEntry.prototype.onClickEnterButton = function(){
	Static.starStationScene.onClickLeave();
    }
})(exports)
Services = {
    ShipModifier:ShipModifier
    ,GalaxyEntry:GalaxyEntry
}
