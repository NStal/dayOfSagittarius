(function(exports){
    var DockInteractionBox =  Class.sub();
    DockInteractionBox.prototype._init = function(){
	Widget.call(this,Static.template.interactionBox);
	var self = this; 
	this.isShown = true;
	
    }
    
    DockInteractionBox.prototype.hide = function(callback){
	if(!this.isShown)return false;
	this.isShown = false;
	var self = this;
	if(Static.starStationScene.nowFacility 
	   && Static.starStationScene.nowFacility.nowRole){
	    this.rolePicBoxJ.fadeOut("fast");
	    this.diologBoxJ.slideUp("fast",function(){
		self.nodeJ.animate({width:0},200,function (){
		    self.nodeJ.hide(300,callback);
		})
	    })
	}else{
	    this.nodeJ.animate({width:0},200,function (){
		self.nodeJ.hide(300,callback);
	    })
	}
    }
    DockInteractionBox.prototype.show = function(callback){
	if(this.isShown)return false;
	this.isShown = true;
	var self = this;
	if(Static.starStationScene.nowFacility 
	   && Static.starStationScene.nowFacility.nowRole){
	    this.nodeJ.animate({width:this.defaultWidth},200,function (){
		self.rolePicBoxJ.fadeIn("fast");
		self.diologBoxJ.slideDown("fast",callback);
	    })
	}else{
	    
	    //alert("!!");
	    this.nodeJ.show();
	    this.nodeJ.animate({width:this.defaultWidth},150,callback);
	}
    }
    //exports.DockPreviewBox = PreviewBox;
    exports.DockInteractionBox = DockInteractionBox;
})(exports)