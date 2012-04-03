function TagEditor(template,hints){
    Widget.call(this);
    this.initNode(template);
    this.initAllControls();
    this.splitor=",";
    this.hints = [];
    this.tags = []
    this.max = 6;
    var self = this;
    this.tagEditorInputJ.blur(function(){
	if(this.value.toString().replace(/ /g,"").length>0){
	    self.newTag(this.value.toString().replace(/ /g,""));
	    this.value = "";
	}
    });
    this.on = function(event,handler){
	if(!event||!handler){
	    return false;
	}
	this[event+"Handler"] = handler;
    }
    this.tagEditorInputJ.keyup(function(e){
	var backSpaceCode = 8;
	var enterCode = 13;
	//release last tag
	if(self.tags.length>0&&this.value.length==0&&e.which==backSpaceCode){
	    this.value = self.tags.pop();
	    $(self.node).find(".tag[username]="+ this.value).filter(":last").remove() 
	}
	//tag limitation
	if(self.tags.length>=6){
	    this.value=""
	    self.maxPrompt();
	}
	//enter to add tag
	if(this.value.toString().replace(/ /g,"").length>0&&e.which==enterCode){
	    self.newTag(this.value.toString().replace(",",""));
	    this.value = "";
	}
	//addTag by spliter
	var lastChar = this.value.toString().charAt(this.value.toString().length-1);
	for(var i=0;i<self.splitor.length;i++){
	    if(self.splitor.charAt(i)==lastChar){
		if(this.value.length<2){
		    this.value=""
		    break;
		};
		self.newTag(this.value.toString().replace(",",""));
		this.value = ""; 
		break;
	    }
	}
	
    })
    this.showHint = function(){
	var hints = [];
	if(this.tagEditorInputNode.value.toString().length<1){
	    this.tagHintJ.hide();
	    //return;
	}
	for(var i=0;i<this.hints.length;i++){
	    if(this.hints[i].indexOf(this.tagEditorInputNode.value.toString())==0){
		hints.push(this.hints[i]);
	    }
	} 
	if(hints.length>0){
	    this.tagHintJ.html(hints.join(",")).show()
	    this.tagHintJ.show();
	}else{
	    this.tagHintJ.hide();
	}
    }
    this.maxPrompt = function(){
	alert("最多只能有"+this.max+"个人，如果太多，请用组名或者 '全体'");
    }
    this.integrityPrompt = function(tagName){
	alert(tagName+"已存在")
    }
    this.clearAll = function(){
	this.tags = [];
	this.tagContainnerJ.empty();
    }
    this.newTag = function(tagName){
	for(var i=0;i<self.tags.length;i++){
	    if(self.tags[i]==tagName.replace(/ /g,"").replace(/,/g,"" )){
		this.integrityPrompt(tagName);
		return;
	    }
	}
	self.tags.push(tagName.replace(/ /g,"").replace( /,/g,""));
	var node  = $("<div></div>")
	    .addClass("tag clickable")
	    .click(function(){
		for(var i=0;i<self.tags.length;i++){
		    if(self.tags[i]==tagName){
			self.tags.splice(i,1);
		    } 
		}
		$(this).remove()
		self.tagEditorInputJ.width($(self.node).width()-self.tagContainnerJ.outerWidth(true)-20);
		
	    })
	    .text(tagName)
	    .attr("username",tagName);
	if(typeof self.tagModifier === "function"){
	    self.tagModifier(node);
	}
	self.tagContainnerJ.append(node);
	self.tagEditorInputJ.width($(self.node).width()-self.tagContainnerJ.outerWidth(true)-20);
	if(typeof this["tagaddHandler"] ==="function"){
	    this.tagaddHandler();
	}
    }
    this.tagModifier = null;
};


