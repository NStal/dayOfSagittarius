(function(exports){
    var Class = require("./util").Class;
    var Gateway = Class.sub();
    Gateway.prototype._init = function(battleField){
	this.battleField = battleField;
    }
    Gateway.prototype.onConnect = function(worker){
	worker.send({t:0});
    }
    Gateway.prototype.onDisconnect = function(worker){
	alert("lostConnection from server");
    }
    exports.Gateway = Gateway;
})(exports)