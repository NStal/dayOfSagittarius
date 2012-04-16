function AppObject(){
    var self = this;
    this.waitFor = function(attrName,func,params,time){
	if(!time){
	    time = self._defaultInterval;
	}
	var attrOld = self[attrName];
	setTimeout(function(){
	    if(attrOld!=self[attrName]){
		func.apply(self,params)
		return;
	    }
	    else{
		setTimeout(arguments.callee,time);
	    }
	});
    }
    this.retry = function(func,param,time){
	if(!time){
	    time = this._defaultInterval;
	}
	setTimeout(function(){
	    if(!func.apply(self,param)){
		self.retry(func,param,time);
	    }
	},time);
    }
    this.wrapProcedure = function(funcName){
	if("string"== typeof funcName){
	    if(!this[funcName]){
		return null;
	    }
	    else{
		var func = this[funcName]
	    }
	}
	else
	    var func = funcName;
	return function(){
	    func.call(self)
	}
    }
    this.wrapMethod = function(funcName){
	if("string"== typeof funcName){
	    if(!this[funcName]){
		return null;
	    }
	    else{
		var func = this[funcName]
	    }
	}
	else
	    var func = funcName;
	return function(){
	    func.apply(self,arguments);
	}
    }
    this.loadFrom = function(object){
	for(var item in object){
	    this[item] = object[item];
	}
    }
    this.include =  this.loadFrom;
    this.addFrom = function(object){
	for(var item in object){
	    if(!this[item])this[item] = object[item];
	}
    }
}
function Event(name){
    this.test = name;
    var self = this;
    alert("init");
    return function(){alert(name);alert(self.test)};
}
function Widget(template){    
    AppObject.call(this);
    //HTML node hold for the Object UI
    var self = this;
    this.node = null;
    
    this.initNode =function(template){
	//initNode:
	//Init this object by template,a piece of html or HTMLElementNode
	if("string" ==  typeof template){
	    this.node = jX.parseDOM(template);									//here
	    //alert(this.node);
	}
	else{
	    this.node = template;
	}
	//if it is a valid node
	
	if(this.node){
	    this.node.AppObject = this;
	    this.nodeJ = $(this.node);
	    if(typeof jX.globalEffect =="function"){
		jX.globalEffect(this.node);
	    }
	}
	return this.node;
    }
    this._clickEvent = function(name){
	var onEvent = "onClick"+name.substring(0,1).toUpperCase()+name.substring(1,name.length);
	return function(e){
	    if(self[onEvent]){
		self[onEvent](e);
	    }
	}
    }
    this.controls = [];
    this.applyAttribution = function(controls){
	var _controls = controls?controls:this.controls;
	for(var i=0;i<_controls.length;i++){
	    var name = _controls[i][0];
	    var jObject = _controls[i][1].j$();
	    if(this[name+"Text"]){
		jObject.text(this[name+"Text"]);
	    }
	    if(this[name+"Value"]){
		jObject.val(this[name+"Value"]);
	    }
	    if(this[name+"CSS"]){
		jObject.css(this[name+"CSS"]);
	    }
	}
    }
    //WARNING the id will rewrite the attr of the Widget
    this.initControl = function(name,memberName){
	if(!memberName){
	    //add control as a member of Widget
	    this[name] = new RDO(name,this.node);
	    var _control = [name,this[name]];
	    this.controls.push(_control);
	    this[name+"Node"] = this[name].$();
	    var jObject = this[name].j$();
	    this[name+"J"] =jObject; 
	    jObject.click(this._clickEvent(name));
	    this.applyAttribution([_control]);
	}
	else{
	    this[memberName] = new RDO(name,this.node);
	    this.controls.push([memberName,this[memberName]]);
	    this[memberName+"Node"] = this[memberName].$();
	    this[memberName+"J"] = this[memberName].j$();
	    this[memberName+"J"].click(this._clickEvent(memberName));
	} 
    }
    //call this.initAllControls will clear the this._control,and add all id in node
    //into it
    this.initAllControls =function(){
	if(!this.node)
	    return false;
	this.controls = [];
	var _controls = [];
	var nodes = this.node.getElementsByTagName("*");
	if(this.node.id){
	    this.object = new RDO(this.node.id,this.node);
	    _controls.push(this.node.id);
	}
	this.j = $(this.node); 
	for(var i=0;i < nodes.length;i++){
	    if(nodes[i].id){
		_controls.push(nodes[i].id); 
	    }
	}
	for(var i=0;i < _controls.length;i++){
	    this.initControl(_controls[i]);
	}
	return true; 
    }
    this.registerActivity = function(name){
	if(!this[name]){
	    return false;
	}	
	var extraInfo = (this).constructor.name;
	var globalName = extraInfo+name;
	_Site._activities.push(new _Activity(globalName,
					     this[name]
					     ,this));
	this[name] = function(){
	    _Site._fillHash(globalName,arguments);
	    //Prevent onhashchange not triggered by js
	    _Site.onhashchangeByJS();
	}
    }
    this.setDefaultActivity = function(name){
	if(!this[name]){
	    return false;
	}
	_Site._activities.push(new _Activity("",this[name],this));
	this[name] = function(){
	    _Site._fillHash("",arguments);
	    _Site.onhashchangeByJS();
	}
    }
    this.trace = function(func){
	if(!func.addListener)return false;
	for(var i=1;i<arguments.length;i++){
	    func.addListener(this.wrapMethod(arguments[i]));
	}
    }
    this.listen = this.trace;
    if(template){
	this.initNode(template);
	this.initAllControls();
    }
}
//@staticmethod to handle the global hashChange
// resource is something you wanto get from the webServer
// nGET means enumGET
// eParam means thing in cParam with be throw into eval,
// after "explain"
function AsynResource(URI,func,delay){
    AppObject.call(this);
    if(!URI){
	return null;
    }
    this.URI = URI;
    this._value = null;
    this._done = false;
    this.onRefresh = func;
    if(!delay){
	this.refresh();
    }
    return this;
}
AsynResource.prototype.bind = function(func){
    var self = this;
    this.onRefresh = func;
    if(this._done){
	setTimeout(function(){self.onRefresh(self._value)},0);
    }
}
AsynResource.prototype.clear = function(){
    this._done = false;
    this._value = null;
}
AsynResource.prototype.refresh = function(){
    var self = this;
    this._done = false;
    var xhr = new jX.request();
    xhr.open("GET",this.URI,true);
    xhr.onreadystatechange = function(){
	if(xhr.readyState==4&&self.onRefresh){
	    try{
		var str = unescape(xhr.responseText);
		var value = jX.JSONParse(str);
		self.onRefresh(value); 
	    }
	    catch(e){
		alert(e);
		self.onRefresh(xhr.responseText);
	    }
	}
	self._value = xhr.responseText;
	self._done = true;
    }
    xhr.send();
}
function Resource(URI,delay,func){
    AppObject.call(this);
    if(!URI){
	return null;
    }
    this.URI = URI;
    this._value = null;
    this._done = false;
    if(func){
	this.waitFor("_value",function(){func(this)});
    }
    if(!delay){
	this.thread(this.refresh);
    }
    return this;
}
Resource.prototype.refresh = function(){
    this._done = false;
    var xhr = new jX.request();
    xhr.open("GET",this.URI,false);
    xhr.send();
    
    this._value = xhr.responseText;
    this._done = true;
}
Resource.prototype._doneOrRefresh = function(){
    if(!this._done){
	this.refresh();
    }
}
Resource.prototype.$ = function(){
    this._doneOrRefresh();
    return this._value;
}
Resource.prototype.json = function(){
    this._doneOrRefresh();
    try{
	if(this._jsonValue==undefined){
	    this._jsonValue = jX.JSONParse(this._value); 
	    return this._jsonValue;
	}
	else{
	    return this._jsonValue;
	}
    }
    catch(e){
	alert(e);
	this._jsonValue = null;
	return null;
    }
}
function _Activity(activityName,activityHandler,activityEnvironment){
    this.name = activityName;
    this.environment = activityEnvironment;
    this.handler = activityHandler;
    return this;
}
_Activity.prototype.apply=function(param){
    this.handler.apply(this.environment,param);
}


