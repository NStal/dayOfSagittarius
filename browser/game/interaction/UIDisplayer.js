(function(exports){
    
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Container = require("../drawing/drawable").Drawable;
    var MouseSprite = require("./interaction/mouseInteraction").MouseSprite; 
    var InteractionManager = Drawable.sub();
    var ShipSelectInteraction = require("./interaction/shipSelectInteraction").ShipSelectInteraction; 
    var MouseEventDistributer = require("../drawaing/mouseEventDistributer").MouseEventDistributer;
    var UIDisplayer = Drawable.sub();
    var StarStationInfoDisplayer = require("../ship/starStationInfoDisplayer").StarStationInfoDisplayer;
    UIDisplayer.prototype._init = function(world){
	this.world = world;
	this.mouse = new MouseSprite();
	var self = this; 
	this.consumeType.mouseMove = true;
	this.on("mouseMove",function(e){
	    self.mouse.position = e;
	}) 
	var ModulePanel = require("./modulPanel").ModulePanel;
	this.modulePanel = new ModulePanel(); 
	var ShipInterface = require("./shipInterface").ShipInterface;
	this.starStationInterface = new StarStationInterface();
this.shipInterface = new ShipInterface(); 
	this.add(this.shipInterface);
	this.add(this.modulePanel);
	this.add(this.starStationInterface);
	this.add(this.mouse);
	this.starStationInfoDisplayer = new StarStationInfoDisplayer(Static.template.starStationInfoDisplayer);
    }
    MouseEventConsumer.mixin(UIDisplayer);
    exports.UIDisplayer = UIDisplayer;
})(exports)