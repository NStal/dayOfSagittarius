(function(exports){
    var gameResourceManager = {};
    gameResourceManager.init = function(rc){
	this.resources = rc;
    }
    gameResourceManager.get = function(id){
	for(var i=0,length=this.resources.length;i < length;i++){
	    var item = this.resources[i];
	    if(item.id == id)return item;
	}
	
	return null;
    } 
    exports.gameResourceManager = gameResourceManager;
})(exports)