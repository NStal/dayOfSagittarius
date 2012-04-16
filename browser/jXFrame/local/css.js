var settings = require("./settings");
var getFile = require("./staticFileManager").get;
var handler = function(req,rsp){
    var htmlRoot = settings.root+settings.cssRoot;
    var fileName = req.url.replace("/css/","");
    getFile(htmlRoot,fileName,
	    function(error,data){
		if(error){
		    console.log(error.toString());
		    console.warn("invalid static css request"+fileName);
		    require("./404").handler(req,rsp);
		    return;
		}
		rsp.writeHeader(200,{"content-type":"text/css;charset=UTF-8"})
		rsp.end(data.toString());
	    });
}
exports.handler = handler;