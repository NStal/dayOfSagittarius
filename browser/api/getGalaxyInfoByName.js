var Interface = require("./database/interface").Interface;
exports.handler = function(){
    this.parameters = {
	"name":this.CRITICAL
    }
    var self = this;
    this.solve(function(query){
	Interface.getGalaxyInfoWithEnvironment(query.name,function(galaxy){
	    self.end(galaxy);
	})
    })
}