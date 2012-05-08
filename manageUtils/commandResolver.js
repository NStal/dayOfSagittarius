CommandResolver = require("./share/util").Container.sub();
require("./share/util").EventEmitter.mixin(CommandResolver);
CommandResolver.prototype._init = function(){};
CommandResolver.prototype.resolve = function(cmd){
    cmd =  cmd.split(/\s/);
    if(cmd.length<0)return false;
    name = cmd.shift();
    var tempArr = this.parts;
    for(var i=0,length=tempArr.length;i < length;i++){
	var item = tempArr[i];
	if(item.name == name){
	    item.handler(cmd);
	    return true;
	}
    }
    console.log("command not found",cmd);
    console.log("command allowed are:");
    var tempArr = this.parts;
    for(var i=0,length=tempArr.length;i < length;i++){
	var item = tempArr[i];
	console.log(item.name);
    }
    return false;
}
CommandResolver.prototype.add = function(name,handler){
    CommandResolver.parent.prototype.add.call(this,{
	name:name
	,handler:handler
    })
}

exports.CommandResolver = CommandResolver;