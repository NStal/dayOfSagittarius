(function(exports){
    var Static = require("./static").Static;
    var Class = require("./util").Class;
    var Util = require("./util").Util;
    var Path = require("./util").Path;
    var Point = require("./util").Point;
    var PathPoint = require("./util").PathPoint;
    var CirclePath = require("./util").CirclePath;
    var ItemEnum = require("./resource/item").ItemEnum;
    if(Static.browser)
	var Blueprint = Drawable.sub();
    else{
	var Container = require("./util").Container;
	var Blueprint = Container.sub();
    }
    Blueprint.prototype._init = function(info){
	if (!info){
	    console.error("no ship info");
	    return;
	}
	this.info = info;
	this.name = info.name;
	this.proto = Static.GRM.get(this.info.itemId);
	Util.update(this,this.proto);
	this.fieldSize = 100/this.size;
	this.equipments = [];
	if(info.equipments){
	    var tempArr = info.equipments;
	    for(var i=0,length=tempArr.length;i < length;i++){
		var item = tempArr[i];
		this.install(new Equipment(item.id),item.fieldOffset);
	    }
	}
	
	//console.log("eq",this.equipments);
	this.setDataToTheirClass(this.shapePathArray);//let data belones to their class
	this.setDataToTheirClass(this.structurePathArray);//then they can use their methods
    }
    Blueprint.prototype.setDataToTheirClass = function (arr){
	//WTF?
	if(!arr){
	    console.error("No array data");
	    return;
	}
	for (var i = 0; i < arr.length;i++){
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
    Blueprint.prototype.toEquipmentData = function(){
	var data = [];
	for(var i=0;i<this.equipments.length;i++){
	    var item = this.equipments[i];
	    data.push({
		id:item.id
		,fieldOffset:{
		    x:item.fieldOffset.x
		    ,y:item.fieldOffset.y
		}
	    });
	}
	return data;
    }
    Blueprint.prototype._drawPath = function(context){
	context.save();
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
	context.restore();
    }
    Blueprint.prototype._drawField = function(context){
	var fieldData = this.fieldData;
	context.translate(-this.width/2,-this.height/2);
	context.beginPath();
	var colorMap = {
	    1:["gray","rgba(220,220,100,0.13)"]
	    ,2:["rgba(40,40,120,1)","rgba(30,30,230,0.13)"]
	    ,3:["rgba(120,40,40,1)","rgba(220,30,30,0.13)"]
	    ,4:["rgba(10,60,220,1)","rgba(10,60,220,0.13)"]
	    ,5:["rgba(20,180,60,1)","rgba(20,180,60,0.13)"]
	};
	//change context has more expensive cost
	context.lineWidth = 1;
	for(type in colorMap){
	    context.strokeStyle = colorMap[type][0];
	    context.fillStyle = colorMap[type][1];
	    type=+type;//to int
	    for (var i = 0; i < this.fieldWidth; i++){
		for (var j = 0; j < this.fieldHeight; j++){
		    if(type==this.fieldData[i+j*this.fieldWidth]){
			context.fillRect(i*this.fieldSize+1,j*this.fieldSize+1,this.fieldSize-2,this.fieldSize-2);
			context.strokeRect(i*this.fieldSize+1,j*this.fieldSize+1,this.fieldSize-2,this.fieldSize-2); 
		    }
		}
	    }
	}
	
    }
    Blueprint.prototype._drawShadow = function(context){
	if(!this.shadow)return;
	var shadowShape = this.shadow;
	var position = shadowShape.position;
	var w = shadowShape.width;
	var h = shadowShape.height;
	var arr = shadowShape;
	context.beginPath();
	context.fillStyle = "rgba(0,0,0,0.4)";
	for(var i=0;i < w;i++){
	    for(var j=0;j < h;j++){
		var item = arr[j*w+i];
		if(item){
		    context.fillRect(this.fieldSize*(position.x+i),this.fieldSize*(position.y+j)
				     ,this.fieldSize,this.fieldSize);
		}	
	    }
	}
    }
    
    Blueprint.prototype._drawHighLight = function(context){
	if(!this.highLight)return; 
	var highLightShape = this.highLight;
	var position = highLightShape.position;
	var w = highLightShape.width;
	var h = highLightShape.height;
	var arr = highLightShape;
	context.beginPath();
	context.fillStyle = "rgba(10,200,60,0.8)";
	for(var i=0;i < w;i++){
	    for(var j=0;j < h;j++){
		var item = arr[j*w+i];
		if(item){
		    context.fillRect(this.fieldSize*(position.x+i),this.fieldSize*(position.y+j)
				     ,this.fieldSize,this.fieldSize);
		}	
	    }
	}
    }
    Blueprint.prototype.shadowAt = function(position,shadowShape){
	this.shadow = shadowShape;
	if(!this.shadow)return;
	this.shadow.position = position;
    }
    Blueprint.prototype.highLightAt = function(position,highLightShape){
	this.highLight = highLightShape;
	if(!this.highLight)return;
	this.highLight.position = position;
    }
    Blueprint.prototype._drawEquipments = function(context){
	var tempArr = this.equipments;
	context.save();
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    this._drawEquipment(context,item);
	}
	context.restore();
    }
    Blueprint.prototype._drawEquipment = function(context,eq){
	context.save();
	context.translate(eq.fieldOffset.x*this.fieldSize
			  ,eq.fieldOffset.y*this.fieldSize);
	eq.onDraw(context);
	context.restore();
    }
    Blueprint.prototype.onDraw = function (context){
	this._drawPath(context);
	this._drawField(context);
	this._drawEquipments(context);
	this._drawShadow(context);
	this._drawHighLight(context);
    }
    Blueprint.prototype.findHoverField = function (offsetMouse){
	var fieldData = this.fieldData;
	var hoverField = {};
	this.fieldSize = this.fieldSize;
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
    Blueprint.prototype.screenToBitmap = function(screen,point){
	//NOTE here we prefer to point reference to prevent extra memory GC
	//rather than to create one
	//screen here means the shipdisplay canvas
	var leftPadding = (screen.width-this.width)/2;
	var topPadding = (screen.height-this.height)/2;
	var fieldSize = this.fieldSize;
	point.x-=leftPadding
	point.x = Math.floor(point.x/fieldSize); 
	point.y-=topPadding
	point.y = Math.floor(point.y/fieldSize);
	console.log(point.toString());
	return point;
    }
    Blueprint.prototype.isArchitectureValid = function(){
	var tempArr = this.equipments;
	var fieldData = this.fieldData.slice(0);
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    var data = item.fieldData;
	    var ew = item.fieldWidth;
	    var eh = item.fieldHeight;
	    var pos = item.fieldOffset;
	    if(pos.x<0||pos.x+ew>this.fieldWidth
	       || pos.y<0||pos.y+eh>this.fieldHeight){
		return false;
	    } 
	    //Algorithm here has some problems
	    //In some extreme case,will pass a invalid equipment
	    //But in fact no equipment will look that wired
	    //so current version it's just OK
	    for(var x=0;x<ew;x++){
		for(var y=0;y<eh;y++){
		    if(data[x+y*ew] != fieldData[pos.x+x
						 +this.fieldWidth*(pos.y+y)]){
			//not achieve the requirement for current equipment
			return false;
		    } 
		    //achieve and swap the ocupied space
		    fieldData[pos.x+x 
			      +this.fieldWidth*(pos.y+y)] = 0;
		}
	    }
	} 
	return true;
    }
    Blueprint.prototype.isEquipmentValidAt = function(equipment,position){
	var fieldData = this.fieldData.slice();//copy
	var eqData = equipment.fieldData;
	var eqWidth = equipment.fieldWidth;
	var eqHeight = equipment.fieldHeight;
	if(position.x<0||position.x+eqWidth>this.fieldWidth
	   || position.y<0||position.y+eqHeight>this.fieldHeight){
	    //out of ship
	    return false;
	}
	var tempArr = this.equipments;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    var data = item.fieldData;
	    var ew = item.fieldWidth;
	    var eh = item.fieldHeight;
	    var pos = item.fieldOffset;
	    for(var x=0;x<ew;x++){
		for(var y=0;y<eh;y++){
		    if(data[x+y*ew]){
			//equipments should be validated so
			//we don't validate again
			fieldData[pos.x+x
				  +this.fieldWidth*(pos.y+y)] = 0;
		    }
		}
	    }
	}
	for(var x=0;x<eqWidth;x++){
	    for(var y=0;y<eqHeight;y++){
		//if this block need space
		if(eqData[x+y*eqWidth]
		   && eqData[x+y*eqWidth] != 
		   fieldData[position.x+x
			     +this.fieldWidth*(position.y+y)]){
		    return false;
		}
	    }
	}
	return true;
    }
    Blueprint.prototype.getEquipmentByPosition = function(position){
	var tempArr = this.equipments;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    var p = position.sub(item.fieldOffset);
	    if(p.x<0||p.y<0||p.x>=item.fieldWidth||p.y>=item.fieldHeight){
		continue;
	    }
	    if(item.fieldData[p.x+p.y*item.fieldWidth]!=0){
		return item;
	    } 
	}
	return null;
    }
    Blueprint.prototype.uninstall = function(eq){
	for(var i=0;i<this.equipments.length;i++){
	    var item = this.equipments[i]
	    if(item===eq){
		this.equipments.splice(i,1);
		return eq;
	    }
	}
	return null;
    }
    Blueprint.prototype.install = function (eq,position){
	eq.fieldSize = this.fieldSize;
	eq.fieldOffset = position;
	this.equipments.push(eq);
    }
    var Equipment = Class.sub();
    Equipment.prototype._init = function(itemId){
	//currently info is a struct
	//{id:n,count:m}
	this.id = itemId; 
	var proto = Static.GRM.get(itemId);;
	this.proto = proto;
	if(!proto){
	    console.error("no equipment of id",itemId);
	    console.trace();
	    return;
	}
	if(proto.type!=ItemEnum.module){
	    console.error("id of",itemId,"is not a module");
	    console.trace();
	    return;
	}
	Util.update(this,proto); 
	if(!this.fieldData){
	    switch(this.subType){
	    case ItemEnum.weapon:
		this.fieldData = [3];
		break;
	    case ItemEnum.propoller :
		this.fieldData = [2];
		break;
	    default:
		this.fieldData = [1];
	    }
	    this.fieldWidth = 1;
	    this.fieldHeight = 1;
	}
    }
    Equipment.prototype.checkRequirement = function(){
	return true;//what to do?
    }
    Equipment.prototype.onDraw = function(context){
	var eq = this;
	var colorMap = {
	    1:["gray","rgba(220,220,100,0.8)"]
	    ,2:["rgba(40,40,120,1)","rgba(30,30,230,0.7)"]
	    ,3:["rgba(120,40,40,1)","rgba(220,30,30,0.7)"]
	    ,4:["rgba(10,60,220,1)","rgba(10,60,220,0.7)"]
	    ,5:["rgba(20,180,60,1)","rgba(20,180,60,0.7)"]
	};
	//change context has more expensive cost
	context.lineWidth = 1;
	context.beginPath();
	for(type in colorMap){
	    context.strokeStyle = colorMap[type][0];
	    context.fillStyle = colorMap[type][1];
	    type=+type;//to int 
	    for (var i = 0; i < eq.fieldWidth; i++){
		for (var j = 0; j < eq.fieldHeight; j++){
		    if(type==eq.fieldData[i+j*eq.fieldWidth]){
			context.fillRect(i*this.fieldSize+1,j*this.fieldSize+1,this.fieldSize-2,this.fieldSize-2);
			context.strokeRect(i*this.fieldSize+1,j*this.fieldSize+1,this.fieldSize-2,this.fieldSize-2); 
		    }
		}
	    }
	}
    }
    
    exports.Equipment = Equipment;
    exports.Blueprint = Blueprint;
})(exports)