var settings = require("./settings.js");
var mongodb = require("mongodb");
var mongoserver = new mongodb.Server(settings.databaseAddress,
				     settings.databasePort,
				     {});
exports.db = function(callback){
    var db_connector = new mongodb.Db(settings.databaseName, 
				      mongoserver,{});
    db_connector.open(callback);
};
exports.collection = function(name,callback){
    exports.db(function(error,db){
	if(error){
	    callback(error,null);
	    return;
	}
	db.collection(name,callback);
    })
}