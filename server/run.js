var spawn = require('child_process').spawn;
var Nolava = spawn("node",["singleServer/server","Nolava"]);
var Evy = spawn("node",["singleServer/server","Evy"]);
process.on("exit",function(){
    console.log("~~~");
    Nolava.kill();
    Evy.kill();
})
Nolava.stdin.on("data",function(data){
    process.stdout.write(data);
})
Nolava.stderr.on("data",function(data){
    process.stdout.write(data);
})
Evy.stdin.on("data",function(data){
    process.stdout.write(data);
})
Evy.stderr.on("data",function(data){
    process.stdout.write(data);
})