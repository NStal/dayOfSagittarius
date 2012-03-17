(function(exports){
    var Class = require("../share/util").Class;
    var Point = require("../share/util").Point;
    var Interaction = require("./interaction").Interaction;
    var Drawable = require("./drawing/drawable").Drawable;
    var MoveToInteraction = Interaction.sub();
    MoveToInteraction.prototype._init = function(ship){
	if(!ship){
	    return;
	}
	var self = this;
	this.ship = ship;
	this.handlers = [
	    {
		where:"battleField"
		,type:"mouseUp"
		,handler:function(position){
		    game.syncWorker.send({
			time:game.battleField.time+game.delay
			,cmd:2
			,data:{
			    id:0
			    ,point:game.battleField.screenToBattleField(position)
			}
		    });
		    self.manager.clear();
		}
	    }
	];
    }
    exports.MoveToInteraction = MoveToInteraction;
})(exports)
