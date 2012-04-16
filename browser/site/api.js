API = function(){
    APIManager.call(this);
    this.apis = {
	"getGalaxyInfoByName":["name"] 
	,"getStationInfoByName":["name"]
    }
    this.initAPI();
}
API.prototype = new APIManager();
Static.HttpAPI = new API();
