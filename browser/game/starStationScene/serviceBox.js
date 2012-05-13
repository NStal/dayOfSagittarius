var DockServiceBox = Class.sub();
DockServiceBox.prototype._init = function (){
    Widget.call(this,Static.template.serviceBox);
    this.dock = Static.starStationScene;
    this.activeServiceFlagJ.hide();
    this.serviceNum = 0;
    this.shrinked=false;
    this.isShown = false;
    this.nodeJ.hide();
    this.services = [];
    var self = this;
}
DockServiceBox.prototype.show = function (callback){
    if(this.isShown) return;
    this.isShown = true;
    this.nodeJ.show(90,callback);
}
DockServiceBox.prototype.hide = function (callback){
    if(!this.isShown)return;
    var self = this;
    this.nodeJ.hide(90,callback);
    this.isShown = false;
}
DockServiceBox.prototype.add = function(service){
    var button = new Widget(Static.template.serviceButton);
    button.nodeJ.text(service.name);
    service.button = button; 
    var self = this;
    button.nodeJ.click = function(){
	if(self.currentService==service)return;
	if(self.currentService)self.currentService.hide();
	service.show();
	self.currentService = service;
    }
    this.services.push(service);
    this.serviceListJ.append(button.nodeJ);
    this.contentJ.append(service.nodeJ);
}