var WebSocketServer = require("ws").Server;
var settings = require("./localshare/settings").settings;
var galaxies = require("./share/resource/galaxies").GALAXIES;
var name = process.argv[2];
//Server:
//1.Configure the world,give it some imformations
//2.Setup webSocketServer and distribute the comming client to the world


var galaxy = null;
for(var i=0;i < galaxies.length;i++){
    if(name ==galaxies[i].name){
	galaxy = galaxies[i];
    }
}
if(!galaxy){
    console.log("need to provide a galaxy name to start");
    process.kill();
}
var __config = {time:0//Date.now()
		,galaxy:galaxy
		,map:require("./share/resource/map/"+galaxy.name)[galaxy.name]
		,rate:settings.rate}
var world = new (require("./serverWorld").ServerWorld)(__config);
settings.port = galaxy.server.port;
settings.host = galaxy.server.host;
settings.localport = galaxy.server.localport;
world.init();
world.start();
//init server
var server = new WebSocketServer({
    host:settings.host
    ,port:settings.port
});
server.on("connection",function(ws){
    world.syncManager.addClient(ws);
});
var localServer = new WebSocketServer({
    host:settings.host
    ,port:settings.localport
})
localServer.on("connection",function(ws){
    console.log("recieve local connection");
    //INCOMPLETE
    ws.close();
})