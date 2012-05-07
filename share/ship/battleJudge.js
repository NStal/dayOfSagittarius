(function(exports){
    var Static = require("../static").Static;
    var Random = require("../util").HashRandomInt;
    var BattleJudge = {};
    BattleJudge.isMissed = function(ammor){
	var target = ammor.target;
	var ship = ammor.weapon.ship;
	var distance =ship.cordinates.distance(target.cordinates);
	var max = 10000;
	console.log("time",Static.time);
	if(distance>ammor.range){
	    return true;
	}
	else{
	    console.log(Static.time);
	    var judge = Random(Static.time,max)/max;
	    var factor = Math.sqrt(Math.sqrt(1 - (Math.sqrt((Math.log(distance+1)
						  /Math.log(ammor.range)))
						  /ammor.weapon.accuracyFactor)));
	    console.log(judge,factor,factor>judge);
	    return factor<judge;
	}
    }
    exports.BattleJudge = BattleJudge;
})(exports)