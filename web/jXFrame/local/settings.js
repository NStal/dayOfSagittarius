exports.port = 10081;
exports.host = "0.0.0.0";
exports.root = "/home/wuminghan/workspace/suoshi/";
exports.apiRoot = "api/";

exports.htmlRoot = "html/";
exports.htmlSuffix =".html"
exports.cssRoot = "css/";
exports.remoteJsRoot = "js/";

exports.templateRoot = "templates/";
exports.templateSuffix = ".html";
exports.templates = {
    "all":["calendar",
	   "calendarItem",
	   "logWriter",
	   "logList",
	   "logListItem", 
	   "signUpBox",
	   "loginBox",
	   "tutorialBox",
	   "toastBar",
	   "modifyBox",
	   "settingPanel",
	   "modifyMailBox",
	   "modifyPasswordBox"
	   ,"imageUploader"]
}
exports.imageRoot = "image/"


//index url are translate into content url
exports.alias={
    "/":"/html/index.html",
    "/index.html":"/html/index.html",
    "/mobile.html":"/html/mobile.html", 
    "/mobil2.html":"/html/mobile2.html"
}
exports.apiSuffix = ".js";
exports.header = {};
exports.databaseName = "suoshi";
exports.databaseAddress = "localhost";
exports.databasePort = 27017;
exports.storageFolder = "store/";
exports.userImageFolder = "image/";

exports.extraURLParser = [];//{pathToModule:RegExp