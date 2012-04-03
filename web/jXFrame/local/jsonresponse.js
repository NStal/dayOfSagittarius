var jsonResponse = function(data){
    this.content = {
	result:true,
	data:data
    };
}
jsonResponse.prototype.toString = function(){
    return JSON.stringify(this.content);
}
var jsonResponseError = function(errorDescription,errorCode){
    jsonResponse.call(this,undefined);
    this.content.errorDescription = errorDescription;
    this.content.errorCode = errorCode;
    this.content.result =false;
}
jsonResponseError.prototype = new jsonResponse;
var error = function(errorDescription,errorCode){
    this.errorDescription = errorDescription?errorDescription:"unknow error";
    this.errorCode = errorCode?errorCode:0;
}
error.prototype.toResponse = function(){
    return new jsonResponseError(this.errorDescription,this.errorCode);
}
error.prototype.toString = function(){
    return this.toResponse().toString();
}
var Errors  = {
    invalidParameter:new error("invalid parameter recieved",1),
    permissionDenied:new error("premissionDenied",2),
    notExist:new error("not exist",3),
    invalidAction:new error("invalid action",4),
    alreadyExist:new error("already exist",5),
    timeExpired:new error("timeExpired",6),
    apiNotExist:new error("api you required is not exist",7)
};
exports.jsonResponse = jsonResponse;
exports.jsonResponseError = jsonResponseError;
exports.error = error;
exports.Errors = Errors;