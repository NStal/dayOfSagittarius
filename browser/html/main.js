(function(exports){
    exports.Main = Class.sub();
    Main.prototype._init = function(){
    }
    Main.prototype.init = function(){
	//game = new Game().start(); 
	this.site = new Site();
	var hash = window.location.hash;
	if(hash=="#debug"){
	    this.site.loginUsernameInputJ.val("nstal");
	    this.site.onClickLoginButton();
	}
    }
})(exports);
