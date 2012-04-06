(function(exports){
    var mongodb = require("mongodb");
    var Class = require("../singleServer/util").Class;
    var settings = require("../singleServer/settings").settings;
    //interface is the only way that server interact with database
    //interface may be also buffered data if nessesary
    var Interface = Class.sub();
    Interface.prototype._init = function(){
	if(Interface.connector)return;
	this.dbName = "dayOfSagittarius";
	this.server = new mongodb.Server(settings.dbhost,settings.dbport,{});
	Interface.connector = new mongodb.Db(this.dbName
					,this.server,{});
    }
    Interface.prototype.addUser = function(username){
	var self = this;
	Interface.connector.open(function(err,db){
	    if(err||!db){
		console.log(err);
		console.warn("fail to add user");
		console.trace();
		return;
	    }
	    db.collection("users",function(err,col){
		if(err||!col){
		    console.log(err); 
		    console.warn("fail to add user");
		    console.trace();
		    return;
		}
		col.insert({_id:username}); 
		Interface.connector.close();
	    })
	})
    }
    Interface.prototype.setUserData = function(username,data,callback){
	Interface.connector.open(function(err,db){
	    if(err||!db){
		console.log(err);
		console.warn("db error");
		console.trace();
		return;
	    }
	    db.collection("users",function(err,col){
		if(err||!col){
		    console.log(err); 
		    console.warn("collection error");
		    console.trace();
		    return;
		}
		var cur = col.findOne({_id:username},function(err,obj){
		    if(!obj||err){
			console.log(err);
			console.warn("fail to setuserdata");
			console.trace();
			return;
		    }
		    for(var item in data){
			obj[item] = data[item];
		    }
		    col.update({_id:username
			       }
			       ,obj,{safe:true}
			       , callback); 
		    Interface.connector.close();
		});
	    });
	})
    }
    Interface.prototype.getUserData =function(username,callback){
	Interface.connector.open(function(err,db){
	    if(err||!db){
		console.log(err);
		console.warn("db error");
		console.trace();
		return;
	    }
	    db.collection("users",function(err,col){
		if(err||!col){
		    console.log(err); 
		    console.warn("collection error");
		    console.trace();
		    return;
		}
		var cur = col.findOne({_id:username},function(err,obj){
		    if(!obj||err){
			console.log(err);
			console.warn("fail to setuserdata");
			console.trace();
			return;
		    }
		    callback(obj); 
		    Interface.connector.close();
		});
	    });
	})
    }
    Interface.prototype.getGalaxyShip = function(galaxyName,callback){
	var connector = Interface.connector;
	connector.open(function(err,db){
	    if(err || !db){
		console.log("fail to open db");
		return;
	    }
	    db.collection("galaxy_"+galaxyName,function(err,col){
		if(err || !db){
		    console.log("fail to open collection",self.galaxy.name);
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
		    Interface.connector.close();
		});
	    })
	}); 
    }
    Interface.prototype.setGalaxyShip = function(galaxyName,ships){
	var connector = Interface.connector;
	connector.open(function(err,db){
	    if(err || !db){
		console.log("fail to open db");
		return;
	    }
	    db.collection("galaxy_"+galaxyName,function(err,col){
		if(err || !db){
		    console.log("fail to open collection",self.galaxy.name);
		    return;
		} 
		for(var i=0;i<ships.length;i++){
		    var ship = ships[i];
		    ship._id = new mongodb.ObjectID(ship.id);
		    col.update({_id:ship._id}
			       ,ship);
		}
		Interface.connector.close();
	    })
	}); 
    }
    exports.Interface = Interface;
})(exports)