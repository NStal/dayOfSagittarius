/*class PopupBox
 *
 *usage a popupBox to show messages and etc
 *
 *
 *
 *since version: 0.5
 *
 */
function PopupBox(template){
    this.uniqueId = new Date().getTime();
    this.bgOpacity = 0.9;
    this.fadeInTime = 500;
    this.fadeOutTime = 500;
    this.zInde = 1024;
    var self = this;
    Widget.call(this,template);
    function BG(bgTemplate){
	Widget.call(this,bgTemplate);
    }
    $(window).resize(function(){
	if(!self.shown)return false;
	var css = self._boxCSS();
	var bgCSS = self._bgCSS();
	css.display = "block";
	bgCSS.display ="block"; 
	self.nodeJ.css(css);
	self.bg.nodeJ.css(bgCSS);
    })
    this.shown = false;
    this.bg = new BG("<div id='bgName' class='bgClass'></div>".replace("bgName",this.node.id+"BG"));
    this.popup = function(){
	this._add();
	this.nodeJ.fadeIn(this.fadeInTime);
	this.bg.nodeJ.fadeIn(this.fadeInTime);
	this.shown = true;
    } 
    this.popoff = function(){
	this.nodeJ.fadeOut(this.fadeOutTime);
	this.bg.nodeJ.fadeOut(this.fadeOutTime);
	this.shown = false;
    }
    this.inDOM = false;
    this.inDOMBd = false;
    var self = this;
    
    this._add = function(){
	if(!this.inDOM){
	    $("body").append(this.bg.node);
	    $("body").append(this.node);
	    this.inDOM = true;
	} 
	this.nodeJ.css(this._boxCSS()); 
	this.bg.nodeJ.css(this._bgCSS());
    } 
    this._boxCSS = function()
    {
	return {"overflow":"hidden",
		"z-index":this.zIndex,
		"position":"absolute",
		"top":document.body.scrollTop+($(window).height()-this.nodeJ.height())/2,
		"right":($(window).width()-this.nodeJ.width())/2,
		"display":"none"
		};
    }
    this._bgCSS = function(){
	return {"width":$(document).width(),
		"height":$(document).height(),
		"position":"absolute",
		"top":0,
		"left":0,
		"z-index":this.zIndex,
		"opacity":this.opacity,
		"display":"none"};
    }
    
}
/*class MessageBox
 *
 *just a globalMessageBox
 *
 *
 *
 *since version: 0.5
 *
 */
//instance
//var messageBox = new MessageBox();
//class