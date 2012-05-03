var Interface = require("./database/interface").Interface;
exports.handler = function(){
    this.parameters = {
	"name":this.CRITICAL
    }
    var self = this;
    this.solve(function(query){
	Interface.getStarStationFullInfo(query.name,function(info){
	    self.end(info);
	})
    })
}

