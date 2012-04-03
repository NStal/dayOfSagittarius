//require widget.js (for appObject class)
function List(templateList,templateListItem,contentID){
    
    if(!templateList){
	return;
    }
    Widget.call(this);
    this.initNode(templateList);
    this.initAllControls();
    //all generated list is based on the clone of this
    
    if(templateListItem){
	this._listItem = new ListItem(templateListItem,[]);
	this._listItem.parent = this;
    } 
    else
	this._listItem = null;
    
    this._contentID = contentID; 
    this.content = new RDO(contentID,this.node);
    this.contentNode = this.content.$();
    this.contentJ = $(this.contentNode);
    //how many showed each time?
    this._block = 100000;
    this._listItems = [];
    //if in pageIndex mode this is currentPage
    //if in showMore node this is shown items divied by this._block
    this._blockIndex = 1;
    //0 for show More
    //1 for show pagin
    this._mode = 0;
    //text shown when no content
    this.emptyHolder = this._listItem.node;
    
}
List.prototype.setShowNextButton = function(id){
    this.initControl(id);
    this._showNextButtonId = id;
}
List.prototype.setShowPrevButton = function(id){
    this.initControl(id);
    this._showPrevButtonId = id;
}
List.prototype.setShowMoreButton = function(id){
    this.initControl(id);
    this._ShowMoreButtonId = id;
}
List.prototype.setNoMoreHandler = function(handler){
    this.noMoreHandler = handler;
}
List.prototype.appendItem = function(listItem){
    var item = this.appendItemDelay(listItem);
    if(item)
	this.contentJ.append(item.node);
}
List.prototype.appendItemDelay = function(listItem){
    if(listItem){
	this._listItems.push(listItem);
	listItem.parent = this;
	return listItem;
    }
    else{
	console.log("append null in listItem")
	return null;
    }
}
List.prototype.prependItem = function(listItem){
    var item = this.prependItemDelay(listItem);
    if(item)
	this.contentJ.prepend(item.node);
}
List.prototype.prependItemDelay  = function(listItem){
    if(listItem){
	this._listItems.unshift(listItem); 
	listItem.parent = this;
	return listItem;
    }
    else{
	console.log("prepend null in listItem");
	return false;
    }
}
List.prototype.clearAll = function(){
    if(this._listItem.node){
	this.content.$().innerHTML = "";
	this._listItems = [];
    }
    
}
List.prototype._cloneWithActions = function(actions){
    if(!this._listItem.node){
	console.log("invalid clone");
	return null;
    }
    var item  = this._listItem.clone();
    for(var i=0;i < actions.length;i++){
	item.applyAction(actions[i]);
    }
    return item;
}
List.prototype._cloneWithFunction = function(func){
    if(!this._listItem.node){
	console.log("invalid clone");
	return null;
    }
    var item  = this._listItem.clone();
    func.call(item);
    return item;
}
List.prototype.appendItemByFunction = function(func){
    return this.appendItem(this._cloneWithFunction(func));
}
List.prototype.prependItemByFunction = function(func){
    return this.prependItem(this._cloneWithFunction(func));
}
List.prototype.appendItemByActions = function(actions){
    return this.appendItem(this._cloneWithActions(actions));
}
List.prototype.prependItemByActions = function(actions){
    return this.prependItem(this._cloneWithActions(actions));
}
List.prototype.count = function(){
    return this._listItems.length;
}
List.prototype.removeItemDelay = function(item){
    if(!item){
	return false;
    };
    for(var i=0;i<this._listItems.length;i++){
	if(item==this._listItems[i]){
	    this._listItems.splice(i,1);
	    return item;
	}
    }
    return false;
}
List.prototype.removeItem = function(item){
    var theItem = this.removeItemDelay(item); 
    theItem.nodeJ.slideUp("fast",
			  function(){
			      theItem.nodeJ.remove()
			  }); 
    return true;
}
//WARNINGTAG Change at next version
List.prototype.syncUI = function(item){
    //only show more mode
    this.content.$().innerHTML = "";
    for(var i=0;i<this._listItems.length&&
	i<this._blockIndex*this._block;i++){
	this.content.$().appendChild(this._listItems[i].node);
    }
    if(this._listItems.length==0){
	if("string" == typeof this.emptyHolder)
	    this.content.$().innerHTML = this.emptyHolder;
	else{
	    this.content.$().appendChild(this.emptyHolder);
	    
	}
    }
    return this.node;
    
}
List.prototype.showMore = function(){
    this._blockIndex++;
    if((this._blockIndex-1)*this.block>this._listItems.length){
	if(this.noMoreHandler){
	    this.noMoreHandler();
	}
	return false; 
    }
    this.syncUI();
}
function ListItem(template,actions){
    Widget.call(this);
    if(template)
	this.initNode(template);
    for(action in actions){
	this.applyAction(actions[action]);
    }
    this.initAllControls();
    return this;
}
ListItem.prototype.remove = function(){
    if(this.parent){
	this.parent.removeItem(this);
    }
}
ListItem.prototype.clone = function(){
    var item = new ListItem(this.node.cloneNode(true),[]);
    item.parent = this.parent;
    return item;
}
ListItem.prototype.applyAction = function(action){
    if(!this.node){
	return false;
    }
    //which node to apply the action?
    var child = $(this.node).find("#"+action.id)[0];
    if(!child)return null;
    //allow access of the node to this;
    child.appObject = this;
    var t = ListAction.type;
    switch(action.type){
    case t.fill:
	child.innerHTML = action.handler;
	break;
    case t.remove:
	$(child).remove();
	break;
    case t.onclick:
	$(child).click(action.handler)
	break;
    case t.mouseEnter:
	$(child).mouseenter(action.handler);
	break;
    case t.mouseLeave:
	$(child).mouseleave(action.handler);
	break;
    case t.setID:
	child.id = action.handler;
	break;
    case t.addClass:
	child.className += " "+action.handler;
	break;
    case t.setAttr:
	$(child).attr(action.handler[0],actions.handler[1])
	break;
    default:
	return null;
	break;
    }
    return child;
}
function ListAction(id,handler,type){
    this.id = id;
    if(type)
	this.type = type;
    else
	this.type = ListAction.type.fill;
    this.handler = handler;
    return this;
}
//enum for the list Type
ListAction.type =new Object();
ListAction.type.fill = 0;
ListAction.type.remove = 1;
ListAction.type.onclick = 2;
ListAction.type.mouseEnter = 3;
ListAction.type.mouseLeave = 4;
ListAction.type.setID = 5;
ListAction.type.addClass = 6;
ListAction.type.setAttr = 7;