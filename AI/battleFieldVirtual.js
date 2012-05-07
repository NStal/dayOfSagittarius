(function(exports){
    var Class = require("./share/util").Class;
    var Point = require("./share/util").Point;
    var Container = require("./share/util").Container;
    var clientCommand = require("./share/protocol").clientCommand;
    var BattleFieldSoul = require("./share/battleFieldSoul").BattleFieldSoul;
    var settings = require("./settings");
    var Math = require("./share/util").Math;
    var BattleFieldVirtual = BattleFieldSoul;
    var ShipSoul = require("./share/ship/shipSoul").ShipSoul;
    var StarGate = require("./share/ship/starGate").StarGateSoul;
    exports.BattleFieldVirtual = BattleFieldVirtual;
})(exports)
