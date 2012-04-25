API = function(){
    APIManager.call(this);
    this.apis = {
	"getGalaxyInfoByName":["name"]
	,"getStationInfoByName":["name"]
	,"requestShipUndocking":["shipId","stationName"]
    }
    this.apiEx = {
	"template":["template/all.json"]
    }
    this.initAPI();
}
API.prototype = new APIManager();
Static.HttpAPI = new API();
