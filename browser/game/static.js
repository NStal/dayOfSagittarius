//provide compitability with nodejs

//exports and require
//are used for fake nodejs module system 
//throught which we can share code between server and client
var exports = window;
var require = function(){
    return window;
}
var WebSocket = WebSocket ? WebSocket:MozWebSocket;
var Static = {};
//Below option effect the shared code's appearence;
Static.needDisplay = true;  //drawing and related are enable
Static.clientSide = true;  //command send available
Static.browser = true;    //sound and resource load available