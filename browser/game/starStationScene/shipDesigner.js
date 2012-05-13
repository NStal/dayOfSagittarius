(function(exports){
    var ShipDesigner = Drawable.sub();
    EventEmitter.mixin(ShipDesigner);
    ShipDesigner.prototype._init = function(equipmentsJ,canvas){
	var self = this;
	this.equipmentsJ = equipmentsJ;
	size = 20;
	this.size = size;
	this.canvas = canvas;
	this.instance = new Instance(); 
	//set instance rate;
	//30frame persecond;
	this.instance.setRate(30); 
	this.instance.next = function(){
	    self.next();
	}
	this.canvas.onmousemove = function(e){
	    if(typeof e.offsetX == "number"){
		self.mouse.x = e.offsetX;
		self.mouse.y = e.offsetY; 
	    }else{
		self.mouse.x = e.layerX;
		self.mouse.y = e.layerY;
	    }
	    //console.log(self.mouse);
	}
	this.canvas.onmousedown = function(e){
	    if(e.button == 2){
		self.mouse.rightMousedown = true;
		return;
	    }
	    self.mouse.mousedown = true; 
	} 
	this.canvas.onmouseup = function(e){
	    self.mouse.mousedown = false; 
	    self.mouse.rightMousedown = false
	}
	
	this.mouse = new Point(0,0);
	//store the editable equipments on the left side
	this.equipments = [];
	//add ship to drawing tree
    }
    ShipDesigner.prototype.resize = function(width,height){
	if(this.blueprint){
	    this.blueprint.position.x = this.canvas.width/2;
	    this.blueprint.position.y = this.canvas.height/2; 
	}
    }
    ShipDesigner.prototype.start = function(){
	this.instance.start();
    }
    ShipDesigner.prototype.stop = function(){
	this.instance.stop();
    }
    ShipDesigner.prototype.workOn = function(ship){
	this.ship = ship; 
	if(this.blueprint){
	    this.remove(this.blueprint);
	}
	//end test
	this.blueprint = new Blueprint(ship);
	this.blueprint.position.x = this.canvas.width/2;
	this.blueprint.position.y = this.canvas.height/2;
	this.add(this.blueprint);
	this.fieldSize = 100/this.blueprint.size;
	this._loadEquipments(ship);
    }
    //load modules of the ship.cagos into the left side equipment list
    ShipDesigner.prototype._loadEquipments = function(ship){
	//merge cagos 
	var equipmentsInfo = []; 
	var tempArr = ship.cagos;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    var has = false;
	    for(var j=0,_length=equipmentsInfo.length;j < _length;j++){
		var _item = equipmentsInfo[j];
		console.log(_item,item);
		if(_item.id==item){
		    _item.count++;
		    has = true;
		    break;
		}
	    }
	    
	    if(!has){
		equipmentsInfo.push({
		    id:item
		    ,count:1
		})
	    }
	} 
	var tempArr = equipmentsInfo;
	var self = this;
	//clear equipments
	this.equipments.length = 0;
	this.equipmentsJ.empty();
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    this._addEquipmentByInfo(item);
	}
    }
    ShipDesigner.prototype._addEquipmentByInfo = function(info){
	//info == {id:n,count:m};
	var self = this;
	var eq= {
	    equipment: new Equipment(info.id)
	    ,count:info.count
	}
	eq.equipment.fieldSize = this.blueprint.fieldSize;
	eq.button = this._createEquipmentButton(eq);
	this.equipments.push(eq);
	this.equipmentsJ.append(eq.button.nodeJ);
    }
    ShipDesigner.prototype._createEquipmentButton = function(eq){
	var btn = new Widget(Static.template.equipment);
	btn.nameJ.text(eq.equipment.name);
	btn.countJ.text(eq.count);
	var self = this;
	btn.nodeJ.click(function(){
	    self.changeEquipment(eq.equipment);
	})
	return btn;
    }
    ShipDesigner.prototype.unconsume = function(itemId){
	var tempArr = this.equipments;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(item.equipment.id==itemId){
		item.count++;
		item.button.countJ.text(item.count);
		return item;
	    }
	    
	}
	var eq = {
	    equipment:new Equipment(itemId)
	    ,count:1
	};
	eq.equipment.fieldSize = this.blueprint.fieldSize;
	eq.button = this._createEquipmentButton(eq);
	this.equipments.push(eq);
	this.equipmentsJ.append(eq.button.nodeJ);
	return eq;
    } 
    ShipDesigner.prototype.consume = function(itemId){
	var tempArr = this.equipments;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(item.equipment.id==itemId){
		item.count--;
		if(item.count==0){
		    item.button.nodeJ.remove();
		    tempArr.splice(i,1);
		    
		    if(this.editingEquipment == item.equipment){
			this.changeEquipment(null);
		    }
		    return item;
		}
		item.button.countJ.text(item.count);
		return item;
	    } 
	}
	return null;
    }
    ShipDesigner.prototype.changeEquipment = function(eq){
	if(this.editingEquipment){
	    this.remove(this.editingEquipment);
	} 
	this.editingEquipment = eq;
	if(!eq)return;
	eq.center = Point.Point(this.fieldSize*eq.fieldWidth/2
			      ,this.fieldSize*eq.fieldHeight/2);
	eq.position = this.mouse;
	this.add(eq);
    }
    //Instance Loop
    ShipDesigner.prototype.next = function(){
	this.handleEvent();//handle mouse event
	var context = this.canvas.getContext("2d"); 
	context.clearRect(0,0,this.canvas.width,this.canvas.height); 
	
	if(this.editingEquipment){
	    var p = Point.Point(this.mouse);
	    this.blueprint.screenToBitmap(this.canvas,p);
	    var eq = this.editingEquipment; 
	    
	    var shape = eq.fieldData;
	    shape.width = eq.fieldWidth;
	    shape.height = eq.fieldHeight; 
	    p.x -=Math.floor(shape.width/2);
	    p.y -= Math.floor(shape.height/2); 
	    if(this.blueprint.isEquipmentValidAt(eq,p)){
		//clearShadow
		this.blueprint.shadowAt();
		this.blueprint.highLightAt(p,shape);
	    }else{
		this.blueprint.shadowAt(p,shape);
		this.blueprint.highLightAt();
	    }
	}else{
	    //clear shadow
	    this.blueprint.shadowAt();
	}
	this.draw(context);
    }
    ShipDesigner.prototype.handleEvent = function(){
	if(this.mouse.rightMousedown){
	    this.changeEquipment(null);
	    return;
	}
	if(this.mouse.mousedown){
	    this.mouse.mousedown = false; 
	    var p = Point.Point(this.mouse);
	    this.blueprint.screenToBitmap(this.canvas,p);
	    var eq = this.editingEquipment; 
	    if(eq){
		var shape = eq.fieldData;
		shape.width = eq.fieldWidth;
		shape.height = eq.fieldHeight; 
		p.x -=Math.floor(shape.width/2);
		p.y -= Math.floor(shape.height/2); 
		if(this.blueprint.isEquipmentValidAt(eq,p)){
		    var newEq = new Equipment(eq.id);
		    this.blueprint.install(newEq,p);
		    //clear highlight
		    this.blueprint.highLightAt(null);
		    this.consume(eq.id);
		}
	    }else{
		var item = this.blueprint.getEquipmentByPosition(p);
		if(item){
		    this.blueprint.uninstall(item);
		    this.unconsume(item.id);;
		}
	    }
	}
	
    } 
    exports.ShipDesigner = ShipDesigner;
})(exports)