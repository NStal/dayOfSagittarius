var path = require('path');
var fileSystem = require('fs');
var handler=function(req,rsp){
    var imageRoot = settings.root+settings.imageRoot;
    var invalidChar = /[~\\'"]/;
    var invalidPair = /\.\.\//;
    var fileName = req;
    console.log(fileName); 
    fileSystem.readFile(path.join(imageRoot,fileName),
			function(error,data){
			    if(error){
				console.warn("no this js file:"+path.join(imageRoot,fileName)); 
				rsp.writeHeader(404,{"content-type":"text/html"});
				rsp.end("404");
			    }
			    rsp.writeHeader(200,{"content-type":"image/png"});
			    rsp.end(data);
			});
}
exports.handler = handler;