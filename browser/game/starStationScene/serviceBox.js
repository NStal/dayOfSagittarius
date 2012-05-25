var ServiceBox = Class.sub();
ServiceBox.prototype._init = function (){
    Widget.call(this,Static.template.serviceBox);
    this.dock = Static.starStationScene;
    this.serviceNum = 0;
    this.isShown = false;
    this.nodeJ.hide();
    this.services = [];
    var self = this;
}
ServiceBox.prototype.show = function (callback){
    if(this.isShown) return;
    this.isShown = true;
    //calculate the correct height
    var width = $(document).width() - this.dock.guidBox.nodeJ.width()-140;
    var height = $(document).height() - 200;
    this.nodeJ.css({width:width
		    ,height:height})
    this.nodeJ.show(90,callback);
}
ServiceBox.prototype.hide = function (callback){
    if(!this.isShown)return;
    var self = this;
    this.nodeJ.hide(90,callback);
    this.isShown = false;
}
ServiceBox.prototype.add = function(service){
    this.services.push(service);
    var header = $("<li class='clickable'>").text(service.name)
    var self = this;
    console.trace();
    header.click(function(){
	self.currentServiceJ.text(service.name); 
	self.contentJ.empty();
	self.contentJ.append(service.nodeJ);
    }) 
    header.click();
    this.serviceTitleJ.append(header);
}