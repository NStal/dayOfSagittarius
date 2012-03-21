(function(exports){
    var Weapon = require("../share/ship/module").WeaponSoul.sub();
    var Allumition = (require("../share/ship/module").AllumitionSoul).sub();
    Allumition.prototype.start = function(weapon){
	Allumition.parent.prototype.start.call(this);
	game.interactionManager.add(this);
	this.position = new Point(this.target.cordinates);
	this.position.x+=2*Math.sin(Math.random()*Math.PI)
	this.position.y+=2*Math.sin(Math.random()*Math.PI);
    }
    Allumition.prototype.stop = function(){
	game.interactionManager.remove(this);
	Allumition.parent.prototype.stop.call(this);
    }
    Allumition.prototype.next = function(){
	Allumition.parent.prototype.next.call(this);
    }
    Allumition.prototype.onDraw = function(context){
	context.beginPath();
	context.arc(0,0,2+2*Math.sin(this.index),0,Math.PI*2);
	context.fillStyle = "red";
	context.fill();
    }
    Weapon.prototype._init = function(){
	this.listen("onPresent");
	this.Allumition = Allumition;
    }
    Weapon.prototype.onPresent = function(objects){
	var self = this;
	objects.push({
	    callback:function(){
		if(self.manager.ship.AI.destination.target){
		    game.syncWorker.send((new ShipController(self.manager.ship)).activeModule(self));
		    console.log("send filed");
		}
		console.log("can't fire without locking the target");
	    }
	    ,present:function(context){
		context.beginPath();
		context.moveTo(0,0);
		context.lineTo(20,0)
		context.arc(0,0,20,0,Math.PI*2*self.readyState/self.coolDown);
		context.closePath();
		context.fill();
	    }
	});
    }
    
    exports.Weapon = Weapon;
})(exports)