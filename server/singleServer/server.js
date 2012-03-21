var WebSocketServer = require("ws").Server;
var settings = require("./settings").settings;

var world = new (require("./world").World)({time:0});
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