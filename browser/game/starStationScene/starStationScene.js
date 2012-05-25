(function(exports){
    //for compatibility jXFrame,Here we don't use Class.sub(),instead, we use traditional
    //JS prototype
    var Class = require("../../share/util").Class;
    var Point = require("../../share/util").Point;
    var Drawable = require("../game/drawing/drawable").Drawable; 
    var StarStationScene = function(template){
	Widget.call(this,template);
	this.nodeJ.css({display:"none"});
	this.node.width = settings.width;
	this.node.height = settings.height;
	var self = this;
	Static.battleField.on("shipDocked",function(ship,station){
	    if(ship.pilot = Static.username){
		//users ship docked
		self.station = station; 
		//alert(station.name);
		self.onEnterStation(station.name); 
	    }
	});
    } 
    StarStationScene.prototype.buildFacilities = function (facilityArray){
	this.facility = [];
	for(var i=0;i < facilityArray.length;i++){
	    this.addFacility(facilityArray[i]);
	}
    } 
    StarStationScene.prototype.onEnterStation = function(stationName){
	var self = this;
	//$("#battleScene").css({display:"none"});//hide the battle
	Static.world.stop();
	$("#battleFieldScene").hide();
	this.nodeJ.css({display:"block",cursor:"default"});
	this.getStationInfoByName(stationName); 
    } 
    StarStationScene.prototype.addFacility = function(facilityInfo){
	var fac = new Facility(facilityInfo);
	this.facility.push(fac);//form where we can traverse them
	this.guidBox.add(fac);//guidbox item
	this.nodeJ.append(fac.box.nodeJ);//UI
    }
    StarStationScene.prototype.getStationInfoByName = function (stationName){
	var self = this;
	Static.HttpAPI.getStationInfoByName(stationName,function(response){
	    if(!response.result){
		console.warn("Error fail to get station");
		return;
	    }
	    Static.waitingPage.endWaiting();
	    response.data.facility = [
		{name:"Dock"
		 ,services:["ShipModifier"]}
		,{name:"Exit"
		  ,services:["GalaxyEntry"]
		}
	    ]
	    var context = self.screenNode.getContext("2d")
	    context.textAlign = "center"; 
	    context.translate(self.screenJ.width()/2,self.screenNode.height/2); 
	    context.fillText("Giyya's world here:enter station of "+response.data.name,0,0);
	    console.log(response);
	    self.init(response);
	})
    }
    StarStationScene.prototype.init = function (responce){
	this.data = responce.data;
	this.ships = this.data.ships; 
	this.name = this.data.name;
	this.guidBox = new GuidBox(this);
	this.nodeJ.append(this.guidBox.nodeJ);
	this.interactionBox = new InteractionBox(this);
	this.nodeJ.append(this.interactionBox.nodeJ);
	
	this.buildFacilities(this.data.facility);
	this.goTo("Exit");
    }
    StarStationScene.prototype.onLeave = function(){
	//hide will cause canvas instance stop drawing;
	if(this.currentFacility)this.currentFacility.hide();
    }
    StarStationScene.prototype.onClickLeave = function(){
	var ship = null;
	var arr = this.ships;
	for(var i=0;i < this.ships.length;i++){
	    var item = this.ships[i];
	    if(item.owner == Static.username){
		ship = item;
		break;
	    }
	    
	}
	console.log("tring to leave starStations")
	var self = this;
	if(!ship)alert("error no ship belong to user");
	Static.HttpAPI.requestShipUndocking(
	    ship.id?ship.id:ship._id
	    ,this.name
	    ,function(rsp){
		if(!rsp.result){
		    console.error("fail to leave station",rsp);
		    return;
		}
		setTimeout(function(){
		    Static.site.updateUserInfo(Static.username,function(){
			self.nodeJ.fadeOut();
			Static.world.start();
			$("#battleFieldScene").show();
			self.onLeave();
		    })
		},300);
	    });
    }
    StarStationScene.prototype.goTo = function (placeName){
	for(var i=0 ; i<this.facility.length;i++){
	    if(placeName == this.facility[i].name){
		
		if(this.currentFacility==this.facility[i])return;
		if(this.currentFacility)this.currentFacility.hide();
		this.facility[i].show();
		
		this.currentFacility=this.facility[i];
		return;
	    }
	}
	console.error("can't find :"+placeName);
    }
    exports.StarStationScene = StarStationScene;
})(exports)