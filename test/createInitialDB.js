var Interface = require("../database/interface").Interface;
var MapTask =require("../share/util").MapTask;
var users = ["nstal","giyya","AI"];
var getShipTemplate = function(){
    return {
	name:"name"
	,owner:"AI"
	,pilot:"nstal"
	,cordinates:{x:100,y:100}
	,category:0
	,ability:{
	    maxSpeed:25
	    ,structure:10000
	    ,maxRotateSpeed:0.2
	    ,speedFactor:0.8
	    ,cpu:10
	    ,size:18
	    ,curveForwarding:true
	}
	,modules:[]
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
var GALAXIES = [{
    name:"Nolava"
    ,color:"black"
    ,position:{x:300,y:400}
    ,size:24
    ,to:["Evy","Lerum"]
    ,ships:[]
    ,starStations:[]
    ,starGates:[]
    ,server:{
	host:"115.156.219.166"
	,localport:20000
	,port:10000
    }
}]
var StarStations = [{
    name:"Nolava-I"
    ,color:"blue"
    ,type:"station"
    ,position:{
	x:800
	,y:300
    }
    ,ships:[]
}]

//START TEST
console.log("create users");
for(var i=0;i < users.length;i++){
    var user = users[i];
    Interface.addUser(user);
    console.log("add users",user);
    (function(_user){
	Interface.getUserData(_user,function(obj){
	    Interface.setUserData(_user,{credits:2000},function(){
		Interface.getUserData(_user,function(obj){
		    console.log("set,credits");
		    console.log("result",obj); 
		})
	    });
	})
    })(user);
}
console.log("removeAll ships") 
var createShips = new MapTask();
Interface.removeAllShips(function(){    
    console.log("add a ship for every initial user");
    for(var i=0;i < users.length;i++){
	var user = users[i];
	var ship = getShipTemplate();
	ship.owner = user;
	ship.pilot = user;
	ship.modules = [0,1,2,2];
	ship.cordinates = {x:Math.random()*600
			   ,y:Math.random()*600
			  };
	createShips.newTask();
	Interface.addShip(ship,function(){
	    createShips.complete();
	});
    }
    createShips.on("finish",function(){
	Interface.getAllShips(function(ships){
	    var __list = [];
	    for(var i=0;i<ships.length;i++){
		var item = ships[i];
		item = item._id;
		__list.push(item);
	    }
	    console.log("after create all ships",__list); 
	})
    }); 
});
console.log("create initial galaxys");
var createGalaxy = new MapTask();
createShips.on("finish",function(){
    Interface.removeAllGalaxy(function(){
	
	for(var i=0;i < GALAXIES.length;i++){
	    var g = GALAXIES[i];
	    (function(g){
		createGalaxy.newTask();
		Interface.addGalaxy(g,function(){
		    console.log("galaxy",g.name,"added");
		    createGalaxy.complete();
		});
	    })(g);
	}
    })
})

//uncomment below to test clearShipF
var testClear = new MapTask();
createGalaxy.on("finish",function(){
    console.log("all galaxy added");
    console.log("set ships for Nolava");
    Interface.getAllShips(function(ships){
	for(var i=0;i < ships.length;i++){
	    Interface.changeShipToGalaxy(ships[i],"Nolava",testClear.newTask());
	}
    })
    console.log("set starStation for Nolava");
})
//testClear.on("finish",function(){
//    //test clearShipParent
//    Interface.getAllShips(function(ships){
//	Interface.clearShipParent(ships[0]);
//	console.log("clear ships");
//    })
//});
var createStarStations = new MapTask();
createGalaxy.on("finish",function(){
    console.log("add starStations for Nolava");
    Interface.removeAllStarStations(function(){
	for(var i=0,length=StarStations.length;i < length;i++){
	    var item = StarStations[i];
	    Interface.addStarStation(item,createStarStations.newTask());
	}
    })
})
createStarStations.on("finish",function(){
    console.log("changeStarStation to Nolava");
    Interface.getStarStations(null,function(stations){
	for(var i=0,length=stations.length;i < length;i++){
	    var item = stations[i];
	    Interface.moveStarStationToGalaxy(item.name,"Nolava");
	}
    })
})
