var settings = require("./settings.js");
var mongodb = require("mongodb");
var mongoserver = new mongodb.Server(settings.databaseAddress,
				     settings.databasePort,
				     {});
var db_connector = new mongodb.Db(settings.databaseName, 
				  mongoserver,{}); 
exports.db = function(callback){
    if(this.dbInstance){
	callback(null,this.dbInstance);
	return;
    }
    var self = this;
    db_connector.open(function(err,db){
	if(!err && db){
	    self.dbInstance = db;
	}
	callback(err,db);
    });
};
exports.collection = function(name,callback){
    exports.db(function(error,db){
	if(error || !db){
	    callback(error,null);
	    return;
	}
	db.collection(name,callback);
    })
}