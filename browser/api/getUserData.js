var Interface = require("./database/interface").Interface;
exports.handler = function(){
    this.parameters = {
	"name":this.CRITICAL
    }
    var self = this;
    this.solve(function(query){
	Interface.getUserData(query.name,function(user){
	    Interface.findShipByPilot(query.name,function(ship){
		if(ship){
		    user.atShip = ship;
		    if(ship.at && ship.at.namespace=="galaxies"){
			user.atGalaxy = true;
			user.at = ship.at.oid;
		    }
		    else{
			
			user.atStation = true;
			if(ship.at && ship.at.namespace == "starStations"){
			    user.at = ship.at.oid;
			}else{
			    user.at = user.oid;
			}
		    }
		}
		self.end(user); 
	    })
	})
    })
}