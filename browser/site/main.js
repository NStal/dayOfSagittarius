(function(exports){
    exports.Main = Class.sub();
    Main.prototype._init = function(){
    }
    Main.prototype.init = function(){
	//game = new Game().start();
	Static.HttpAPI.template(function(rsp){
	    if(!rsp.result){
		alert("fatal error, fail to load html template");
	    }
	    Static.template = rsp.data;
	    
	    Static.site = new Site();
	    var hash = window.location.hash;
	    if(hash=="#debug"){
		Static.site.loginUsernameInputJ.val("nstal");
		Static.site.onClickLoginButton();
	    }
	})
    }
})(exports);
