(function(exports){
    var SyncWorker = require("./syncWorker").SyncWorker;
    var Interface = require("../database/interface").Interface;
    var clientCommand = require("./share/protocol").clientCommand;
    var MapTask = require("./share/util").MapTask;
    var godCommandSend = function(galaxyName,data,callback){
	Interface.getGalaxy(galaxyName,function(galaxy){
	    var host = galaxy.server.host;
	    var port = galaxy.server.port; 
	    var worker = new SyncWorker(host,port).start();
	    worker.on("open",function(){
		worker.send(data);
		if(callback)callback();
	    }) 
	})
    } 
    var enterShip = function(galaxyName,shipId,position,callback){
	Interface.getShipById(shipId,function(ship){
	    ship.cordinates = position;
	    ship.AI = {};
	    ship.AI.destination = {};
	    ship.AI.destination.targetPoint = {
		x:position.x+Math.sin(Math.random()*Math.PI*2)*200
		,y:position.y+Math.cos(Math.random()*Math.PI*2)*200
	    }
	    ship.id = ship._id;
	    Interface.changeShipToGalaxy(ship,galaxyName);
	    godCommandSend(galaxyName,{
		cmd:clientCommand.GOD_enterShip
		,data:{
		    ship:ship
		}
	    },callback);
	})
    }
    var addShipsAtGalaxy = function(galaxyName,ships,callback){
	var addShipsToDB = new MapTask();
	for(var i=0,length=ships.length;i < length;i++){
	    var item = ships[i];
	    Interface.addShip(item,function(){
		Interface.changeShipToGalaxy(item,galaxyName,addShipsToDB.newTask());
	    });
	    
	}
	addShipsToDB.on("finish",function(){
	    for(var i=0,length=ships.length;i < length;i++){
		var item = ships[i];
		item.id = item._id;
		godCommandSend(galaxyName,{
		    cmd:clientCommand.GOD_enterShip
		    ,data:{
			ship:ships
		    }
		},callback);
	    }
	})
    }
    
    var UndockShip = function(stationName,shipId,callback){
	Interface.getStarStation("stationName",function(station){
	    for(var i=0,length=station.ships.length;i < length;i++){
		var item = station.ships[i];
		if(item.oid==shipId){
		    Interface.getGalaxy(station.at.oid,function(galaxy){
			var host = galaxy.server.host;
			var port = galaxy.server.port;
			var worker = new SyncWorker(host,port);
			worker.on("open",function(){
			    worker.send({
				
			    })
			})
		    })
		}
	    }
	})
    }
    exports.
    exports.addShipsAtGalaxy = addShipsAtGalaxy;
    exports.enterShip = enterShip;
})(exports)