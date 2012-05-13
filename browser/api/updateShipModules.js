var Interface = require("./database/interface").Interface;
var Blueprint =require("../share/blueprint").Blueprint;
exports.handler = function(){
    this.parameters = {
	"id":this.CRITICAL
	,"equipments":function(data){
	    try{
		var arr = JSON.parse(data);
		console.log(arr);
		return arr;
	    }catch(e){
		console.warn(e.toString(),data);
		console.trace();
		return null
	    }
	}
    }
    var self = this;
    this.solve(function(query){
	Interface.getShipById(query.id,function(ship){
	    if(!ship.at){
		//not in station
		console.log("no at?");
		self.error();
		return;
	    }
	    if(ship.at.namespace!="starStations"){
		self.error();
		console.log("not in station",ship.at);
		return;
	    }
	    var oldEq = ship.equipments?ship.equipments:[];
	    ship.equipments = query.equipments;
	    var blueprint = new Blueprint(ship);
	    var isValid = blueprint.isArchitectureValid(); 
	    if(!isValid){
		self.error();
		return;
	    }
	    var origin = {};
	    var tempArr = oldEq;
	    for(var i=0,length=tempArr.length;i < length;i++){
		var item = tempArr[i];
		if(typeof origin[item.id] =="number"){
		    origin[item.id]++;
		}else{
		    origin[item.id]=1;
		}
	    }
	    var tempArr = ship.cagos;
	    for(var i=0,length=tempArr.length;i < length;i++){
		var item = tempArr[i];
		if(typeof origin[item] =="number"){
		    origin[item]++;
		}else{
		    origin[item]=1;
		}
	    }
	    var newEquipment = {};
	    var tempArr = ship.equipments;
	    for(var i=0,length=tempArr.length;i < length;i++){
		var item = tempArr[i];
		if(typeof newEquipment[item.id] =="number"){
		    newEquipment[item.id]++;
		}else{
		    newEquipment[item.id]=1;
		}
	    }
	    for(var item in newEquipment){
		if(origin[item] && origin[item]-newEquipment[item]>=0){
		    //has enough resource OK
		    origin[item] -= newEquipment[item];
		    if(origin[item]==0){
			delete origin[item];
		    }
		}else{
		    //not enough
		    self.error();
		    return;
		}
	    }
	    var newCago = [];
	    for(var item in origin){
		for(var i=0;i<origin[item];i++){
		    newCago.push(+item);
		}
	    }
	    ship.modules = [];
	    for(var i=0;i<ship.equipments.length;i++){
		ship.modules.push(ship.equipments[i].id);
	    }
	    ship.cagos = newCago;
	    Interface.setShip(ship,ship,function(){
		self.end({
		    isValid:isValid
		    ,cago:newCago
		});
	    });
	})
    })
}