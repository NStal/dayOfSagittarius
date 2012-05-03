(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Container = require("../drawing/drawable").Drawable;
    var MouseInteraction = require("./interaction/mouseInteraction").MouseInteraction; 
    var InteractionManager = Drawable.sub();
    var ShipSelectInteraction = require("./interaction/shipSelectInteraction").ShipSelectInteraction; 
    var MouseEventDistributer = require("../drawaing/mouseEventDistributer").MouseEventDistributer;
    //InteractionManager:
    //1.Manage all the user event like mousemove and keydown
    //2.Every handler that want to access user event
    //Should register in the interactionManager
    InteractionManager.prototype._init = function(game){
    }
    exports.InteractionManager = InteractionManager;
})(exports)