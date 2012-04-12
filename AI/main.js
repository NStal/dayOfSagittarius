var WebSocketServer = require("ws").Server;
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
var World = require("./virtualWorld").VirtualWorld;
var __config = {
    galaxy:galaxy
    ,map:require("./share/resource/map/"+galaxy.name)[galaxy.name]
    ,rate:30
    ,name:"AI"
}
new World(__config).start();