//Here solve the comtapability latter
window.onhashchange=function(){
    _Site.hashHandler(window.location.hash)
    
}
_Site = new Object()
_Site._activities = Array();
_Site.onhashchangeByJS = function(){
    //which browser?
    //WARNING TAG NOT ALL BROWSER ARE TESTED
    if(false){
	if(window.onhashchange){
	    window.onhashchange();
	}
    }
    return;
}
_Site.hashHandler = function(hash){
    if(hash=="")return;
    var array = hash.replace("#","").split("|");
    if(!array[0])
	array[0]=""
    if(array[1])
	var params = array[1].split(",");
    else
	var params = Array();
    
    for(act in _Site._activities){
	act = _Site._activities[act];
	if(array[0]==$.trim(act.name)){
	    return act.apply(params);
	    break;
	}
    }
    
}
_Site._fillHash =function(funcName,params){
    var pArray = Array();
    for(var i=0;i<params.length;i++){
	pArray.push(params[i]);
    }
    window.location.hash=funcName+"|"+pArray.join(",");
}
var oldHash="";
$(document).ready(function(){
    if(false)
	setInterval(function(){
	    if(window.location.hash==oldHash){
		return;
	    }else{
		oldHash = window.location.hash;
		if(window.onhashchange){
		    window.onhashchange();
		}
	    }
	},200); 
})
$(document).ready(function(){
    if(window.location.hash!="#"&&
       window.location.hash!=""){
	_Site.hashHandler(window.location.hash);
    };
});