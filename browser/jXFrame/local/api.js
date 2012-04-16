var url = require('url');
var jr = require('./jsonResponse');
var unknownError = require("./error").Errors.unknownError;
var apiNotExist = require("./error").Errors.apiNotExist;
var invalidParameter = require("./error").Errors.invalidParameter;
var permissionDenied = require("./error").Errors.permissionDenied;
var querystring = require('querystring');
var settings = require('./settings');
exports.distributer = function(apiRequest){
    
    var invalidChar = /[.~\\'"]/ig;
    if(invalidChar.test(apiRequest.apiPath)){
	console.warn("warning:recieve invalid apiPathCall,maybe some error or attacks");
	apiRequest.response.end(apiNotExist.toResponse().toString());
	return false;
    }
    console.log("api-call:",apiRequest.url);
    try{
	var api =require(settings.root+settings.apiRoot+apiRequest.apiPath+settings.apiSuffix);
    }
    catch(e){
	console.log(e);
	console.warn("Invalid api request recived,may be something nesty");
	apiRequest.response.end(apiNotExist.toResponse().toString());
	return false;
    }
    if(typeof api.handler!="function"){
	apiRequest.response.end(permissionDenied.toResponse().toString());
	return false;
    }
    apiRequest.statusCode = 200;
    apiRequest.response.setHeader("content-type","text/html");
    
    try{
	if(typeof api.auth == "function"){
	    formidable = require('formidable');
		util = require('util');
		
	    (function(){
		api.auth.call(apiRequest,function(data){
		    if(!data){
			//auth failed!
		    }
		    apiRequest.authData = data;
		    if(!apiRequest.authData){
			apiRequest.response.end(permissionDenied.toResponse().toString());
			return false;
		    }
		    else{
			api.handler.call(apiRequest); 
		    }
		});
		return true;
	    })();
	}
	else{
	    api.handler.call(apiRequest);
	}
    }catch(e){
	console.log("error at apirequest");
	console.warn(e);
	return false;
    }
    return true;
}
exports.apiReg = /^\/api\//i;
var apiRequest = function(req,rsp){
    this.url = req.url;
    this.request = req;
    this.response = rsp;
    this._cookieToDelete = [];
    this.cookies = querystring.parse(req.headers["cookie"],"; ");
    console.log(this.cookies);
    var uri = url.parse(this.url,true);
    this.apiPath = uri.pathname.replace("/api/","");
    this.query = uri.query;
    //buffer the sending cookie
    this._cookieToAdd = [];
}
apiRequest.CRITICAL = null;
apiRequest.prototype.CRITICAL = null;
apiRequest.prototype.solve = function(handler){
    var query = {};
    for(var item in this.parameters){
	query[item] = this.get(item,this.parameters[item]);
	if(query[item]===this.CRITICAL){
	    this.response.end(invalidParameter.toResponse().toString());
	    return;
	}
    }
    handler.call(this,query);
}
apiRequest.prototype.has = function(key){
    if(this.query[key]){
	return true;
    }
    return false;
}
apiRequest.prototype.end = function(data){
    this.response.end(new jr.jsonResponse(data).toString());
}
apiRequest.prototype.error  = function(err){
    if(!err){
	this.response.end(unknownError.toResponse().toString());
	return;
    }
    this.response.end(err.toResponse().toString());
}
apiRequest.prototype.get = function(key,defaultValue){
    if(typeof defaultValue == "function"){
	return defaultValue(this.query[key]);
    }
    if(this.has(key)){
	return this.query[key];
    }
    else{
	return defaultValue;
    }
} 
apiRequest.prototype.getCookie = function(key,defaultValue){
    if(typeof defaultValue == "function"){
	return defaultValue(this.cookies[key]);
    }
    if(this.cookies[key]){
	return this.cookies[key];
    }
    else{
	return defaultValue;
    }
}
apiRequest.prototype.removeCookie = function(key){
    //set cookie expired; 
    this._cookieToDelete.push(key);
    var expireArray = [];
    var expireDate = new Date(1970,1);
    for(var i=0;i<this._cookieToDelete.length;i++){
	expireArray.push(this._cookieToDelete[i]
			 +"=; "+"expires="+expireDate.toUTCString());
    }
    console.log(expireArray);
    this.response.setHeader("Set-Cookie",expireArray);
}
apiRequest.prototype.setCookie = function(key,value,expire){
    if(!expire){
	expire = "";
    }
    else{
	expire = "; "+"Expires="+expire.toUTCString();
    }
    this._cookieToAdd.push([key,value].join("=")+expire
			  );
    this.response.setHeader("Set-Cookie",
			    this._cookieToAdd
			   );
    return true;
}
exports.apiRequest = apiRequest;