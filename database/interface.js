(function(exports){
    var mongodb = require("mongodb");
    var settings = require("./localshare/settings").settings;
    //interface is the only way that server interact with database
    //interface may be also buffered data if nessesary
    //interface should promise work to be done,even buffered for delay
    Interface = function(){
	console.warn("Interface is a static Class,don't call it ");
	console.trace();
    };
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
		console.error("fail to get collection");
		console.trace();
		return;
	    }
	    if(err||!col){
		console.log(err);
		console.error("fail to add user");
		console.trace();
		return;
	    }
	    col.insert({_id:username});
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
		col.update({_id:username}
			   ,obj,{safe:true}
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
    Interface.getGalaxyShip = function(galaxyName,callback){
	this._getCollection("galaxy_"+galaxyName,function(err,col){
	    if(err || !col){
		console.log("fail to open collection",galaxyName);
		return;
	    }
	    var cur = col.find();
	    cur.toArray(function(err,arr){
		if(err||!arr){
		    console.log(err);
		    console.trace();
		    return;
		}
		for(var i=0;i<arr.length;i++){
		    arr[i].id = arr[i]._id.toString();
		}
		callback(arr); 
	    });
	}); 
    }
    Interface.setGalaxyShip = function(galaxyName,ships){
	this._getCollection("galaxy_"+galaxyName,function(err,col){
	    if(err || !col){
		console.log("fail to open collection",galaxyName);
		return;
	    } 
	    for(var i=0;i<ships.length;i++){
		var ship = ships[i];
		ship._id = new mongodb.ObjectID(ship.id);
		col.update({_id:ship._id}
			   ,ship);
	    }
	    Interface.connector.close();
	}); 
    }
    exports.Interface = Interface;
})(exports)