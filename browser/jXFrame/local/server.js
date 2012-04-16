http = require('http');
distributer = require('./distributer.js');
settings = require('./settings.js');
server = http.createServer(function(req,res){
    try{
	for(var item in settings.header){
	    res.setHeader(item,settings.header[item]);
	}
	try{
	    
	    distributer.distributer(req,res);
	}catch(e){
	    console.warn(e.toString());
	}
    }catch(e){
	console.wran("error");
	console.trace();
	console.log(e);
    }
});
server.listen(settings.port,settings.host,function(){
    console.log("server started at "+settings.host+":"+ settings.port );
});
