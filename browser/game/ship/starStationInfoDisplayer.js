(function(exports){
    var Class = require("../share/util").Class;
    var StarStationInfoDisplayer = Class.sub();
    var EventEmitter = require("../share/util").EventEmitter;
    EventEmitter.mixin(StarStationInfoDisplayer);
    StarStationShipItem = Class.sub();
    StarStationShipItem.prototype._init = function(ship,station,parent){
	Widget.call(this,Static.template.starStationShipItem);
	this.ship = ship;
	this.station = station;
	this.shipIdJ.text(ship.id);
	this.onClickUndock = function(){
	    Static.HttpAPI.requestShipUndocking(this.ship.id
						,this.station.name
						,function(){
						    parent.update()
						});
	}
    }
    StarStationInfoDisplayer.prototype._init = function(){
	PopupBox.call(this,Static.template.starStationInfoDisplayer);
	console.trace();
	this.onClickCancel = function(){
	    this.station = null;
	    this.popoff();
	}
    }
    StarStationInfoDisplayer.prototype.update = function(){
	if(!this.station){
	    return;
	}
	var station = this.station;
	var self = this;
	Static.HttpAPI.getStationInfoByName(station.name,function(rsp){
	    if(!rsp.result){
		self.shipListJ.text("fail to load starStationInformation");
		return;
	    }
	    if(rsp.data.ships.length<1)self.shipListJ.text("no ships");
	    for(var i=0,length=rsp.data.ships.length;i < length;i++){
		var item = rsp.data.ships[i];
		item.id = item._id;
		var si = new StarStationShipItem(item,station,self);
		self.shipListJ.append(si.node);
	    }
	})
	self.shipListJ.empty().text("loading...");
    }
    StarStationInfoDisplayer.prototype.show = function(station){
	this.station = station;
	this.popup();
	this.update();
    }
    exports.StarStationInfoDisplayer = StarStationInfoDisplayer;
})(exports)