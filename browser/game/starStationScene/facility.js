var Facility = EventEmitter.sub();
//Facility has many descriptors like Clone,Factory
//To decorate the Facility to meet the demand
Facility.prototype._init = function(info){
    Widget.call(this);
    this.box = new ServiceBox(); 
    this.name = info.name;
    var tempArr = info.services;
    for(var i=0,length=tempArr.length;i < length;i++){
	var item = tempArr[i];
	if(typeof Services[item] != "function"){
	    console.error("no this kind of service",item)
	    console.trace();
	    return;
	}
	this.box.add(new (Services[item])(this));
    }
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
