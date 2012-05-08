API = function(){
    APIManager.call(this);
    this.apis = {
	"getGalaxyInfoByName":["name"]
	,"getStationInfoByName":["name"]
	,"requestShipUndocking":["shipId","stationName"]
	,"getUserData":["name"]
    }
    this.apiEx = {
	"template":["template/all.json"]
    }
    this.initAPI();
}
API.prototype = new APIManager();
Static.HttpAPI = new API();
