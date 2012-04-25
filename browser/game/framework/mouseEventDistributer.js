(function(exports){
    var EventEmitter = require("../share/util").EventEmitter;
    var MouseEventDistributer = EventEmitter.sub();
    MouseEventDistributer.prototype._init = function(target){
	this.target = target;
    }
    MouseEventDistributer.prototype.distribute = function(event,cordinates,lastCordinate){
	var consumer = this._distribute(event,this.target,cordinates,lastCordinate);
	return consumer;
    }
    MouseEventDistributer.prototype._distribute = function(eventType,object,cordinates,lastCordinate){
	if(object && object.position){
	    if(object.parts && object.parts.length>0){
		var subCor = new Point(cordinates);
		subCor.x-=object.position.x;
		subCor.y-=object.position.y;
		var lastSubCor;
		if(lastCordinate){
		    lastSubCor = new Point(lastCordinate);
		    lastSubCor.x -=object.position.x;
		    lastSubCor.y -=object.position.y;
		} 
		for(var length=object.parts.length,i=length;i >=0;i--){
		    var item = object.parts[i];
		    var _result = this._distribute(eventType,item,subCor,lastSubCor);
		    //event consume by child
		    if(_result)return true;
		}
		//event didn't consume by children
	    }
	    //can consume by this object?
	    if(object.rectJudgement){
		var result = object.rectJudgement(cordinates,lastCordinate);
	    }
	    else{
		//console.log("result,",result)
		var result = false;
	    } 
	    if(object.consumeType && object.consumeType[eventType] && result){
		var blockInfo = object.emit(eventType,cordinates);
		return blockInfo;
	    }
	}
	return false;
    }
    MouseEventConsumer = EventEmitter.sub();
    MouseEventConsumer.mixin = function(_Class){
	for(var item in MouseEventConsumer.prototype){
	    if(item!="_init"){
		_Class.prototype[item]  = MouseEventConsumer.prototype[item];
	    }
	}
	if(_Class.prototype._init){
	    var oldInt = _Class.prototype._init;
	    _Class.prototype._init = function(){
		MouseEventConsumer.prototype._init.call(this);
		this.mouseReactSize = 9999;
		oldInt.apply(this,arguments);
	    }
	}
    }
    MouseEventConsumer.prototype._init = function(){
	this.consumeType = {};
    }
    MouseEventConsumer.prototype.responseToMouseEvent = true;
    MouseEventConsumer.prototype.rectJudgement = function(cordinates,lastCordinate){
	//if only cordinates provide
	//result should be true if cordinated are in reactRegion
	//if lastCordinate are provide as well
	//result should be true only  lastCordinate are not in reactResion but cordinated are
	if(this.rectJudgementCustom)return this.rectJudgementCustom(cordinates,lastCordinate);
	if(!this.position)return false;
	if(typeof this.mouseReactSize!="number")return false;
	var cordinates = cordinates.sub(this.position);
	var result = Math.abs(cordinates.x) < this.mouseReactSize && Math.abs(cordinates.y)<this.mouseReactSize;
	if(!lastCordinate)return result;
	//has lastCordinate 
	var cordinates = lastCordinate.sub(this.position);
	return !result && (Math.abs(cordinates.x) < this.mouseReactSize && Math.abs(cordinates.y)<this.mouseReactSize);
    }
 exports.MouseEventDistributer = MouseEventDistributer;
 exports.MouseEventConsumer = MouseEventConsumer;
})(exports)