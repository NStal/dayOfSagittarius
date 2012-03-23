var WebSocketServer = require("ws").Server;
var settings = require("./settings").settings;

var galaxies = require("./resource/galaxies").GALAXIES;
var name = process.argv[2];
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
var world = new (require("./world").World)({time:0
					    ,galaxy:galaxy
					    ,map:require("./resource/map/"+galaxy.name)[galaxy.name]});
settings.port = galaxy.server.port;
settings.host = galaxy.server.host;
world.init();
world.start();
//init server
var syncManager = new (require("./syncManager").SyncManager)(world);
var server = new WebSocketServer({
    host:settings.host
    ,port:settings.port
});
server.on("connection",function(ws){
    world.syncManager.addClient(ws);
});