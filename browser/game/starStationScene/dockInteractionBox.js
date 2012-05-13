(function(exports){
    var DockInteractionBox =  Class.sub();
    DockInteractionBox.prototype._init = function(){
	Widget.call(this,Static.template.interactionBox);
	var self = this; 
	this.isShown = true;
	this.rolePicBoxJ.hide();
	this.diologBoxJ.hide(); 
	this.rolePicBox.changePic = function(src){
	    self.rolePicBoxJ.attr("src",src);
	}
	this.defaultWidth = 900;
    }
    DockInteractionBox.prototype.showOnTop = function(){
	this.diologBoxJ.css({zIndex:20}); 
    }
    DockInteractionBox.prototype.hideToBottom = function(){
	this.diologBoxJ.css({zIndex:5});
    }
    DockInteractionBox.prototype.reset = function(){
	this.roleListJ.empty();
    }
    DockInteractionBox.prototype.roleHide = function(callback){
	var self = this;
	this.diologBoxJ.slideUp("fast",function (){
	    self.rolePicBoxJ.animate({right:-self.rolePicBoxJ.width()*2},"fast",callback);			
	});
    }
    DockInteractionBox.prototype.roleShow = function(callback){
	var self = this;
	this.rolePicBoxJ.show();
	this.rolePicBoxJ.animate({right:0},"fast",function (){
 	    self.diologBoxJ.slideDown("fast",callback);			
	});
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