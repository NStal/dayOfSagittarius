var DockFacility = EventEmitter.sub();
//DockFacility has many descriptors like Clone,Factory
//To decorate the DockFacility to meet the demand
DockFacility.prototype._init = function(info){
    Widget.call(this);
    this.box = new DockServiceBox(); 
    this.info = info;
    if(info.name)
	this.name = info.type;
    else
	this.name = info.type;
    var Descriptor = DockFacility.Enum[this.name];
    if(!Descriptor){
	console.error("no this kind of facility",this.name);
	return;
    }
    this.descriptor = new Descriptor(this);
}
DockFacility.prototype.show = function(){
    var self = this;
    this.box.show(function(){
	self.emit("show");
    });
}
DockFacility.prototype.hide = function(){
    var self = this;
    this.box.hide(function(){
	self.emit("hide");
    });
}
DockFacility.Enum = {
    Market:Market
    ,Factory:Factory
}
