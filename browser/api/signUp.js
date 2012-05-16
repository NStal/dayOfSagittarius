var Interface = require("./database/interface").Interface;
exports.handler = function(){
    this.parameters = {
	"username":this.CRITICAL
    }
    var getShipTemplate = function(){
	return {
	    name:"name"
	    ,owner:"nstal"
	    ,pilot:"nstal"
	    ,cordinates:{x:100,y:100}
	    ,itemId:36
	    ,modules:[]
	    ,equipmentArray:[]
	    ,cagos:[]
	    ,reward:1200
	    ,action:{
		rotateFix:0
		,speedFix:0
	    }
	    ,physicsState:{
		toward:0
	    }
	};
    } 
    var self = this;
    this.solve(function(query){
	Interface.addUser(query.username,function(user){
	    if(!user){
		self.error(); 
		console.error("user invalid maybe exist",user);
		return;
	    }
	    else{
		var ship = getShipTemplate();
		ship.name = "beginner";
		ship.owner = user._id;
		ship.pilot = user._id;
		Interface.addShip(ship,function(){
		    Interface.changeShipToStation(ship,"Nolava-I",function(){
			self.end();
		    });
		})
	    }
	})
    })
}