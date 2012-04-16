var url = require("url");
var querystring  = require("querystring");
var api = require("./api");
var targetList = [];
exports.distributer = function(req,rsp){
    //change alias
    if(settings.alias[req.url]){
	req.url = settings.alias[req.url];
    } 
    var uri = url.parse(req.url);
    var apiReg = api.apiReg; 
    
    
    if(apiReg.test(uri.pathname)){
	api.distributer(new api.apiRequest(req,rsp));
	return true;
    }
    if(/^\/image\//.test(req.url)){
	require("./image.js").handler(req.url.replace(/^\/image\//,""),rsp);
	return;
    }
    console.log(req.url);
    console.log((/^\/image\//.test(req.url)));
    var jsReg = /^\/js/;
    var jsGroupReg = /^\/jsgroup\?js=[^\.]/i;
    if(jsGroupReg.test(req.url)){
	require("./js.js").jsGroupHandler(req,rsp);
	return;
    }
    if(jsReg.test(req.url)){
	require("./js.js").jsHandler(req,rsp);
	return;
    }
    var htmlReg = /^\/html/i;
    if(htmlReg.test(req.url)){
	require("./html.js").handler(req,rsp);
	return;
    }
    var cssReg = /^\/css\//i;
    if(cssReg.test(req.url)){
	require("./css.js").handler(req,rsp);
	return;
    }
    //Other distributer add Later
    return;
    //require("./404.js").handler(req,rsp);
}
