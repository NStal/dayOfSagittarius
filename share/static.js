(function(exports){
    var items = require("./resource/item.js");
    var gameResourceManager = require("./gameResourceManager").gameResourceManager;
    gameResourceManager.init(items.Items);
    if(!Static){
	var Static = {};
    } 
    
    Static.Items = items.Items;
    Static.ModuleEnum = items.ModuleEnum;
    Static.ItemEnum = items.ItemEnum;
    Static.GRM = gameResourceManager;
    Static.gameResourceManager = gameResourceManager;
    exports.Static = Static;
})(exports)