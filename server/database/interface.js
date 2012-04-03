(function(exports){
    var mongodb = require("mongodb");
    var Class = require("../singleServer/util").Class;
    var settings = require("../singleServer/settings").settings;
    //interface is the only way that server interact with database
    //interface may be also buffered data if nessesary
    var Interface = Class.sub();
    Interface.prototype._init = function(){
	this.dbName = "dayOfSagittarius";
	this.server = new mongodb.Server(settings.dbhost,settings.dbport,{});
	this.connector = new mongodb.Db(this.dbName
					,this.server,{});
    }
    Interface.prototype.addUser = function(username){
	var self = this;
	this.connector.open(function(err,db){
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
	    })
	})
    }
    Interface.prototype.setUserData = function(username,data,callback){
	this.connector.open(function(err,db){
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
		});
	    });
	})
    }
    Interface.prototype.getUserData =function(username,callback){
	this.connector.open(function(err,db){
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
		});
	    });
	})
    }
    exports.Interface = Interface;
})(exports)