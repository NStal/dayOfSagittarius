function APIManager(){
    //using api url as api name;
    //every item should be like [apiName/URL ,paramName1 ,paramNamw2 ....]
    this.apis = [];
    
    //don't using url as api name, and specify a name.
    //every item should be like [apiName , URL , paramName1 , paramName2 ...]
    //this is used for cased that you want the API name be different from the URI name.
    this.apiEx = [];

    //prepend apiURIprefix to all the ajax request URL
    this.apiURIPrefix = "api/";
    //append to the end of the url such .php .jsp etc
    this.apiURISuffix = "";
    //default error handler
    this.defaultErrorHandler = function(name,xhr){
	jX.log("API "+name+" filed");
	jX.log("result:"+xhr.responseText);
    }
    var self = this;
    this.__jX__initAPIWith = function(apiLists,withName){
	for(var i in apiLists){
	    //apiClaim contain all the information for a API
	    var apiClaim = apiLists[i];
	    //what's the APIName
	    var apiName = i;
	    //what's the API URL
	    if(withName){
		var URI = apiClaim[0];
		//slice first 2 element which is URIname
		//what left is parameters
		var sliceFrom = 1;
	    }
	    else{
		var URI = apiName;
		//slice first item for which is apiName
		//what left is parameters
		var sliceFrom = 0;
	    }
	    //what param to client
	    var paramClaims = apiClaim.slice(sliceFrom);
	    var URL = ""
	    if(withName){
		//custom api
		URL = URI
	    }else{
		URL = this.apiURIPrefix +URI+this.apiURISuffix;
	    }
	    this[apiName] = CreateAPIObject(URL,
					    paramClaims,
					    this.defaultErrorHandler,
					    apiName);
	    
	}
    } 
    this.initAPI = function(){
	this.__jX__initAPIWith(this.apiEx,true);
	this.__jX__initAPIWith(this.apis,false);
	//debug 
    }
}
APIManager.errors = {"invalidParameter":1,
		     "permissionDenied":2,
		     "notExist":3,
		     "invalidAction":4,
		     "alreadyExist":5,
		     "timeExpired":6}
function CreateAPIObject(URI,paramClaims,errorHandler,name){
    //using hacks like below allow using apiObject() as a function
    //as well as using it like a Object/Instance of class
    //without prototype,it may cost extra memory but APIObject usually
    //will not have much instance even in big projects. 
    var xhr = new jX.request();
    var apiObject = function (){
	var self = apiObject;
	var pairs = [];
	//make up URL parameters
	var funcIndex = 0;
	for(var i=0;i<self.paramClaims.length;i++,funcIndex = i){
	    if(typeof arguments[i]=="undefined"){
		continue;
	    }
	    else{
		if(typeof arguments[i]=="function"){
		    break;
		}
		pairs.push(self.paramClaims[i]+"="+encodeURIComponent(arguments[i].toString()));
	    }
	}
	var URL = self.URI+"?"+pairs.join("&");
	//load instant handler,the index (number of parameter) + 1 is reserved for a instantHandler
	//which will only be applied at this call
	var instantHandler = [];
	while(typeof arguments[funcIndex] == "function"){
	    instantHandler.push(arguments[funcIndex]);
	    funcIndex+=1;
	}	
	var initData = function (raw){
	    var result = jX.tryParse(raw);
	    if(result.data){
		result.traverse = function (handler,data){
		    var arrayData = null;
		    if(data && data.length){
			arrayData = data;
		    } 
		    if(this.data && this.data.length){
			arrayData = this.data;
		    }
		    if(arrayData){
			for(var i=0;i<arrayData.length;i++){
			    handler(arrayData[i]);
			}
			return true;
		    }
		    return false;
		} 
		;
	    }
	    result.getData = function(){
		return this.data;
	    }
	    return result;
	}
	//prevent cache.
	URL+="&_random="+new Date().getTime();
	//_ticket for avoid dumped request excute more than one time
	if(self.useTicket){
	    self.setTicket();
	    URL+="&_ticket="+self.ticket;
	}
	self.sendRequest = function(){
	    if(self.isProcessing){
		console.log("warn sending api request while the same request has already running");
		return;
	    }
	    xhr.open(self.method,URL,true); 
	    self.lastURL = URL;
	    xhr.onreadystatechange = function(){
		if(xhr.readyState==4){
		    self.isProcessing = false; 
		    if(xhr.status!=200){
			//server error
			xhr.responseText = jX.toJSON({
			    "result":false,
			    "errorCode":-1,
			    "errorDescription":"server error"
			});
		    } 
		    if(xhr.status==0){
			xhr.responseText = jX.toJSON({
			    "result":false,
			    "errorCode":-2,
			    "errorDescription":"net work error"
			});
			//net work error;
			//currently do nothing; 
		    }
		    if(self.expireTimeoutId){
			self.clearExpireTimeout();
		    }
		    var value = initData(xhr.responseText); 
		    for(var i=0;i<self.filters.length;i++){
			//use filter to change the raw content
			value = self.filters[i](value);
		    } 
		    for(var i=0;i<instantHandler.length;i++){
			instantHandler[i](value); 
		    }
		    for(var i=0;i<self.listeners.length;i++){
			self.listeners[i](value); 
		    }
		}
	    }
	    self.isProcessing = true;
	    xhr.send();
	}
	self.sendRequest();
	return self;
    };
    var self = apiObject; 
    self.useTicket = true;
    self.isProcessing = false;
    self.URI = URI;
    self.paramClaims = paramClaims;
    self.listeners = [];
    self.filters = [];
    self.method = "GET";
    self.expireTime = 10*1000;
    self.name = name?name:'anonymous';
    //same api that will called paralized at a time
    //need its own environment thus should be deep copied;
    //using specified handler or the default one;
    self.errorHandler = errorHandler ? errorHandler: null;
    self.abort = function(){
	if(self.isProcessing){
	    self.isProcessing = false;
	    xhr.abort();
	}
    }
    self.expire = function(handler,time){
	if(self.expireTimeoutId)
	    return; 
	if(!time){
	    var time = self.expireTime;
	}
	self.expireTimeoutId = setTimeout(function(){
	    console.log("In this");
	    self.expireTimeoutId = null;
	    if(handler){
		handler();
	    }
	},time);
	console.log("here!!"+time);
    }
    self.clearExpireTimeout = function(){
	clearTimeout(self.expireTimeoutId);
	self.expireTimeoutId = null;
    }
    self.resend = function(){
	self.abort();
	self.sendRequest();
    }
    self.addListener = function(handler){
	for(var i=0;i<arguments.length;i++){
	    if(typeof arguments[i] == "function"){
		this.listeners.push(arguments[i]); 
	    }
	}
	return this;
    }
    self.newInstance = function(){
	return CreateAPIObject(URI,paramClaims,errorHandler,name);
    } 
    //Set ticket for avoiding request excute twice
    self.isTicketExpired = true; 
    self.setTicket = function(_ticket){
	if(this.isTicketExpired){
	    this.isTicketExpired = false;
	    if(_ticket){
		this.ticket = ticket;
	    }else{
		this.ticket = new Date().getTime();
	    }
	}
    }
    //abandonTicket will be called when request is successfully returned;
    self.abandonTicket = function(){
	this.isTicketExpired = true;
    }
    self.addFilter = function(filter){
	for(var i=0;i<arguments.length;i++){
	    if(typeof arguments[i] == "function"){
		this.filters.push(arguments[i]);
	    }
	}
	return this;
    }
    
    //this.errorHandler = errorHandler?errorHandler:this.errorHandler;
    return self;
}