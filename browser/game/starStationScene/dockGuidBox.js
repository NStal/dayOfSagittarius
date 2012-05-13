(function(exports){
    var DockGuidBox =  Class.sub();
    var PreviewBox = Class.sub();
    PreviewBox.prototype._init = function(node){
	Widget.call(this,node);
	//this.defaultWindow = this.nodeJ.width();
	this.isShown = false;
    }
    PreviewBox.prototype.hide = function(){
	var self = this;
	this.nodeJ.hide(90); 
	this.isShown = false;
    }
    PreviewBox.prototype.show = function(top){
	if(this.isShown){
	    this.nodeJ.animate({top:top},130); 
	    return;
	}
	if(!this.defaultWidth){
	    this.nodeJ.show();
	    this.defaultWidth = this.nodeJ.width();
	    this.nodeJ.hide();
	}
	this.nodeJ.css("top",top);
	this.nodeJ.width(0);
	this.nodeJ.show();
	this.nodeJ.animate({width:this.defaultWidth},90);
	this.isShown = true;
    }
    var PlaceInfoBox = Class.sub();
    PlaceInfoBox.prototype._init = function(node){
	Widget.call(this,node)
    }
    PlaceInfoBox.prototype.changeInfo = function(info){
	this.titleJ.text(info.name);
	this.messageJ.text(info.message);
    }
    DockGuidBox.prototype._init = function(){
	Widget.call(this,Static.template.guidBox);
	var self = this;
	this.previewBox = new PreviewBox(this.previewBoxNode);
	this.placeInfoBox = new PlaceInfoBox(this.placeInfoBoxNode);
	this.placesBoxJ.mouseleave(function(){
	    self.previewBox.hide();
	})
	this.placeButtons = [];
    }
    DockGuidBox.prototype.add = function(facility){
	var button = new Widget(Static.template.guidBoxButton);
	button.nodeJ.text(facility.name);
	button.facility = facility;
	button.nodeJ.click(function(){
	    Static.starStationScene.goTo(button.facility.name);
	})
	//assume facility.name is a unique indentifier for facility
	button.nodeJ.attr("id","button_"+facility.name);
	this.placeButtons.push(button);
	this.placesBoxJ.append(button.nodeJ)
    }
    DockGuidBox.prototype.remove = function(facility){
	var tempArr = this.placeButtons;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(item.facility == facility){
		tempArr.splace(i,1);
		item.nodeJ.remove();
		return true;
	    }
	}
	return false;
    }
    //exports.DockPreviewBox = PreviewBox;
    exports.DockGuidBox = DockGuidBox;
})(exports)