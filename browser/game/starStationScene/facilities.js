
var Factory = Class.sub();
var Market = Class.sub();
//closure here to make sure class Equipmen do not pollute the global scope
(function(exports){
    Factory.prototype._init = function(facility){
	Widget.call(this,Static.template.factory);
	//this.info = Static.starStationScene.ships;
	var self = this;
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
	this.shipDesigner = new ShipDesigner(this.equipmentsJ,this.canvas);
	this.changeShip(this.shipInfos[0]);
	facility.box.add(this);
    }
    Factory.prototype.prepareCanvas = function(){
	this.canvas.width = this.shipDisplayerJ.width();
	this.canvas.height = this.shipDisplayerJ.height();
    }
    Factory.prototype.onClickSave = function(eq){
	if(this.currentShip._id)this.currentShip.id = this.currentShip._id;
	alert(this.shipDesigner.blueprint.isArchitectureValid());
	Static.HttpAPI.updateShipModules(this.currentShip.id
					 ,JSON.stringify(this.shipDesigner.blueprint.toEquipmentData())
					 ,function(rsp){
					     console.error(rsp);
					 });
    }
    //Ship can only equip the modules in it's cago
    Factory.prototype.changeShip = function(ship){
	this.shipDesigner.workOn(ship); 
	this.currentShip = ship;
    }
    Market.prototype._init = function(facility){
	
    }
})(exports)