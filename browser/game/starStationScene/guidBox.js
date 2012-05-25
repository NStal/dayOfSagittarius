(function(exports){
    var GuidBox =  Class.sub();
    GuidBox.prototype._init = function(){
	Widget.call(this,Static.template.guidBox);
	var self = this;
	this.placeButtons = [];
    }
    GuidBox.prototype.add = function(facility){
	var button = new Widget(Static.template.guidBoxButton);
	button.nameJ.text(facility.name);
	button.facility = facility;
	button.nodeJ.click(function(){
	    Static.starStationScene.goTo(button.facility.name);
	})
	//assume facility.name is a unique indentifier for facility
	this.placeButtons.push(button);
	this.placesBoxJ.append(button.nodeJ)
    }
    GuidBox.prototype.remove = function(facility){
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
    exports.GuidBox = GuidBox;
})(exports)