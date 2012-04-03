(function(exports){
    var Ship = require("./shipSoul").ShipSoul;
    var MotherShip = Ship.sub();
    MotherShip.prototype._init = function(info){
	MotherShip.parent.prototype._init.call(this,info);
    };
    
    exports.MotherShipSoul = MotherShip;
})(exports)