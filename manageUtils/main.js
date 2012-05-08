var ServerManager = require("./serverManager").ServerManager;
var CommandResolver =require("./commandResolver").CommandResolver;
var readline =require("readline");
var face = readline.createInterface(process.stdin,process.stdout,null);
var commandResolver = new CommandResolver();
var serverManager = new ServerManager("../server");
var config = require("./config");
var tempArr = config.galaxies;
for(var i=0,length=tempArr.length;i < length;i++){
    var item = tempArr[i];
    var result = serverManager.add(item);
    if(result){
	console.log("start galaxy server",item);
    }else{
	console.error("fail to start galaxy server",item);
	console.error("exit");
	process.kill();
    }
}
commandResolver.add("watch",function(args){
    if(args.length<0){
	console.error("need to provide a galaxyName to watch");
	return false;
    }
    return serverManager.watch(args[0]); 
})
commandResolver.add("kill",function(args){
    if(args.length<0){
	console.error("need to provide a galaxyName to kill");
	return false;
    }
    return serverManager.kill(args[0]);
})
commandResolver.add("start-server",function(args){
    if(args.length<0){
	console.error("need to provide a galaxyName to kill");
	return false;
    }
    return serverManager.add(args[0]); 
})
commandResolver.add("list",function(args){
    var tempArr = serverManager.parts;
    console.log("current running server");
    for(var i=0,length=tempArr.length;i < length;i++){
	var item = tempArr[i];
	console.log(item.galaxyName);
    }
})
function hello(){
    face.question("Util is ready, what's your command sir?\n",function(anwser){
	commandResolver.resolve(anwser);
	hello();
    })
}
hello();
commandResolver.resolve("watch Nolava");