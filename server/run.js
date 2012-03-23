var spawn = require('child_process').spawn;

var Nolava = spawn("node",["singleServer/server","Nolava"]);
var Evy = spawn("node",["singleServer/server","Evy"]);
process.on("exit",function(){
    Nolava.kill();
    Evy.kill();
})
/*setInterval(function(){
    console.log("running");
},1000);*/