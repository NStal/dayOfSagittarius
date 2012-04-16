var settings = require("./settings");
var url = require("url");
var getFile = require("./staticFileManager").get;
var handler = function(req,rsp){
    var htmlRoot = settings.root+settings.htmlRoot;
    var fileName = url.parse(req.url).pathname.replace("/html/","");
    getFile(htmlRoot,fileName,
	    function(error,data){
		if(error){
		    console.warn("invalid static html request"+fileName);
		    require("./404").handler(req,rsp);
		    return;
		}
		rsp.writeHeader(200,{"content-type":"text/html;charset=UTF-8"})
		rsp.end(data.toString());
	    });
}
exports.handler = handler;
