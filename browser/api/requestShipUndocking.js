var Interface = require("./database/interface").Interface;
var godUtils = require("../../godUtil/godUtil");
exports.handler = function(){
    this.parameters = {
	"stationName":this.CRITICAL
	,"shipId":this.CRITICAL
    }
    var self = this;
    this.solve(function(query){
	Interface.getStarStation(query.stationName,function(station){
	    godUtils.enterShip(station.at.oid,query.shipId,station.position,function(){
		self.end();
	    });
	})
    })
}

