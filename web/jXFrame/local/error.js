var jsonResponseError = require("./jsonResponse").jsonResponseError;
var error = function(errorDescription,errorCode){
    this.errorDescription = errorDescription?errorDescription:"unknow error";
    this.errorCode = errorCode?errorCode:0;
}
error.prototype.toResponse = function(){
    return new jsonResponseError(this.errorDescription,this.errorCode);
}
error.prototype.toString = function(){
    return JSON.stringify({
	"errorCode":this.errorCode,
	"errorDescription":this.errorDiscription
    });
}
error.prototype.equals = function(err){
    if(this.errorCode == err.errorCode && 
       this.errorDiscription == err.errorDiscription){
	return true;
    }
    return false;
}
error.prototype.isError = true;
var Errors  = {
    unknownError:new error("unknown error",0),
    invalidParameter:new error("invalid parameter recieved",1),
    permissionDenied:new error("premissionDenied",2),
    notExist:new error("not exist",3),
    invalidAction:new error("invalid action",4),
    alreadyExist:new error("already exist",5),
    timeExpired:new error("timeExpired",6),
    apiNotExist:new error("api you required is not exist",7),
    authorizationFailed:new error("authorizationFailed",8)
};
exports.error = error;
exports.Errors = Errors;









