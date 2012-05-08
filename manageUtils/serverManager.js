var ServerManager = require("./share/util").Container.sub();
var EventEmitter =require("./share/util").EventEmitter;
var child_process = require("child_process");
EventEmitter.mixin(ServerManager);
ServerManager.prototype._init = function(serverRoot){
    this.serverRoot = serverRoot;
    //when change the watch target,should I print the new target's past output?
    this.printHistory = false;
}
ServerManager.prototype.add = function(galaxyName){
    if(this.find(galaxyName)){
	console.warn("galaxyName already exist");
	return false;
    }
    var cp = child_process.spawn("node",[this.serverRoot+"/"+"server",galaxyName]);
    console.log("create process",cp.pid,galaxyName);
    cp.output = ""
    var self = this;
    cp.stdout.on("data",function(data){
	data = data.toString();
	cp.output+=data;
	if(!self.noMultiOutput){
	    console.log(galaxyName,":",data);
	    return;
	}
	if(typeof cp.exportOutput == "function"){
	    cp.exportOutput(data);
	}
    })
    cp.stderr.on("data",function(data){
	data = data.toString();
	cp.output+=data; 
	if(!self.noMultiOutput){
	    console.log(galaxyName,":",data);
	    return;
	}
	if(typeof cp.exportOutput == "function"){
	    cp.exportOutput(data);
	}
    })
    this.parts.push({
	galaxyName:galaxyName
	,process:cp
    });
    return true;
}
ServerManager.prototype.watch = function(galaxyName){
    var self = this;
    var tempArr = this.parts;
    for(var i=0,length=tempArr.length;i < length;i++){
	var item = tempArr[i];
	if(item.galaxyName == galaxyName){
	    if(this.printHistory){
		console.log(item.process.output);
	    }
	    if(this.currentWatch){
		this.currentWatch.process.exportOutput = null; 
	    }
	    this.currentWatch = item;
	    this.currentWatch.process.exportOutput = function(data){
		console.log(self.currentWatch.galaxyName,":",data.toString());
	    }
	    return true;
	}
    }
    console.log("galaxies are:")
    var tempArr = this.parts;
    for(var i=0,length=tempArr.length;i < length;i++){
	var item = tempArr[i];
	console.log(item.galaxyName);
    }
    console.warn(galaxyName,"Not found");
    return false;
}
ServerManager.prototype.kill = function(galaxyName){
    var server = this.find(galaxyName);
    if(!server){
	console.warn("invalid galaxyName",galaxyName);
	return;
    }
    server.process.kill();
    this.remove(server);
    console.log("process killed",server.process.pid,galaxyName);
}
ServerManager.prototype.find = function(galaxyName){
    var tempArr = this.parts;
    for(var i=0,length=tempArr.length;i < length;i++){
	var item = tempArr[i];
	if(item.galaxyName == galaxyName)return item;
    }
    return null;
}
exports.ServerManager = ServerManager;