//require jquery
//provide basic classes for jXframe
var jX = new Object;
var jXFramePackage = (function(jX){
    jX.parseDOM = function(str){
	return $(str)[0];
    }
    $(function(){
	$(document).mousemove(function(event){})
    })
    jX.JSONParse = JSON.parse;
    jX.toJSON = JSON.stringify;
    jX.tryParse = function(str){
	try{
	    var value = jX.JSONParse(str);
	    return value;
	}
	catch(e){
	    return str;
	}
    }
    if(XMLHttpRequest)
	jX.request = XMLHttpRequest;
    else
	jX.request = function(){
	    ActiveXObject.call(this,"MSXML2.XMLHTTP.3.0");
	}
    jX.random = function(n){
	if(!n)n=100000;
	return Math.ceil(Math.random()*n);
    }
    jX.dict = function(obj){
	return jX.toJSON(obj);
    }
    jX.debug = true;
    jX.a = function(str){
	if(jX.debug)alert(str);
    }
    jX.log = function(str){
	if(console)console.log(str);
    }
    function RealTimeDOMObject(id,environment){
	this.id = id;
	this.jid = "#"+id;
	if(environment){
	    this.environment = environment; 
	}
	else{
	    this.environment = document;
	}
    }
    RealTimeDOMObject.prototype.$ = function()
    {
	if(this.environment.id==this.id)
	    return this.environment;
	return $(this.environment).find(this.jid)[0];
    }
    RealTimeDOMObject.prototype.j$ = function(){
	if(this.environment.id==this.id)
	    return $(this.environment);
	return $(this.environment).find(this.jid);
    }
    RealTimeDOMObject.prototype.replaceContentNode = function(content){
	var node = this.$().firstChild;
	while(node){
	    this.$().removeChild(node);
	    node = this.$().firstChild;
	}
	if(content)
	    this.j$().append(content);
    }
    RealTimeDOMObject.prototype.clearInputs = function(){
	this.j$().find("input").val("");
	this.j$().find("textarea").val("");
    }
    RealTimeDOMObject.prototype.r$ = RealTimeDOMObject.prototype.replaceContentNode;
    //shortcuts
    RDO = RealTimeDOMObject;
    return jX;
})(jX);
