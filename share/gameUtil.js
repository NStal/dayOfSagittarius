(function(exports){
    var Instance = require("./util").Instance;
    var GameInstance = Instance.sub();
    var settings = {rate:30};
    //GameInstance is a simulated thread
    //that recieve nextTickEvent from game loop
    //to simulate multi-thread performance
    GameInstance.instances = [];
    GameInstance.setTickPerUnitTime = function(rate){
	this.tickPerUnitTime = rate;
	settings.rate = rate;
    }
    GameInstance.tickPerUnitTime = settings.rate;
    GameInstance.add = function(){
	for(var i=0;i<arguments.length;i++){
	    this.instances.push(arguments[i]);
	    arguments[i].isActive = true;
	}
    }
    GameInstance.remove = function(item){
	for(var i=0;i<this.instances.length;i++){
	    if(this.instances[i] === item){
		this.instances.splice(i,1);
		item.isActive = false;
		return true;
	    }
	}
	return false;
    }
    GameInstance.nextTick = function(){
	for(var i=0;i<this.instances.length;i++){
	    this.instances[i].nextTick();
	} 
    }
    GameInstance.prototype._init = function(){
	this.isPause = false;
	this.coolDown = GameInstance.tickPerUnitTime/this.rate;
	this.tickIndex = 0;
	this.isActive = false;//Is in instances pool?
	this.rate = GameInstance.tickPerUnitTime;
    }
    GameInstance.prototype.setRate = function(rate){
	if(typeof rate != "undefined")this.rate = rate;
	this.coolDown = GameInstance.tickPerUnitTime/this.rate;
    }
    //start add this instance to GameInstace.instances
    //thus recieve the nextTickEvent
    //Is 
    GameInstance.prototype.start = function(){
	this.setRate(this.rate);
	if(this.isPause){
	    this.isPause = false;
	    return;
	}
	if(!this.isActive){
	    GameInstance.add(this);
	}
	else{
	    console.log("start a instance that is already running");
	    console.trace();
	}
    }
    GameInstance.prototype.nextTick = function(){
	if(this.isPause)return;
	this.tickIndex++;
	if(this.tickIndex >= this.coolDown){
	    this.tickIndex -=this.coolDown;
	    if(this.next){
		if(this.next()===false){
		    this.stop();
		}
	    }
	}
    }
    //stop remove this instance from GameInstance.instances
    GameInstance.prototype.stop = function(){
	if(this.isActive)GameInstance.remove(this);
    }
    GameInstance.prototype.pause = function(){
	this.isPause = true;
    }
    //*****************************
    //Note: this is tricky
    //Over write the default Instance
    //RawInstance = Instance;
    //Instance = GameInstance;
    //*****************************
    exports.GameInstance = GameInstance;
})(exports)
