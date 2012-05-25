var Facility = EventEmitter.sub();
//Facility has many descriptors like Clone,Factory
//To decorate the Facility to meet the demand
Facility.prototype._init = function(info){
    Widget.call(this);
    this.box = new DockServiceBox(); 
    this.info = info;
    if(info.name)
	this.name = info.type;
    else
	this.name = info.type;
    var Descriptor = Facility.Enum[this.name];
    if(!Descriptor){
	console.error("no this kind of facility",this.name);
	return;
    }
    this.descriptor = new Descriptor(this);
}
Facility.prototype.show = function(){
    var self = this;
    this.box.show(function(){
	self.emit("show");
    });
}
Facility.prototype.hide = function(){
    var self = this;
    this.box.hide(function(){
	self.emit("hide");
    });
}
Facility.Enum = {
    Market:Market
    ,Factory:Factory
}
