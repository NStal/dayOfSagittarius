(function(exports){
    function BoxItem(itemInfo){
	var template = Static.template.itemBox;
	Widget.call(this,template); 
	if(typeof itemInfo == "number"){
	    var id = itemInfo 
	}else{
	    var id = itemInfo.id;
	}
	this.boxDescriptionJ.text(Static.gameResourceManager.get(id).name);
    }
    function ItemDisplayer(){
	var template = Static.template.itemDisplayer;
	Widget.call(this,template);
	var self = this;
	Static.battleField.on("shipInitialized",function(ships){
	    for(var i=0,length=ships.length;i < length;i++){
		var item = ships[i];
		if(item.pilot==Static.username){
		    self.currentShip = item; 
		    return;
		} 
	    }
	    console.error("no ship for current user?");
	    return;
	})
    }
    ItemDisplayer.prototype.show = function(){
	if(!this.currentShip){
	    console.warn("no current ship set");
	    return;
	}
	this.containerJ.empty();
	console.log(this.currentShip.cagos);
	for(var i=0,length=this.currentShip.cagos.length;i < length;i++){
	    var item = this.currentShip.cagos[i];
	    this.containerJ.append(new BoxItem(item).node);
	}
	this.nodeJ.show();
	this.isShown = true;
    }
    ItemDisplayer.prototype.hide = function(){
	this.nodeJ.hide();
	this.isShown =false;
    }
    ItemDisplayer.prototype.toggle = function(){
	if(this.isShown)this.hide();
	else this.show();
    }
    exports.ItemDisplayer = ItemDisplayer;
})(exports)