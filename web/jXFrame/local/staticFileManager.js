var fs = require('fs');
var get = function(root,path,callback){
    var invalidString = ["..","~"];
    for(var i=0;i<invalidString.length;i++){
	if(-1!=path.indexOf(invalidString[i])){
	    //.. and ~ are not allowed;
	    //throw require('./error').Errors.invalidParameter;
	    callback(require('./error').Errors.invalidParameter,null);
	}
    }
    callback.path = path;
    fs.readFile(require('path').join(root,path),callback);
}
//WARNING getFilesWillThrowErrors;
var getFiles = function(root,pathes,callback){
    var length = pathes.length;
    var result = {};
    result.toString = function(encode){
	for(var item in this){
	    if(typeof this[item]!="function")
		this[item] = this[item].toString(encode);
	}
	return JSON.stringify(this);
    }
    var errors = null;
    var suffix = pathes.suffix?pathes.suffix:"";
    if(length==0){
	callback(null,{});
    } 
    function _get(path){
	var i = path;
	get(root,path,function(err,data){
	    if(err||!data){
		if(!errors)errors = [];
		errors.push(err);
		length-=1;
		if(length==0){
		    callback(null,result);
		}
		return;
	    }
	    length-=1;
	    console.log(err);
	    result[path.replace(pathes.suffix,"")] = data.toString();
	    if(length==0){
		callback(null,result);
	    }
	});
    }
    for(var i=0;i<pathes.length;i++){
	_get(pathes[i]+suffix);
    }
}
exports.get = get;
exports.getFiles = getFiles;