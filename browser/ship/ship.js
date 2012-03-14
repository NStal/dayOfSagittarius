(function(exports){
    //override server side ship;
    var Ship = require("../share/ship/shipSoul").ShipSoul.sub();
    Ship.prototype._init = function(info){
	Ship.parent.prototype._init.call(this,info);
	this.onDraw = info.draw;
    }
    exports.Ship = Ship;
})(exports)