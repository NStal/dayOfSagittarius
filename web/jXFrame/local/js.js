var path = require('path');
var fileSystem = require('fs');
var jsHandler=function(req,rsp){
    var jsRoot = settings.root+settings.remoteJsRoot;
    var invalidChar = /[~\\'"]/;
    var invalidPair = /\.\.\//;
    if(invalidChar.test(req.url) || invalidPair.test(req.url)){
	console.warn("warning:recieve invalid apiPathCall,maybe some error or attacks");
	console.log(req.url);
	rsp.end();
	return false;
    }
    var fileName = req.url.replace("/js/","");
    console.log(fileName); 
    fileSystem.readFile(path.join(jsRoot,fileName),
			function(error,data){
			    if(error){
				console.warn("no this js file:"+path.join(jsRoot,fileName)); 
				rsp.writeHeader(404,{"content-type":"text/javascript;charset=UTF-8"});
				rsp.end("");
			    }
			    rsp.writeHeader(200,{"content-type":"text/javascript;charset=UTF-8"});
			    rsp.end(data.toString());
			});
}
var jsGroupHandler=function(req,rsp){}
exports.jsHandler = jsHandler;
exports.jsGroupHandler = jsGroupHandler;
