(function(exports){
    exports.Main = Class.sub();
    Main.prototype._init = function(){
    }
    Main.prototype.init = function(){
	game = new Game().start(); 
    }
})(exports);