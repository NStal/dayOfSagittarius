(function(exports){
    DockPage = Class.sub();
    DockPage.prototype._init = function(template){
	if(!template)return;
	Widget.call(this,template);
    }
})(exports)