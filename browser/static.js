//provide compitability with nodejs
var exports = window;
var require = function(){
    return window;
}
var WebSocket = WebSocket ? WebSocket:MozWebSocket
//var Static = {};