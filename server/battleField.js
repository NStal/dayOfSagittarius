var Class = require("util");
var BattleField = Class.sub();
var prototype = require("protocol");
BattleField.prototype._init = function(){
    this.sequence = 0;
}
BattleField.prototype.act = function(act){
    if(act.s==0){
	//request sync
	return this.genFieldData();
    }
    if(act.s <= this.sequence){
	return {s:0};
    }
}
BattleField.prototype.genFieldData = function(){
    return 0;
}
