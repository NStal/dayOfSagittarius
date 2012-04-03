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
    jsonResponse.call(this);
    if(!errorDescription)errorDescription="unknow error";
    this.content.errorDescription = errorDescription;
    if(!errorCode)errorCode=0;
    this.content.errorCode = errorCode;
    
    this.content.result =false;
}
jsonResponseError.prototype = new jsonResponse;
exports.jsonResponse = jsonResponse;
exports.jsonResponseError = jsonResponseError;
