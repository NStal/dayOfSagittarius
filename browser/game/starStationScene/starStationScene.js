(function(exports){
    //for compatibility jXFrame,Here we don't use Class.sub(),instead, we use traditional
    //JS prototype
    var Class = require("../../share/util").Class;
    var Point = require("../../share/util").Point;
    var Drawable = require("../game/drawing/drawable").Drawable; 
    var StarStationScene = function(template){
	Widget.call(this,template);
	
	this.nodeJ.css({display:"none"});
	this.node.width = settings.width;
	this.node.height = settings.height;
	var self = this;
	Static.battleField.on("shipDocked",function(ship,station){
	    if(ship.pilot = Static.username){
		//users ship docked
		self.station = station; 
		//alert(station.name);
		self.onEnterStation(station.name); 
	    }
	});
    }
    var PageElement = Class.sub();
    PageElement.prototype._init = function(type,id,container,info,ifFixed){
	if(!id) return;
	
	if(container[id+"J"]) container[id+"J"].remove();
	if($("#"+id)){
	    $("#"+id).remove();
	    console.log("remove id "+id );
	}
	
	var htmlText = "<"+type;
	htmlText += " id='"+id+"'";
	if(info && info.class) htmlText += " class='"+info.class+"'";
	if(type == "img"){
	    htmlText += "/>"
	}else{
	    htmlText += ">"
	    if(info && info.text) htmlText += info.text;
	    htmlText += "</"+type+">";
	    
	}
	console.log("new element : "+id);
	container.J.append(htmlText);
	
	this.id = id;
	this.container = container;
	this.node = document.getElementById(id);
	this.J = $("#"+id);
	this.fixed = ifFixed? true:false;
	this.sizeLocked = false;
	if(info && info.z) this.J.css("z-index",info.z);
    }
    PageElement.prototype.changeSize = function (dock){
	if(!dock.defaultWindow) return;
	defaultWindow = dock.defaultWindow;
	realWindow = dock.realWindow;
	var newWidth = this.J.width() / defaultWindow.width * realWindow.width;
	var newHeight = this.J.height() * newWidth / this.J.width();
	this.J.height(newHeight);
	this.J.width(newWidth);
	this.defaultHeight = newHeight;
	this.defaultWidth = newWidth;
	console.log("changesize:"+this.id+" Height:"+newHeight+" width:"+newWidth);
	for(var i in this){
	    if(i != "container" && i!="dock" && this[i].J){
		this[i].handleDisplaySize(dock);
	    }
	}
    }
    PageElement.prototype.handleDisplaySize = function (dock){
	if(this.sizeLocked) return;
	if(this.fixed){
	    this.changeSize(dock);
	}else{
	    this.defaultHeight = this.J.height();
	    this.defaultWidth = this.J.width();
	}
	this.sizeLocked = true;
	console.log("size Locked:"+this.id+" Height:"+this.defaultHeight+" width:"+this.defaultWidth);
    }
    //PageElement = DockPage;
    var PageDiv = PageElement.sub();
    PageDiv.prototype._init = function (id,container,info,ifFixed){
	//console.log("new Div name:"+id + " fixed:"+ifFixed)
	PageDiv.parent.call(this,"div",id,container,info,ifFixed);
    }
    var DockCanvasContainer = PageDiv.sub();
    DockCanvasContainer.prototype._init = function (id,container,info,ifFixed){
	DockCanvasContainer.parent.call(this,id,container,info,ifFixed);
	this.canvas = new PageElement("canvas",id+"Canvas",this,{class:"dockCanvas"});
	this.canvas.node.width = 500;
	this.canvas.node.height = 600;
	this.canvas.mouse = {};
	var self = this;
	this.canvas.node.onmousemove = function (e){
	    self.canvas.mouse.x = e.offsetX;
	    self.canvas.mouse.y = e.offsetY;
	    //console.log(self.canvas.mouse.x +" "+self.canvas.mouse.y );
	}
	this.canvas.node.onmousedown = function (e){
	    self.canvas.mouse.pushed = true;
	}
	this.canvas.node.onmouseup = function (e){
	    self.canvas.mouse.pushed = false;
	}
    }
    
    var PageButton = PageElement.sub();
    PageButton.prototype._init = function (id,container,info,ifFixed){
	PageButton.parent.call(this,"button",id,container,info,ifFixed);
	if(info && info.class){
	    this.className = info.class;
	    var self = this;
	    this.J.mouseenter(function (){
		self.J.addClass(self.className+"-hover");
		self.hoverFunc();
	    });
	    this.J.mouseleave(function (){
		self.J.removeClass(self.className+"-hover");
		self.unhoverFunc();
	    });
	}
    }
    PageButton.prototype.hoverFunc = function (){
	
    }
    PageButton.prototype.unhoverFunc = function (){
	
    }

    var PageTag = PageButton.sub();
    PageTag.prototype._init = function (id,container,info,ifFixed){
	PageTag.parent.call(this,container,info,ifFixed);
    }
    
    PageTag.prototype.select = function (){
	if(!this.className){
	    console.error(this.id+" can't be selected for lack of a class");
	    return;
	}
	this.J.addClass(this.className+"-selected");
    }
    PageTag.prototype.unselect = function (){
	if(!this.className){
	    console.error(this.id+" can't be unselected for lack of a class");
	    return;
	}
	this.J.removeClass(this.className+"-selected");
    }
    
    var PageWindow = PageDiv.sub();
    PageWindow.prototype._init = function (id,container,info,ifFixed){
	PageWindow.parent.call(this,id,container,info,ifFixed);
	//this.testText = new PageElement("h2",id+"testText",this,{text:this.container,class:"testText"});
	this.on = false;
    }
    
    var DockGuidBox = PageDiv.sub();
    DockGuidBox.prototype._init = function (container){
	DockGuidBox.parent.call(this,"guidBox",container,null,true);
	this.previewBox = new DockPreviewBox(this);
	this.placeInfoBox = new DockPlaceInfoBox(this);
	this.placesBox = new DockPlacesBox(this);
	var self = this;
	this.placesBox.J.mouseleave(function (){
	    self.previewBox.hide();
	})
    }
    var DockPreviewBox = PageDiv.sub();
    DockPreviewBox.prototype._init = function (container){
	DockPreviewBox.parent.call(this,"previewBox",container);
	this.on = false;
    }
    DockPreviewBox.prototype.hide = function (){
	var self = this;
	this.J.animate({width:0},90,function (){
	    self.J.hide();
	    self.J.width(this.defaultWidth);
	});
	this.on = false;
    }
    DockPreviewBox.prototype.show = function (top){
	if(this.on){
	    this.J.animate({top:top},130);
	}else{
	    this.J.css("top",top);
	    this.J.width(0);
	    this.J.show()
	    this.J.animate({width:this.defaultWidth},90);
	    this.on = true;
	}
    }
    var DockPlaceInfoBox = PageDiv.sub();
    DockPlaceInfoBox.prototype._init = function (container){
	DockPlaceInfoBox.parent.call(this,"placeInfoBox",container)
	this.title = new PageElement("h2",this.id+"Title",this);
	this.message = new PageElement("p",this.id+"Message",this);
    }
    DockPlaceInfoBox.prototype.changeInfo = function (info){
	this.title.J.text(info.name);
	this.message.J.text(info.message);
    }
    var DockPlacesBox = PageDiv.sub();
    DockPlacesBox.prototype._init = function (container){
	DockPlacesBox.parent.call(this,"placesBox",container);
    }

    var DockService = Class.sub();
    DockService.prototype._init = function (info,facility){
	this.info = info;
	if(!this.info.name) this.info.name = this.info.type;
	this.name = this.info.name;
	this.facility = facility;
	this.dock = this.facility.dock;
	this.serviceBox = this.dock.serviceBox;
	this.serviceButton = new PageButton(this.info.name+"Button",this.serviceBox.serviceList,{class:"serviceButton",text:this.info.name});
	this.serviceButton.handleDisplaySize(this.dock);
	var self = this;
	this.serviceButton.J.click(function (){
	    self.install();
	});
	this.creatWindow();
    }
    DockService.prototype.setActiveFlag = function (){
	if(this.serviceBox.shrinked){
	    this.serviceBox.activeServiceFlag.J.css(
		{right:(this.serviceBox.serviceNum - 1) * 100
		 - this.serviceButton.node.offsetLeft
		 ,left:"auto"}
	    );
	}else{
	    this.serviceBox.activeServiceFlag.J.css(
		{left:this.serviceButton.node.offsetLeft
		 ,right:"auto"}
	    );
	}
	this.serviceBox.activeServiceFlag.J.show();
    }
    DockService.prototype.install = function (){
	if(this.facility.nowService && this.facility.nowService.info.name == this.info.name){
	    return;
	}
	this.serviceBox.window = this.window;
	this.setActiveFlag();
	
	if(!this.facility.nowService || this.serviceBox.shrinked){
	    var self = this;
	    this.window.J.show();
	    this.window.J.css({left:"auto"});
	    if(this.dock.nowFacility == this.facility){
		this.serviceBox.enlarge();
	    }
	}else{
	    if(this.serviceBox.busy) return;
	    this.serviceBox.busy = true;
	    var lastSub = this.facility.service.getSubscript(this.facility.nowService,"name");
	    var thisSub = this.facility.service.getSubscript(this,"name");
	    console.log("lastSub = "+lastSub+"  thisSub"+thisSub);
	    var slideLeft = thisSub > lastSub? true:false;
	    var self = this;
	    var nowService = this.facility.nowService;
	    if(slideLeft){
 		this.window.J.css({left:this.window.J.width()});
		this.window.J.show();
		var _interval1 = setInterval(function (){
		    var nowleft = self.window.J.css("left").slice(0,-2)*1;
		    if(nowleft < 100 ){
			self.window.J.css({left:"auto"});
			nowService.window.J.hide();
			self.serviceBox.busy = false;
			clearInterval(_interval1);
			return;
		    }
		    //console.log("enter left "+nowleft);
		    self.window.J.css({left:nowleft-100});
		    nowService.window.J.css({left:nowleft-nowService.window.J.width()-100});
		},30)
	    }else{
 		this.window.J.css({left:-this.window.J.width()});
		this.window.J.show();
		var _interval2 = setInterval(function (){
		    var nowleft = self.window.J.css("left").slice(0,-2)*1;
		    if(nowleft > -100 ){
			self.window.J.css({left:"auto"});
			nowService.window.J.hide();
			self.serviceBox.busy = false;
			clearInterval(_interval2);
			return;
		    }
		    //console.log("enter left "+nowleft);
		    self.window.J.css({left:nowleft+100});
		    nowService.window.J.css({left:nowleft+nowService.window.J.width()+100});

		},30);
	    }
	}


	this.facility.nowService = this;
	console.log("service"+self.info.name+" active");
    }
    DockService.prototype.creatWindow = function (){
	var name = this.info.name;
	var self = this;
	this.window = new PageWindow(name + "Window",this.dock.serviceBox,{class:"serviceWindow"});
	this.window.J.hide();
	switch(this.info.type){
	case "marketBuy" :
	    this.creatMarketBuyWindow();
	    break;
	case "marketSell" :
	    
	    break;
	case "equipmentManage" :
	    this.creatEquipmentManageWindow();
	    break;
	default:
	}
	console.log("window created : "+this.window.id);
    }
    DockService.prototype.creatMarketBuyWindow = function (){
	var self = this;
	this.window.goodsBox = new PageDiv(this.name+"GoodsBox",this.window,{class:"goodsBox"});
	this.window.buyListBox = new PageDiv(this.name+"BuyListBox",this.window,{class:"buyListBox"});
	this.window.buyButton = new PageButton(this.name+"BuyButton",this.window,{class:"buyButton",text:"Buy"});
	this.window.clearButton = new PageButton(this.name+"clearButton",this.window,{class:"clearButton",text:"Clear"});
	var goodsInfo = this.info.goods;
	this.goods = new Array();
	for(var i=0 ; i < goodsInfo.length ; i++){
	    this.goods.push(new MarketGoods(goodsInfo[i],this));
	}
	this.window.clearButton.J.click(function (){
	    for (var i = 0; i < self.goods.length; i++){
		if(self.goods[i].inList)
		    self.goods[i].removeFromList();
	    }
	});
	this.window.buyButton.J.click(function (){
	    for (var i = 0; i < self.goods.length; i++){
		if(self.goods[i].inList)
		    self.goods[i].buy();
	    }
	});
    }
    DockService.prototype.creatEquipmentManageWindow = function (){
	var equipmentsInfo = [
	    {name:"HeavyPropeller"},
	    {name:"MeddiumPropeller",number:20},
	    {name:"LightPropeller",number:20},
	    {name:"HeavyBeamRaife"},
	    {name:"MeddiumBeamRaife",number:5},
	    {name:"LightBeamRaife" ,number:30},
	    {name:"MiddiumCommandCenter"},
	    {name:"LightBattery" ,number:100},
	    {name:"SmallDepot" ,number:10},
	    {name:"MeddiumEngine" ,number:1	},
	    {name:"LightEngine" ,number:10},
	    {name:"SmallQuarters" ,number:100}
	];
	var shipsInfo = [
	    {name:"DwanTracker"
	     ,username:"Shark"
	     ,id:123456
	     ,equipmentArray:[]
	    }
	]
	var self = this;
	this.window.equipmentBox = new PageDiv(this.name+"EquipmentBox",this.window,{class:"equipmentBox"});
	this.window.shipBox = new DockCanvasContainer(this.ame+"ShipBox",this.window,{class:"shipBox"});
	this.window.shipListBox = new PageDiv(this.name+"ShipListBox",this.window,{class:"shipListBox"});
	this.window.shipInfoBox = new PageDiv(this.name+"ShipInfoBox",this.window,{class:"shipInfoBox"});
	this.window.equipmentInfoBox = new PageDiv(this.name+"EquipmentInfoBox",this.window,{class:"equipmentInfoBox"});
	this.canvas = this.window.shipBox.canvas;
	this.equipments = new Array();
	for (var i = 0; i < equipmentsInfo.length; i++){
	    
	    this.equipments.push(new FactoryEquipment(equipmentsInfo[i],this));
	}
	this.ships = new Array();
	for (var i = 0; i < shipsInfo.length; i++){
	    this.ships.push(new FactoryShip(shipsInfo[i],this));
	}
	this.shipBoxAnimation = function (context){
	    context.clearRect(0,0,this.canvas.node.width,this.canvas.node.height);
	    context.strokeStyle = "black";
	    context.lineWidth = 1;
	    context.save();
	    var centerX = this.canvas.node.width/2 - 15;
	    var centerY = this.canvas.node.height/2 - 15;
	    context.translate(centerX,centerY);
	    context.fillRect(-5,-5,10,10);
	    var offsetMouse = {
		x : this.canvas.mouse.x - centerX + this.editingShip.width/2,
		y : this.canvas.mouse.y - centerY + this.editingShip.height/2,
		pushed :this.canvas.mouse.pushed
	    }
	    this.editingShip.draw(context);
	    this.editingShip.handleEquipmentEvents(context,offsetMouse);

	    context.restore();
	    
	    if(this.editingEquipment){
		context.save();
		context.translate(this.canvas.mouse.x,this.canvas.mouse.y);
		this.editingEquipment.draw(context);
		context.restore();
	    }
	}
	this.animateLoop = setInterval(function (){
	    var context = self.canvas.node.getContext('2d');
	    self.shipBoxAnimation(context);
	},35);
	this.facility.getOutFuncs.push(function (){
	    clearInterval(self.shipBoxAnimation);
	});
	this.changeShipInfo = function (ship){
	    var infoBox = this.window.shipInfoBox;
	    var newText = "User Name:\n   " + ship.username + "\n"
		+ "Type Name:\n   " + ship.name + "\n"
		+ "Size:\n   " + ship.size + "\n";
	    infoBox.text = new PageElement("pre",this.name+"ShipInfoText",infoBox,{class:"shipInfoBoxText",text:newText});

	}
	this.changeEquipmentInfo = function (equipment){
	    var infoBox = this.window.equipmentInfoBox;
	    var newText = "Name:\n   "+ equipment.name + "\n"
		+"Type:\n   " + equipment.type + "\n"
		+"intro:" + "<p>"+ equipment.intro +"</p>"+ "\n"
		+ "";
	    infoBox.text = new PageElement("pre",this.name+"EquipmentInfoText",infoBox,{class:"equipmentInfoBoxText",text:newText});
	}
	this.ships[0].choose();

    }

    var FactoryShip = Class.sub();
    FactoryShip.prototype._init = function (bgData,service){
	if (!bgData){
	    console.error("no ship bgData");
	    return;
	}
	this.bgData = bgData;
	this.name = bgData.name;
	this.username = bgData.username;
	ptStore.shipStore.giveDataTo(this);
	
	this.service = service;
	this.window = service.window;
	this.equipments = new Array();
	
	this.setDataToTheirClass(this.shapePathArray);//let data belones to their class
	this.setDataToTheirClass(this.structurePathArray);//then they can use their methods
	
	this.fieldSize = 100/this.size;
	this.button = new PageButton(this.name+"Button",this.window.shipListBox,{class:"factoryShipButton"});
	this.button.nameText = new PageElement("p",this.button.id+"NameText",this.button,{text:this.name,class:"factoryShipNameText"});
	var self = this;
	this.button.J.click(function (){
	    self.choose();
	});
	this.button.hoverFunc = function (){
	    self.service.changeShipInfo(self);
	}
	this.button.unhoverFunc = function (){
	    self.service.changeSizeInfo(self.service.editingShip);
	}
    }
    FactoryShip.prototype.handleEquipmentEvents = function (context,offsetMouse){
	var hoverField = this.findHoverField(offsetMouse);
	if(!hoverField){
	    if(offsetMouse.pushed){
		delete this.service.editingEquipment
		this.service.canvas.mouse.pushed = false;
	    }
	    return;
	}
	
	var editingEquipment = this.service.editingEquipment;
	if(!editingEquipment){
	    hoverEquipment = this.findHoverEquipment(hoverField);
	    if(hoverEquipment){
		handleHoverEquipment.call(this);
		this.service.changeEquipmentInfo(hoverEquipment);
	    }
	    return;
	}
	
	var	editingEquipmentFieldStartPosition = {
	    x:hoverField.x - Math.round(editingEquipment.fieldData.length/2) + 1,
	    y:hoverField.y - Math.round(editingEquipment.fieldData[0].length/2) + 1
	}
	checkRequirement.call(this,editingEquipment,editingEquipmentFieldStartPosition);
	drawEquipmentField.call(this,editingEquipment,editingEquipmentFieldStartPosition);

	function handleHoverEquipment(){
	    context.fillStyle = "rgba(220,220,40,0.85)";
	    drawEquipmentField.call(this,hoverEquipment,hoverEquipment.fieldStartPosition);
	    if(offsetMouse.pushed){
		var sub = this.service.equipments.getSubscript(hoverEquipment,"name");
		if(sub >= 0){
		    this.service.equipments[sub].number ++;
		    this.service.equipments[sub].resetDisplay();
		    this.service.equipments[sub].choose();
		}
		else{
		    var newEquipment = new FactoryEquipment({name:hoverEquipment.name},hoverEquipment.service);
		    //hoverEquipment has no button
		    //so use name:hoverEquipment.name(as id) to creat one
		    newEquipment.copy(hoverEquipment);
		    delete newEquipment.installPosition;
		    delete newEquipment.fieldStartPosition;
		    newEquipment.resetDisplay();
		    this.service.equipments.push(newEquipment);
		    newEquipment.choose();
		}
		this.equipments.del(hoverEquipment,"installPosition");
		this.service.canvas.mouse.pushed = false;
	    }
	}
	function drawEquipmentField (equipment,fieldStartPosition){
	    context.save();
	    context.translate(-this.service.editingShip.width/2
			      ,-this.service.editingShip.height/2);
	    for (var i = 0; i < equipment.fieldData.length; i++){
		for (var j = 0; j < equipment.fieldData[i].length; j++){
		    var nowX = fieldStartPosition.x+i;
		    var nowY = fieldStartPosition.y+j;
		    if(this.fieldData[nowX] && this.fieldData[nowX][nowY]
		       && equipment.fieldData[i] && equipment.fieldData[i][j])
			context.fillRect(nowX * this.fieldSize,nowY * this.fieldSize,this.fieldSize,this.fieldSize);
		}
	    }
	    context.restore();
	}
	function checkRequirement(equipment,fieldStartPosition){
	    if(!equipment.checkRequirement()){
		context.fillStyle = "red";
		return;
	    }
	    context.fillStyle = "rgba(20,20,20,0.2)";
	    var fieldData = equipment.fieldData;
	    if(!fieldData){
		available.call(this,equipment);
		return;
	    };
	    for (var i = 0; i < fieldData.length; i++){
		for (var j = 0; j < fieldData[i].length; j++){
		    //check if equipment is hover in ship fields
		    if(fieldData[i][j]
		       && fieldData[i][j] != this.fieldData[fieldStartPosition.x+i][fieldStartPosition.y+j]){
			return;
		    }
		    //check if equipment conflict with installed equipments
		    for (var k = 0; k < this.equipments.length; k++){
			var nowCheckEquipment = this.equipments[k];
			for (var m=0 ; m < nowCheckEquipment.fieldData.length; m++){
 			    for (var n= 0; n < nowCheckEquipment.fieldData[m].length; n++){
				if(nowCheckEquipment.fieldData[m][n]
				   && m + nowCheckEquipment.fieldStartPosition.x == fieldStartPosition.x + i
				   && n + nowCheckEquipment.fieldStartPosition.y == fieldStartPosition.y + j){
				    return;
				}
			    }
			}
		    }
		}
	    }
	    available.call(this,equipment);
	    function available(equipment){
		context.fillStyle = "rgba(40,200,40,1)";
		if(offsetMouse.pushed){
		    this.installEquipment(equipment,hoverField);
		    this.service.canvas.mouse.pushed = false;
		}
	    }
	}
    }
    FactoryShip.prototype.installEquipment = function (choosenEquipment,position){
	var newEquipment = new FactoryEquipment({},choosenEquipment.service);
	newEquipment.button.J.hide();
	newEquipment.copy(choosenEquipment);
	newEquipment.number = 1;
	delete newEquipment.button;
	//make sure equiped equipment has no button
	newEquipment.installPosition = {
	    x:position.x,
	    y:position.y
	};
	newEquipment.fieldStartPosition = {
	    x:newEquipment.installPosition.x
		- Math.round(newEquipment.fieldData.length/2) + 1,
	    y:newEquipment.installPosition.y
		- Math.round(newEquipment.fieldData[0].length/2)+1
	};
	this.equipments.push(newEquipment);
	if(choosenEquipment.number > 1){
	    choosenEquipment.number --;
	    choosenEquipment.resetDisplay();
	}else{
	    choosenEquipment.button.J.hide();
	    this.service.equipments.del(choosenEquipment,"name");
	    delete this.service.editingEquipment;
	}
    }
    FactoryShip.prototype.setDataToTheirClass = function (arr){
	if(!arr){
	    console.error("No array data");
	    return;
	}
	for (var i = 0; i < arr.length; i++){
	    if(arr[i].center){
		arr[i] = Class.getInstence(arr[i],CirclePath);
	    }else{
		arr[i] = Class.getInstence(arr[i],Path);
		for (var j = 0; j < arr[i].pointArray.length; j++){
		    arr[i].pointArray[j] = Class.getInstence(arr[i].pointArray[j],PathPoint);
		}
	    }
	}
    }
    FactoryShip.prototype.choose = function (){
	this.service.editingShip = this;
	this.service.changeShipInfo(this);
	console.error(this.service.editingShip);
    }
    FactoryShip.prototype.draw = function (context){
	drawPath.call(this);
	context.save();
	context.translate(-this.width/2
			  ,-this.height/2);
	

	drawField.call(this);
	drawEquipment.call(this);
	context.restore();

	function drawPath(){
	    context.lineWidth = 2;
	    for (var i = 0; i < this.shapePathArray.length; i++){
		if(this.shapePathArray[i]._class == CirclePath){
		    this.shapePathArray[i].draw(context);
		}else{
		    this.shapePathArray[i].drawPath(context);
		}
	    }
	    context.lineWidth = 1;
	    for (var i = 0; i < this.structurePathArray.length; i++){
		if(this.structurePathArray[i]._class == CirclePath){
		    this.structurePathArray[i].draw(context);
		}else{
		    this.structurePathArray[i].drawPath(context);
		}
	    }
	}
	function drawField(){
	    var fieldData = this.fieldData;
	    context.lineWidth = 1.3;
	    for (var i = 0; i < fieldData.length; i++){
		for (var j = 0; j < fieldData[i].length; j++){
		    if(!fieldData[i][j]) continue;
		    switch(fieldData[i][j]){
		    case 2 :
			context.strokeStyle = "rgba(40,40,120,1)";
			context.fillStyle = "rgba(30,30,230,0.13)";
			break;
		    case 3 :
			context.strokeStyle = "rgba(120,40,40,1)";
			context.fillStyle = "rgba(220,30,30,0.13)";
			break;
		    default:
			context.strokeStyle = "gray";
			context.fillStyle = "rgba(220,220,220,0.13)";
		    }
		    context.fillRect(i*this.fieldSize,j*this.fieldSize,this.fieldSize,this.fieldSize);
		    context.strokeRect(i*this.fieldSize,j*this.fieldSize,this.fieldSize,this.fieldSize);

		}
	    }
	}
	function drawEquipment(){
	    for (var i = 0; i < this.equipments.length; i++){
		var nowEquipment = this.equipments[i];
		if(!nowEquipment.installPosition){
		    console.error(nowEquipment,"has no install position data");
		    return;
		}
		
		context.save();
		context.translate((nowEquipment.installPosition.x - Math.round(nowEquipment.fieldData.length/2) + 1)*this.fieldSize
				  ,(nowEquipment.installPosition.y - Math.round(nowEquipment.fieldData[0].length/2) + 1)*this.fieldSize);
		context.beginPath();
		context.strokeStyle="black";
		context.lineWidth = 2;
		for (var j = 0; j < nowEquipment.fieldData.length; j++){
		    for (var k = 0; k < nowEquipment.fieldData[j].length; k++){
			var nowField = nowEquipment.fieldData[j][k];
			if(!nowField)continue;
			switch(nowField){
			case 2 :
			    context.fillStyle = "rgba(30,30,230,0.7)";
			    break;
			case 3 :
			    context.fillStyle = "rgba(230,30,30,0.7)";
			    break;
			default:
			    context.fillStyle = "rgba(200,200,200,1)";
			}
			context.fillRect(j * this.fieldSize,k * this.fieldSize
					 ,this.fieldSize,this.fieldSize);
			pathOverBorderLine.call(this);
			
			function pathOverBorderLine(){
			    if(j==0||!nowEquipment.fieldData[j-1][k]){
				context.moveTo(j*this.fieldSize,k*this.fieldSize);
				context.lineTo(j*this.fieldSize,(k+1)*this.fieldSize);
			    }
			    if(j==nowEquipment.fieldData.length-1||!nowEquipment.fieldData[j+1][k]){
				context.moveTo((j+1)*this.fieldSize,k*this.fieldSize);
				context.lineTo((j+1)*this.fieldSize,(k+1)*this.fieldSize);
			    }
			    if(k==0||!nowEquipment.fieldData[j][k-1]){
				context.moveTo(j*this.fieldSize,k*this.fieldSize);
				context.lineTo((j+1)*this.fieldSize,k*this.fieldSize);
			    }
			    if(k==nowEquipment.fieldData[j].length||!nowEquipment.fieldData[j][k+1]){
				context.moveTo(j*this.fieldSize,(k+1)*this.fieldSize);
				context.lineTo((j+1)*this.fieldSize,(k+1)*this.fieldSize);
			    }
			}
		    }
		}
		context.stroke();
		context.fillStyle="black";
		context.fillText(nowEquipment.name,0,nowEquipment.fieldData[0].length/2*this.fieldSize)
		context.restore();
	    }
	}
    }
    FactoryShip.prototype.findHoverField = function (offsetMouse){
	var fieldData = this.fieldData;
	var hoverField = {};
	for (var i = 0; i < fieldData.length; i++){
	    for (var j = 0; j < fieldData[i].length; j ++){
		if(!fieldData[i][j]) continue;
		if (offsetMouse.x >= i * this.fieldSize 
		    && offsetMouse.x < (i+1) * this.fieldSize
		    && offsetMouse.y >= j * this.fieldSize
		    && offsetMouse.y < (j+1) * this.fieldSize){
		    hoverField.x = i;
		    hoverField.y = j;
		    return hoverField;
		}
	    }
	}
    }
    FactoryShip.prototype.findHoverEquipment = function (hoverField){
	for (var i = 0; i < this.equipments.length; i++){
	    var nowEquipment = this.equipments[i];
	    for (var m = 0; m < nowEquipment.fieldData.length; m ++){
		for (var n = 0; n < nowEquipment.fieldData[m].length; n++){
		    if(nowEquipment.fieldData[m][n]
		       && hoverField.x == m + nowEquipment.fieldStartPosition.x
		       && hoverField.y == n + nowEquipment.fieldStartPosition.y){
			//console.log("hover equipment",nowEquipment.name);
			return nowEquipment;
		    }
		}
	    }
	}
    }
    var FactoryEquipment = Class.sub();
    FactoryEquipment.prototype._init = function (bgData,service){
	if(!bgData){
	    console.error("no background Data")
	    return;
	}
	this.bgData = bgData
	if(bgData.name){
	    this.name = bgData.name;
	    ptStore.equipmentStore.giveDataTo(this);
	}
	else
	    this.name = "tempEquipment";
	
	if(bgData.number)
	    this.number = bgData.number;
	else this.number = 1;

	this.service = service;
	this.window = service.window;
	if(!this.fieldData){
	    switch(this.type){
	    case "Weapon" :
		this.fieldData = [[3]];
		break;
	    case "Propeller" :
		this.fieldData = [[2]];
		break;
	    default:
		this.fieldData = [[1]];
	    }
	}
	this.button = new PageButton(this.name+"Button",this.window.equipmentBox,{class:"factoryEquipmentButton"});
	this.button.J.addClass("Equipment-"+this.type);
	this.button.nameText = new PageElement("p",this.button.id+"NameText",this.button,{text:this.name,class:"factoryEquipmentNameText"});
	this.button.numberText = new PageElement("P",this.button.id+"NumberText",this.button,{text:this.number,class:"factoryEquipmentNumberText"});
	var self = this;
	this.button.J.click(function (){
	    self.choose();
	})
	this.button.hoverFunc = function (){
	    self.service.changeEquipmentInfo(self);
	}
	this.button.unhoverFunc = function (){
	    self.service.changeEquipmentInfo(self.service.editingEquipment);
	}
    }
    FactoryEquipment.prototype.resetDisplay = function (){
	this.button.numberText.J.text(this.number);
	this.button.nameText.J.text(this.name);
    }
    FactoryEquipment.prototype.choose = function (){
	this.service.editingEquipment = this;
	this.service.changeEquipmentInfo(this);
	console.log(this.service.editingEquipment);
    }
    FactoryEquipment.prototype.checkRequirement = function (){
	return true;
    }
    FactoryEquipment.prototype.draw = function (context){
	
	var fieldSize = this.service.editingShip.fieldSize;
	this.drawField(context);
	context.strokeStyle = "white";
	switch(this.type){
	case "Weapon" :
	    context.fillStyle = "rgba(230,30,30,0.7)";
	    break;
	case  "Propeller":
	    context.fillStyle = "rgba(30,30,230,0.7)";
	    break;
	default:
	    context.fillStyle = "rgba(30,30,30,0.7)";
	}
	context.fillRect(-fieldSize/2,-fieldSize/2,fieldSize,fieldSize);
	context.strokeRect(-fieldSize/2,-fieldSize/2,fieldSize,fieldSize);
	context.fillStyle = "white";
	context.fillText(this.name,-10,0);
    }
    FactoryEquipment.prototype.drawField = function (context){
	if(!this.fieldData) return;
	var fieldSize = this.service.editingShip.fieldSize;
	switch(this.type){
	case "Weapon" :
	    context.strokeStyle = "rgba(200,30,30,1)";
	    break;
	case  "Propeller":
	    context.strokeStyle = "rgba(30,30,200,1)";
	    break;
	default:
	    context.strokeStyle = "black";
	}
	context.save();
	context.translate(-Math.round(this.fieldData.length/2)*fieldSize+fieldSize/2
			  ,-Math.round(this.fieldData[0].length/2)*fieldSize + fieldSize/2);
	context.lineWidth = 1.5;
	for (var i = 0; i < this.fieldData.length; i++){
	    for (var j = 0; j < this.fieldData[i].length; j++){
		if(this.fieldData[i][j])
		    context.strokeRect(i*fieldSize,j*fieldSize,fieldSize,fieldSize);
	    }
	}
	context.restore();
    }
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
    
    var DockFacility = Class.sub();
    DockFacility.prototype._init = function (info,dock){
	if(!info) return;
	this.info = info;
	if(this.info.name)
	    this.name = this.info.name;
	else
	    this.name  = this.info.type;
	var self = this;
	this.dock = dock;
	this.interactionBox = this.dock.interactionBox;
	this.serviceBox = this.dock.serviceBox;
	this.infoBox = dock.guidBox.placeInfoBox;
	this.guidButton = new PageButton(this.name+"Button",dock.guidBox.placesBox,{class:"placeButton",text:this.name},true);
	this.getOutFuncs = new Array();
	
	this.guidButton.J.mouseover(function (){
	    var previewBox = dock.guidBox.previewBox;
	    previewBox.show(
		self.guidButton.node.offsetTop
		    + previewBox.J.height() / 2
		    + self.guidButton.J.height() / 2
	    );
	})
	this.guidButton.J.click(function (){
	    self.getIn();
	})
    }
    DockFacility.prototype.getIn = function (){
	if(this.dock.nowFacility == this){
	    console.log("already in this facility");
	    return;
	}
	var self = this
	this.interactionBox.hide(callback);
	this.serviceBox.hide();
	
	function callback(){
	    if(self.dock.nowFacility)
		self.dock.nowFacility.getOut();
	    self.getOutFuncs = new Array();
	    self.changeDisplayInfo();
	    self.registRole();
	    self.registService();
	    self.dock.nowFacility = self;
	    setTimeout(function (){
		self.interactionBox.show();
		if(self.service)
		    self.serviceBox.show();
	    },100);
	}
	
    }
    DockFacility.prototype.getOut = function (){
	for (var i = 0; i < this.getOutFuncs.length; i++){
	    this.getOutFuncs[i]();
	}
    }
    DockFacility.prototype.registService = function (){
	this.serviceBox.reset();
	if(this.dock.nowFacility && this.dock.nowFacility.nowService)
	    delete this.dock.nowFacility.nowService;
	if(!this.info.service){
	    return;
	}
	this.service = new Array();
	for(var i=0;i<this.info.service.length;i++){
	    this.service.push(new DockService(this.info.service[i],this));
	}
	this.serviceBox.serviceNum = this.service.length;
	if(this.info.welcomService){
	    this.findService(this.info.welcomService).install();
	}
    }
    DockFacility.prototype.findService = function (serviceName){
	for (var i = 0; i < this.service.length; i++){
	    if(this.service[i].info.name == serviceName)
		return this.service[i];
	}

    }
    DockFacility.prototype.registRole = function (){
	this.interactionBox.reset();
	if(this.dock.nowFacility && this.dock.nowFacility.nowRole)
	    delete this.dock.nowFacility.nowRole;
	if(!this.info.npc){
	    return;
	}
	this.npc = new Array();
	for(var i =0 ; i<this.info.npc.length ; i++)
	    this.npc.push(new DockRole(this.info.npc[i],this));
	if(this.info.welcomNpc){
	    this.findNpc(this.info.welcomNpc).install();
	    this.interactionBox.rolePicBox.J.hide();
	    this.interactionBox.diologBox.J.hide();
	}
    }
    DockFacility.prototype.changeDisplayInfo = function (){
	console.log(this);
	this.infoBox.changeInfo(this.info)
    }
    DockFacility.prototype.findNpc = function (name){
	if(!this.npc)return;
	for(var i=0 ; i<this.npc.length;i++){
	    if(this.npc[i].name == name){
		return this.npc[i];
	    }
	}
    }

    var DockRole = Class.sub();
    DockRole.prototype._init = function (name,facility){
	this.name = name;
	ptStore.npcStore.giveDataTo(this);
	console.log("get npc :"+this.name)
	this.dock = facility.dock;
	this.interactionBox = this.dock.interactionBox;
	this.facility = facility;
	this.iconButton = new PageButton(this.name+"Icon",this.dock.interactionBox.roleList,{class:"roleIcon",text:this.name},true);
	this.iconButton.handleDisplaySize(this.dock);
	var self = this;
	this.iconButton.J.click(function (){
	    self.show();
	})
	this.iconButton.defaultHeight = this.iconButton.J.height();
	this.on = false;
    }
    DockRole.prototype.install = function (){
	this.interactionBox.rolePicBox.changePic(this.pic);
	this.facility.nowRole = this;
    }
    DockRole.prototype.show = function (callback){
	if(this.facility.nowRole == this && this.dock.nowFacility == this.facility){
	    return;
	}
	var self = this;
	this.interactionBox.roleHide(function (){
	    self.install();
	    self.interactionBox.roleShow(callback);

	})
    }
    
    //onEnterStation is invoke when battleField find the user ship is enter the station
    //for test convinience,It's now auto invoke at site.js
    
    StarStationScene.prototype.onEnterStation = function(stationName){
	//If you want to see the HttpAPI implementation details of some api
	//check root/browser/api/apiname.js
	//If you want to check the jXFrame(from which HttpAPI/Widget inherit)
	//See root/browser/site/jXFrame or root/browser/jXFrame/remote(just a symlink) for details
	//Your may also enter http://yourip/day/api/getStationInfoByName?name=Nolava-I
	//to directly see the result
	
	var self = this;
	$("#battleScene").css({display:"none"});//hide the battle
	this.J = this.nodeJ;
	this.J.css({display:"block",cursor:"default"});
	this.getStationInfoByName(stationName); 
    }
    StarStationScene.prototype.init = function (responce){
	this.data = responce.data;
	console.log(responce.data);


	this.buildFacilities(this.data.facility);
	this.handleDisplaySize();
	this.prepareBoxes();
	this.changePositionTo("Factory");

    }
    StarStationScene.prototype.prepareBoxes = function (){
	this.serviceBox.shrink();
    }
    StarStationScene.prototype.handleDisplaySize = function (){
	//this.J.width(this.realWindow.width);
	//this.J.height(this.realWindow.height);
	this.defaultWindow = {
	    width:1680,
	    height:1050
	}
	this.realWindow = {
	    width:window.screen.availWidth,
	    height:window.screen.availHeight
	}
	for(var i in this){
	    if(this[i] instanceof Array){//chack all soul(service and facility)
		var arr = this[i];
		for(var j=0 ; j<arr.length;j++){
		    for (var k in arr[j]){
			if(arr[j][k].J && k!="container" && k!="dock"){
			    arr[j][k].handleDisplaySize(this);
			}
		    }
		}
	    }
	    if(this[i].J){
		this[i].handleDisplaySize(this);
	    }
	}
    }
    StarStationScene.prototype.getStationInfoByName = function (stationName){
	var self = this;
	Static.HttpAPI.getStationInfoByName(stationName,function(response){
	    if(!response.result){
		console.warn("Error fail to get station");
		return;
	    }
	    Static.waitingPage.endWaiting();
	    response.data.facility = [
		{type:"Dock"
		 ,bgPic:""
		 ,message:"Here is Nolava-I.Welcom aborad Comander"
		}
		,{type:"Clone",corporation:"GeneTech",bgPic:""
		  ,message:"Get a Clone NOW!"
		  ,npc:["Inori","Izzac"]
		  ,welcomService:"clone"
		  ,service:[{type:"clone"}
			   ]
		 }
		,{type:"Factory",bgPic:""
		  ,message:"New equipment arived,get your self armored."
		  ,npc:["Mirria"]
		  ,service:[{type:"equipmentManage"}]
		  ,welcomService:"equipmentManage"
		 }
		,{type:"Bank",bgPic:"",corporation:"BitBank"
		  ,message:"BitBank ,always by your side"
		  ,npc:["Inori"]
		  ,welcomNpc:"Inori"
		  ,service:[{type:"assetsManage"}
			    ,{type:"stock"}]
		 }
		,{type:"Market",bgPic:""
		  ,message:"welcom"
		  ,npc:["Homura","Yomi"]
		  ,welcomNpc:"Homura"
		  ,welcomService:"marketBuy"
		  ,service:[{type:"marketBuy"
			     ,goods:[{name:"apple",price:100}
				     ,{name:"banana",price:300}
				     ,{name:"orange",price:300}
				     ,{name:"watermellon",price:300}
				     ,{name:"yooooo",price:300}
				     ,{name:"sijimuri",price:300}
				     ,{name:"demasia",price:300}
				     ,{name:"yukuri",price:10000}
				    ]
			    }
			    ,{type:"marketSell"}
			    ,{type:"test1"}
			    ,{type:"test2"}]
		 }
	    ];

	    var context = self.screenNode.getContext("2d")
	    context.textAlign = "center"; 
	    context.translate(self.screenJ.width()/2,self.screenNode.height/2); 
	    //view can view other station info by console.log(response) in chrome
	    //basiclly,every HttpAPI call return a object like
	    //{result:true,data:{.. what you request ..}}
	    //or {result:false,errorCode:3,errorDiscription:"Discription for error code"};

	    //if you want to test your designs
	    //you can assume what ever data you recieved and do your jobs
	    //latter I will add what ever data you want at backend
	    context.fillText("Giyya's world here:enter station of "+response.data.name,0,0);
	    console.log(response);
	    self.init(response);
	})
    }
    StarStationScene.prototype.buildFacilities = function (facilityArray){
	this.guidBox = new DockGuidBox(this);
	this.interactionBox = new DockInteractionBox(this);
	this.serviceBox = new DockServiceBox(this);
	this.facility = new Array();
	for(var i=0;i < facilityArray.length;i++){
	    this.facility.push(new DockFacility(facilityArray[i],this));
	}
    }
    StarStationScene.prototype.changePositionTo = function (placeName){
	for(var i=0 ; i<this.facility.length;i++){
	    if(placeName == this.facility[i].name){
		this.facility[i].getIn();
		return;
	    }
	}
	console.error("can't find :"+placeName);
    }
    
    
    var DockServiceBox = PageDiv.sub();
    DockServiceBox.prototype._init = function (container){
	DockServiceBox.parent.call(this,"serviceBox",container,null,true);
	this.dock = this.container;
	this.serviceList = new PageDiv("serviceList",this);
	this.activeServiceFlag = new PageDiv("activeServiceFlag",this);
	this.activeServiceFlag.J.hide();
	this.serviceNum = 0;
	this.shrinked=false;
	this.on = false;
	this.J.hide();
	this.shrinkButton = new PageButton("serviceBoxShrinkButton",this);
	var self = this;
	this.shrinkButton.J.click(function (){
	    self.shrink();
	});
	this.J.mouseenter(function (){
	    self.dock.interactionBox.hideToBottom();
	});
    }
    DockServiceBox.prototype.shrink = function (callback){
	if(this.shrinked){
	    if(callback) callback();
	    return;
	}
	var self = this;
	
	this.J.animate({height:this.serviceList.J.height()},150,nextAnimate)
	
	function nextAnimate(){
	    self.shrinkButton.J.hide();
	    self.activeServiceFlag.J.hide();
	    if(self.window) self.window.J.hide();
	    self.J.animate({width:self.serviceNum * 100,},200,callback);
	    
	}

	if(this.dock.nowFacility && this.dock.nowFacility.nowService)
	    delete this.dock.nowFacility.nowService;
	this.shrinked = true;
    }
    DockServiceBox.prototype.enlarge = function (callback){
	if(!this.shrinked) {
	    if(callback) callback();
	    return;
	}
	var self = this;
	this.J.animate({width:this.defaultWidth},150,nextAnimate);
	function nextAnimate(){
	    if(self.window) self.window.J.show();
	    self.shrinkButton.J.show();
	    self.J.animate({height:self.defaultHeight}
			   ,200,callback);
	}
	this.shrinked = false;
    }
    DockServiceBox.prototype.reset = function (){
	this.serviceList = new PageDiv("serviceList",this);
	this.serviceNum = 0;
	this.activeServiceFlag.J.hide();
    }
    DockServiceBox.prototype.show = function (callback){
	if(this.on) return;
	this.J.width(this.serviceNum * 100);
	var self = this;
	if(this.dock.nowFacility.nowService){
	    this.J.slideDown(100,function (){
		self.enlarge(callback);				
	    });
	}else{
	    this.J.slideDown("fast");
	}
	this.on = true;
    }
    DockServiceBox.prototype.hide = function (callback){
	if(!this.on)return;
	var self = this;
	this.shrink(hideFunc);
	function hideFunc(){
	    self.J.slideUp("fast");
	}
	this.on = false;
    }
    
    var PagePicBox = PageDiv.sub();
    PagePicBox.prototype._init = function (id,container,info,ifFixed){
	PagePicBox.parent.call(this,id,container,info,ifFixed);
	this.pic = new PageElement("img",id+"Img",this,{class:"pageImage"},false);
	console.error(this.pic);
    }
    PagePicBox.prototype.changePic = function (src){
	this.pic.node.src = src;
    }
    var DockInteractionBox = PageDiv.sub();
    DockInteractionBox.prototype._init = function (container){
	DockInteractionBox.parent.call(this,"interactionBox",container,null,true);
	this.dock = this.container;
	this.rolePicBox = new PagePicBox("rolePicBox",this);
	this.roleList = new PageDiv("roleList",this,null,true);
	this.diologBox = new PageDiv("diologBox",this);
	this.diologBox.text = new PageElement("p","diologText",this.diologBox,{text:"Welcom~"});
	var self = this;
	this.J.mouseenter(function (){
	    self.showOnTop();
	})
	this.rolePicBox.J.hide();
	this.diologBox.J.hide();
	this.on = true;
    }
    DockInteractionBox.prototype.showOnTop = function (){
	console.log("diologBox on top");
	this.diologBox.J.css({zIndex:20});
    }
    DockInteractionBox.prototype.hideToBottom = function (){
	console.log("service on top");
	this.diologBox.J.css({zIndex:5});
    }
    DockInteractionBox.prototype.reset = function (){
	this.roleList = new PageDiv("roleList",this);
	this.roleList.handleDisplaySize(this.dock);
    }
    DockInteractionBox.prototype.roleHide = function (callback){
	var self = this;
	this.diologBox.J.slideUp("fast",function (){
	    self.rolePicBox.J.animate({right:-self.rolePicBox.J.width()*2},"fast",callback);			
	});
    }
    DockInteractionBox.prototype.roleShow = function (callback){
	var self = this;
	this.rolePicBox.J.show();
	this.rolePicBox.J.animate({right:0},"fast",function (){
 	    self.diologBox.J.slideDown("fast",callback);			
	});
    }
    DockInteractionBox.prototype.hide = function (callback){
	if(!this.on){
	    if(callback){
		setTimeout(callback,450);
	    }
	    return;
	}
	this.on = false;
	var self = this;
	if(this.dock.nowFacility && this.dock.nowFacility.nowRole){
	    this.rolePicBox.J.fadeOut("fast");
	    this.diologBox.J.slideUp("fast",function(){
		self.J.animate({width:0},200,function (){
		    self.J.hide(300,callback);
		})
	    })
	}else{
	    this.J.animate({width:0},200,function (){
		self.J.hide(300,callback);
	    })
	}
    }
    DockInteractionBox.prototype.show = function (callback){
	if(this.on){
	    return;
	}
	this.on = true;
	var self = this;
	this.J.show();
	if(this.dock.nowFacility && this.dock.nowFacility.nowRole){
	    this.J.animate({width:this.defaultWidth},200,function (){
		self.rolePicBox.J.fadeIn("fast");
		self.diologBox.J.slideDown("fast",callback);
	    })
	}else{
	    this.J.animate({width:this.defaultWidth},150,callback);
	}

    }
    
    //sudo mongod
    //sudo nginx
    //initialDB(optional): node root/test/createInitialDB.js
    //jXFrameWebServer: node root/browser/jXFrame/local/server.js
    //GameServer: node root/server/server.js
    exports.StarStationScene = StarStationScene;
})(exports)