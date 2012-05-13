/*var FactoryShip = Class.sub();
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
}*/