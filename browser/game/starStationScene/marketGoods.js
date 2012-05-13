var MarketGoods = Class.sub();
MarketGoods.prototype._init = function (goodsInfo,service){
    if(!goodsInfo.name){
	console.error("no such goods ")
	console.error(goodsInfo);
	return;
    }
    this.service = service;
    this.window = service.window;
    this.buyListBox = this.window.buyListBox;
    this.name = goodsInfo.name;
    this.button = new PageButton(this.name+"Button",this.window.goodsBox,{class:"marketGoods",text:this.name});
    this.priceText = new PageElement("p",this.button.id+"PriceText",this.button,{text:goodsInfo.price});
    this.inList = false;
    this.orderNumber = 0;
    var self = this;
    this.button.J.click(function (){
	self.addToList();
	self.changeOrderNumber(self.orderNumber+1);
    })
}
MarketGoods.prototype.buy = function (){
    
}

MarketGoods.prototype.addToList = function (){
    if(this.inList){
	return;
    }
    var self = this;
    this.inListBox = new PageDiv(this.name+"InList",this.buyListBox,{class:"inListGoods",text:this.name});
    this.inListBox.J.hide();
    this.inListBox.J.slideDown(300);
    this.addButton = new PageButton(this.name+"AddButton",this.inListBox,{class:"goodsAddButton",text:"+"});
    this.addButton.J.click(function (){
	self.changeOrderNumber(self.orderNumber + 1);
    });

    this.numberMonitor = new PageButton(this.name+"NumberMonitor",this.inListBox,{class:"goodsNumberMonitor",text:this.orderNumber});
    this.numberMonitor.J.click(function (){
	
    });
    
    this.reduceButton = new PageButton(this.name+"ReduceButton",this.inListBox,{class:"goodsReduceButton",text:"-"});
    this.reduceButton.J.click(function (){
	self.changeOrderNumber(self.orderNumber - 1);
    });

    
    this.removeButton = new PageButton(this.name+"RemoveButton",this.inListBox,{class:"goodsRemoveButton",text:"x"});
    this.removeButton.J.click(function (){
	self.removeFromList();
    })
    
    this.inList = true;		
}
MarketGoods.prototype.removeFromList = function (){
    if(!this.inList){
	return;
    }
    this.inListBox.J.fadeOut(300,function (){
	//self.inListBox.J.remove();
    })
    this.inList = false;
    this.orderNumber = 0;
}
MarketGoods.prototype.changeOrderNumber = function (number){
    if(number <= 0 ){
	this.removeFromList();
	return;
    }
    this.orderNumber = number;
    this.numberMonitor.J.text(number);
}
