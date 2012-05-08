var vuvu="115.156.219.166"
var Interface = require("../database/interface").Interface;
var MapTask =require("../share/util").MapTask;
var users = ["nstal"]//,"AI"];
var getShipTemplate = function(){
    return {
	name:"name"
	,owner:"nstal"
	,pilot:"nstal"
	,cordinates:{x:100,y:100}
	,category:0
	,ability:{
	    maxSpeed:8
	    ,structure:8000
	    ,maxRotateSpeed:0.2
	    ,speedFactor:0.8
	    ,cpu:10
	    ,size:18
	    ,curveForwarding:true
	    ,electricity:20000
	}
	,modules:[]
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
var GALAXIES = [{
    name:"Nolava"
    ,position:{x:300,y:400}
    ,size:24
    ,starGates:[{
	to:"Evy"
	,position:{x:900,y:900}
    }]
    ,ships:[]
    ,starStations:[]
    ,server:{
	host:vuvu
	,localport:20000
	,port:10000
    }
},{
    name:"Evy"
    ,position:{x:350,y:200}
    ,size:24
    ,to:[{
	galaxyName:"Nolava"
	,position:{x:900,y:900}
    }]
    ,ships:[]
    ,starStations:[]
    ,starGates:[]
    ,server:{
	host:vuvu
	,localport:20001
	,port:10001
    }
}]
var StarStations = [{
    name:"Nolava-I"
    ,color:"blue"
    ,type:"station"
    ,galaxy:"Nolava"
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
    var shipsAPerson = 1;
    console.log("add a ship for every initial user");
    for(var i=0;i < users.length*shipsAPerson;i++){
	var user = users[Math.floor(i/shipsAPerson)];
	var ship = getShipTemplate();
	ship.owner = user;
	if(i/shipsAPerson!=Math.floor(i/shipsAPerson)){
	    ship.pilot = user+"'sAI";
	}
	else{
	    ship.pilot = user;
	}
	ship.modules = [13,13 //2 Cannon small
			,7,1//,3//Missile//Beam small//Beam Big
			,19 //small shield
			,25 //small armor
			,31 //small shieldRecharger
			,35,35 // 2 tiny engine
		       ];
	ship.cagos = [1,2,3,4,1,4,2,6,5];
	ship.cordinates = {x:Math.random()*600+200
			   ,y:Math.random()*600+200
			  };
	createShips.newTask();
	Interface.addShip(ship,function(){
	    createShips.complete();
	    console.log("ship::::",ship);
	});
    }
    //add AI ship;
    var centerP = {x:300,y:300};
    for(var i=0;i<10;i++){
	var ship = getShipTemplate();
	ship.owner = "AI";
	ship.pilot = "AI-n"+Math.floor(Math.random()*10000000)
	ship.modules = [
	    13 //1 Cannon small
	    ,1 //1 beam small
	    ,19,25,35 // shield/armor.engine
	];
	ship.cagos = [1]; //holds a beam small
	ship.cordinates = {
	    x:Math.random()*500+centerP.x
	    ,y:Math.random()*500+centerP.y
	}
	createShips.newTask();
	Interface.addShip(ship,function(){
	    createShips.complete();
	    console.log("add AI ship",ship);
	})
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
	console.log("~~~");
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
