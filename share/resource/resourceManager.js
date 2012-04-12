(function(exports){
    var Class = require("../util").Class;
    var ResourceManager = Class.sub();
    //contain all the model
    //In future version,all the model designs should be placed in 
    //resource/ship and resource/module,It's easier to manage.
    //But parse file,needs extra effort.
    //Thus at current version
    //all the model infos are hard coded here
    var SHIPS = [];
    var MODULES = [];
    //ResourceManager manage the ship/module prototypes
    //Provide with a model code,return a moduleConstructor
    ResourceManager.getModuleModeln = function(code){
	return null;
    }
    ResourceManager.getShipModel = function(code){
	return null;
    }
    //
    SHIPS.push({
	code:0
	,modelName:"Banshee"
	,ability:{
	    maxSpeed:8
	    ,structure:10000
	    ,maxRotateSpeed:0.2
	    ,speedFactor:0.8
	    ,cpu:10
	    ,size:18
	    ,curveForwarding:true
	}
    })
    exports.ResourceManager = ResourceManager;
})(exports)