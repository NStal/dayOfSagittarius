(function(exports){
    var MapTask = require("../share/util").MapTask;
    var EventEmitter = require("../share/util").EventEmitter;
    var ResourceLoader = EventEmitter.sub();
    ResourceLoader.prototype._init = function(){
	this.isLoading = false;
	this.ready = false;
	this.resources = [];
	this.loadedResources = [];
    }
    ResourceLoader.prototype.add = function(resource){
	if(this.isLoading){
	    console.warn("loading already started,can't add resource anymore");
	    return false;
	}
	if(!(resource instanceof Array))
	    resource = [resource]
	for(var i=0,length=resource.length;i < length;i++){
	    var item = resource[i];
	    this.resources.push(item);
	} 
	this.ready = false;
    }
    ResourceLoader.rcEnums = {
	"image":Image
	,"audio":Audio
    }
    Audio.noOnLoad = true;
    ResourceLoader.prototype.start = function(){
	if(this.isLoading){
	    console.log("already loading");
	    console.trace();
	    return;
	}
	var self = this;
	var loadTask = new MapTask();
	loadTask.on("finish",function(){
	    self.emit("finish",self);
	    self.ready = true;
	    self.isLoading = false;
	})
	this.isLoading = true;
	for(var i=0,length=this.resources.length;i < length;i++){
	    var item = this.resources[i];
	    if(item.ready){
		console.log(item,"is ready");
		continue;
	    }
	    RC = ResourceLoader.rcEnums[item[1]];
	    if(!RC){
		console.warn("invalid resource type")
		continue;
	    }
	    var rc = new RC(item[2]); 
	    rc.src = item[2];
	    //rc.autoplay = true;
	    if(RC.noOnLoad){
		self.loadedResources.push(item);
		item.resource = rc;
		item.type = item[0];
		item.ready = true;
		continue;
	    }
	    loadTask.newTask();
	    (function(item,rc){
		rc.onload = function(){
		    self.loadedResources.push(item);
		    item.resource = rc;
		    item.type = item[0];
		    item.ready = true;
		    loadTask.complete();
		    self.emit("oneResourceComplete",item);
		}
	    })(item,rc) 
	}
    }
    ResourceLoader.prototype.get = function(rcName){
	if(!this.ready){
	    console.warn("request resource when it's not all ready");
	}
	for(var i=0,length=this.loadedResources.length;i < length;i++){
	    var item = this.loadedResources[i];
	    if(item[0]==rcName){
		if(!item.ready){
		    console.error("resource request not ready")
		    return null;
		}
		return item.resource;
	    }
	}
	console.warn("resource not found",rcName);
	return null;
    }
    exports.ResourceLoader = ResourceLoader;
})(exports)