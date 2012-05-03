API = function(){
    APIManager.call(this);
    this.apis = {
<<<<<<< HEAD
		"getGalaxyInfoByName":["name"]
		,"getStationInfoByName":["name"]
=======
	"getGalaxyInfoByName":["name"]
	,"getStationInfoByName":["name"]
	,"requestShipUndocking":["shipId","stationName"]
    }
    this.apiEx = {
	"template":["template/all.json"]
>>>>>>> 0b93c740a835c62d4b838aa3b5ca9998b17c123a
    }
    this.initAPI();
}
API.prototype = new APIManager();
Static.HttpAPI = new API();
