(function(exports){
    //override server side ship;
    var ShipSoul = require("../share/ship/shipSoul").ShipSoul;
    var Drawable = require("../drawing/drawable").Drawable;
    Ship = Class.changeRoot(ShipSoul,Drawable).sub();
    Ship.prototype._init = function(info){
	Ship.parent.prototype._init.call(this,info);
	this.onDraw = info.draw;
    }
    exports.Ship = Ship;
})(exports)