(function(exports){
    var mongodb = require("mongodb");
    var MapTask = require("./share/util").MapTask;
    var settings = require("./localshare/settings").settings;
    //interface is the only way that server interact with database
    //interface may be also buffered data if nessesary
    //interface should promise work to be done,even buffered for delay
    Interface = function(){
	console.warn("Interface is a static Class,don't call it ");
	console.trace();
    };
    Interface.deref = function(ref,callback){
	this._getDB(function(err,db){
	    if(db){
		db.dereference(ref,callback);
	    }
	})
    }
    Interface._getDB = function(callback){
	this.dbName = "dayOfSagittarius";
	this.server = new mongodb.Server(settings.dbhost,settings.dbport,{});
	this.connector = new mongodb.Db(this.dbName,this.server,{});
	if(this.db){
	    callback(null,this.db);
	}else{
	    this.connector.open(function(err,db){
		if(db){
		    //save db for next time
		    Interface.db = db;
		}
		//Invoke callback even something is wrong
		//Then client have chance to solve problems
		callback(err,db);
	    });
	}
    }
    Interface._getCollection = function(name,callback){
	this._getDB(function(err,db){
	    if(err||!db){
		callback(err,null);
	    }else{
		db.collection(name,callback);
	    }
	})
    }
    Interface.addUser = function(username){
	this._getCollection("users",function(err,col){
	    if(err||!col){
		console.log(err);
		console.error("fail to add user");
		console.trace();
		return;
	    }
	    col.insert({_id:username
			,credits:2000
			,at:new mongodb.DBRef("starStations","Nolava-I") 
			//at is your born place,if no ship.pilot is the username
			//then you will be at you born place 
			//usually because u are dead
			});
			//Nolava is the initial galaxies
			//
	})
    }
    Interface.setUserData = function(username,data,callback){
	this._getCollection("users",function(err,col){
	    if(err||!col){
		console.log(err);
		console.error("collection error");
		console.trace();
		return;
	    }
	    var cur = col.findOne({_id:username},function(err,obj){
		if(!obj||err){
		    console.log(err);
		    console.error("fail to setuserdata");
		    console.trace();
		    return;
		}
		for(var item in data){
		    obj[item] = data[item];
		}
		if(!callback)callback = function(){};
		col.update({_id:username}
			   ,obj
			   ,{safe:true}
			   ,callback);
	    });
	});
    }
    Interface.getUserData =function(username,callback){
	this._getCollection("users",function(err,col){
	    if(err||!col){
		console.log(err); 
		console.error("collection error");
		console.trace();
		return;
	    }
	    var cur = col.findOne({_id:username},function(err,obj){
		if(!obj||err){
		    console.log(err);
		    console.error("fail to setuserdata");
		    console.trace();
		    return;
		}
		callback(obj);
	    });
	}); 
    }
    Interface.addGalaxy = function(galaxy,callback){
	this._getCollection("galaxies",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","galaxies");
		return;
	    }
	    galaxy._id = galaxy.name;
	    col.insert(galaxy,{safe:true},callback);
	})
    }
    Interface.getGalaxy = function(galaxyName,callback){
	this._getCollection("galaxies",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","galaxies");
		return;
	    }
	    col.findOne({_id:galaxyName},function(err,obj){
		if(err || !obj){
		    console.log("fail get galaxy",galaxyName); 
		    return;
		}
		callback(obj);
	    });
	})
    } 
    Interface.getAllGalaxies = function(callback){
	this._getCollection("galaxies",function(err,col){
	    if(!col){
		return;
	    }
	    var cur = col.find();
	    cur.toArray(function(arr){
		callback(arr);
	    })
	})
    }
    Interface.removeAllGalaxy = function(callback){
	this._getCollection("galaxies",function(err,col){
	    if(!col){
		return;
	    }
	    col.remove(function(){
		if(callback)callback();
	    });
	})
    }
    Interface.setGalaxy = function(galaxyName,newOne,callback){
	this._getCollection("galaxies",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","galaxies");
		return;
	    }
	    col.update({_id:galaxyName},newOne,{safe:true},function(err,obj){
		if(err || !obj){
		    console.log("fail get galaxy",galaxyName); 
		    return;
		}
		if(callback)callback(galaxyName);
	    });
	})
    }
    Interface.addShip = function(ship,callback){
	this._getCollection("ships",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","ships");
		return;
	    }
	    col.insert(ship,{safe:true},callback);
	});
    }
    
    Interface.findShipByPilot = function(pilotName,callback){
	this._getCollection("ships",function(err,col){
	    if(err || !col){
		console.warn("fail to get collection ships");
		callback(null);
		return;
	    }
	    col.findOne({"pilot":pilotName}
			,function(err,obj){
			    if(err || !obj){
				callback(null);
				return;
			    }
			    callback(obj);
			    return;
			})
	})
    }
    
    Interface.getShipById = function(shipId,callback){
	this._getCollection("ships",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","ships");
		return;
	    }
	    console.log(shipId);
	    col.findOne({_id:new mongodb.ObjectID(shipId.toString())},function(err,obj){
		if(!err){
		    callback(obj);
		}
	    });
	})
    }
    Interface.setShip = function(ship,newShip,callback){
	this._getCollection("ships",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","ships");
		return;
	    }
	    var cur = col.update({_id:new mongodb.ObjectID(ship._id.toString())}
				 ,newShip
				 ,{safe:true}
				 ,callback);
	});
    }
    Interface.removeAllShips = function(callback){
	this._getCollection("ships",function(err,col){
	    if(!col){
		return;
	    }
	    col.remove(function(){
		if(callback)callback();
	    });
	})
    }
    Interface.getAllShips = function(callback){
	this._getCollection("ships",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","ships");
		return;
	    }
	    var cur = col.find();
	    cur.toArray(function(err,arr){
		if(!err && arr){
		    callback(arr);
		}
	    })
	})
    }
    Interface.getShips = function(ids,callback){
	this._getCollection("ships",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","ships");
		return;
	    }
	    var cur = col.find({_id:{
		$in:ids
	    }});
	    cur.toArray(function(err,arr){
		if(!err && arr){
		    callback(arr);
		}
	    })
	})
    }
    Interface.removeShip = function(shipId,callback){
	this._getCollection("ships",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","ships");
		return;
	    }
	    col.remove({_id:new mongodb.ObjectID(shipId)},{safe:true},callback);
	});
    }
    Interface.clearShipParent = function(ship,callback){
	if(!ship.at){
	    return;
	}
	var self = this;
	if(ship.at.namespace){
	    console.log("namespace",ship.at.namespace);
	    this._getCollection(ship.at.namespace,function(err,col){
		if(err || !col){
		    console.trace();
		    console.log("dberr at");
		}
		col.update({
		    _id:ship.at.oid
		} ,{
		    $pull:{
			ships:{
			    $id:new mongodb.ObjectID(ship._id.toString())
			}
		    }
		},{
		    safe:true
		}, function(){
		    if(callback)callback(ship);
		});


	    })
	}
    }
    Interface.changeShipToGalaxy = function(ship,galaxyName,callback){
	var self = this;
	self.clearShipParent(ship);
	self.addGalaxyShip(galaxyName,ship,callback);
    }
    Interface.changeShipToStation = function(ship,stationName,callback){
	this.clearShipParent(ship);
	this.addStationShip(stationName,ship,callback);
	
    }
    Interface.addStationShip = function(stationName,ship,callback){
	var self = this;
	this._getCollection("starStations",function(err,col){
	    if(!col){
		console.warn("fail to get starStations");
		return;
	    }
	    var task = new MapTask();
	    ship.at = new mongodb.DBRef("starStations",stationName);
	    col.update({_id:stationName}
		       ,{$push:{
			   ships:new mongodb.DBRef("ships",new mongodb.ObjectID(ship._id.toString()))
		       }},{safe:true}
		       ,task.newTask());
	    self.setShip(ship,ship,task.newTask());
	    task.on("finish",function(){
		if(callback)callback();
	    })
	});
    }
    //addGalaxyShip dont'check if ship.at is null
    Interface.addGalaxyShip = function(galaxyName,ship,callback){
	var self = this;
	this._getCollection("galaxies",function(err,col){
	    if(!col){
		console.warn("fail to get galaxies");
		return;
	    } 
	    var task = new MapTask();
	    ship.at = new mongodb.DBRef("galaxies",galaxyName);
	    col.update({_id:galaxyName}
		       ,{$push:{
			   ships:new mongodb.DBRef("ships",new mongodb.ObjectID(ship._id.toString()))
		       }},{safe:true}
		       ,task.newTask()); 
	    self.setShip(ship,ship,task.newTask());
	    task.on("finish",function(){
		if(callback)callback();
	    })
	});
    }
    Interface.getGalaxyShips = function(galaxyName,callback){
	var self = this;
	this.getGalaxy(galaxyName,function(galaxy){
	    var ids = [];
	    for(var i=0;i < galaxy.ships.length;i++){
		var shipRef = galaxy.ships[i];
		ids.push(shipRef.oid);
	    } 
	    self.getShips(ids,function(ships){
		console.log(ships);
		if(callback)callback(ships);
	    });
	}) 
    }
    Interface.addStarStation = function(starStation,callback){
	var self = this;
	this._getCollection("starStations",function(err,col){
	    if(err|| !col){
		console.warn("fail to get collection starStations");
		return;
	    }
	    starStation._id = starStation.name;
	    col.insert(starStation,{safe:true},callback); 
	})
    }
    Interface.removeAllStarStations = function(callback){
	var self = this;
	this._getCollection("starStations",function(err,col){
	    if(err|| !col){
		console.warn("fail to get collection starStations");
		return;
	    }
	    
	    col.remove(null,{safe:true},callback);
	})
    }
    Interface.getStarStation = function(name,callback){
	this._getCollection("starStations",function(err,col){
	    if(err|| !col){
		console.warn("fail to get collection starStations");
		return;
	    };
	    col.findOne({_id:name},function(err,obj){
		if(!err && obj){
		    callback(obj);
		}
	    })
	})
    }
    Interface.getStarStationFullInfo = function(name,callback){
	this._getCollection("starStations",function(err,col){
	    if(err|| !col){
		console.warn("fail to get collection starStations");
		return;
	    };
	    col.findOne({_id:name},function(err,obj){
		if(!err && obj){
		    var __list = [];
		    for(var i=0;i<obj.ships.length;i++){
			var item = obj.ships[i];
			item = item.oid;
			__list.push(item);
		    }
		    if(__list.length>0){
			Interface.getShips(__list,function(ships){
			    obj.ships = ships;
			    callback(obj);
			});
		    }
		    else{
			callback(obj);
		    }
		}
	    })
	})
    }
    //This don't remove the oldGalaxy reference to the starStation
    Interface.moveStarStationToGalaxy = function(starStationName,galaxyName){
	this._getCollection("starStations",function(err,col){
	    col.update({_id:starStationName},{
		$set:{
		    at:new mongodb.DBRef("galaxies",galaxyName)
		}
	    });
	})
	
	this._getCollection("galaxies",function(err,col){
	    col.update({_id:galaxyName},{
		$push:{
		    starStations:new mongodb.DBRef("starStations",starStationName)
		}
	    });
	})
    }
    Interface.getStarStations = function(ids,callback){
	this._getCollection("starStations",function(err,col){
	    if(err || !col){
		console.log("fail to open collection","starStations");
		return;
	    }
	    if(ids == null){
		var cur = col.find();
	    }else{
		var cur = col.find({_id:{
		    $in:ids
		}}); 
	    }
	    cur.toArray(function(err,arr){
		if(!err && arr){
		    callback(arr);
		}
	    })
	})
    }
    Interface.getGalaxyInfoWithEnvironment = function(galaxyName,callback){
	this.getGalaxy(galaxyName,function(galaxy){
	    var __list = [];
	    for(var i=0;i<galaxy.starStations.length;i++){
		var item = galaxy.starStations[i];
		item = item.oid;
		__list.push(item);
	    } 
	    delete galaxy.ships;
	    if(__list.length==0){
		galaxy.starStations = [];
		callback(galaxy);
		return;
	    }
	    Interface.getStarStations(__list,function(arr){
		galaxy.starStations = arr;
		callback(galaxy);
	    })
	})
    }
    
    exports.Interface = Interface;
})(exports)
