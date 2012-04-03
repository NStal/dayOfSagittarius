http = require('http');
distributer = require('./distributer.js');
settings = require('./settings.js'); 
server = http.createServer(function(req,res){


    console.log("recieve request:"+req.url);
    

    //var req = apiRequest.request;
    //var res = apiRequest.response;
    console.log(req.method);
    
    for(var item in settings.header){
	res.setHeader(item,settings.header[item]);
    }
    try{
	
	distributer.distributer(req,res);
    }catch(e){
	console.warn(e.toString());
    }
});
server.listen(settings.port,settings.host,function(){
    console.log("server started at "+settings.host+":"+ settings.port );
});
