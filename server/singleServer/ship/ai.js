(function(exports){
    var Instance = require("../gameUtil").GameInstance;
    var AI = Instance.sub();
    var Point = require("../util").Point;
    var sylvester = require("sylvester");
    //AI holds ship's intention which is decided by user 
    //instruction
    AI.prototype._init = function(ship){
	if(!ship)return;
	this.rate = ship.ability.cpu;
	this.ship = ship;
	this.destination = {};
    }
    AI.prototype.calculate = function(){
	if(this.destination.target){
	    if(this.destination.target.state.structure<=0){
		this.destination.target = null;
	    }
	}
	if(this.destination.roundRoute){

	    this._adjustRoundAt(this.destination.roundRoute.point,
				this.destination.roundRoute.radius,
				this.destination.roundRoute.antiClockWise);
	}
	if(this.destination.targetPoint){
	    this._adjustToPoint(this.destination.targetPoint);
	}
    }
    AI.prototype.next = function(){
	//donothing currently
	//position judgement should be done by battleField
    }
    //how
    AI.prototype.clearDestination = function(){
        this.destination = {};
    }
    AI.prototype.start = function(){
	this.rate = this.ship.state.cpu;
	AI.parent.prototype.start.call(this);
    }
    AI.prototype._adjustToPoint = function(targetPoint){
	var targetPoint = new Point(targetPoint);
	var ship = this.ship;
	ship.action.speedFix = 0;
	ship.action.rotateFix = 0;
	var size = ship.state.size?ship.state.size/2:2;
	if(ship.cordinates.distance(targetPoint)<size){
	    return true;
	}
	//rotate?
	var clockWise = 0;
	var rad= targetPoint.sub(ship.cordinates).rad();    
	
	
	if(!Math.floatEqual(rad,
			    ship.toward)){
	    //need rotate
	    var rdistance = Math.radSub(ship.physicsState.toward,rad);
	    
	    if(rdistance>0){
		clockWise = 1;
	    }else{
		clockWise = -1;
	    }
	    var rotateSpeed = (1-ship.state.speedFactor)*ship.state.maxRotateSpeed;
	    
	    if(Math.abs(rdistance) > rotateSpeed){
		ship.action.rotateFix = 1* clockWise; 
	    }else{

		ship.action.rotateFix = clockWise * rdistance/rotateSpeed; 
	    } 

	    //big ship cant curve-forwarding
	    if(!this.ship.state.curveForwarding)return false;
	}
	var distance = targetPoint.distance(ship.cordinates);
	var speed = (1-ship.state.speedFactor)*ship.state.maxSpeed;

	if(distance>speed){
	    ship.action.speedFix = 1;
	}else{
	    ship.action.speedFix = distance/speed;
	}
	return false;
    }

    //how
    AI.prototype._adjustRoundAtCurrentRoute = function(r,antiClockWise){
	//set distance to default if no distance specified
	//notion,if the rotateSpeed and current speed is not enough to
	//keep ship round at the distance, the real distance may change
	var ship = this.ship;
	var v = ship.ability.speed*0.8;
	var w = v/r;
	var rad = ship.cordinates.sub(point).rad();
	var rdistance = Math.radSub(ship.toward,rad);
	var clockWise = 0;
	//always clockWise at current version;
	if(antiClockWise)clockWise = -1;
	else clockWise = 1;
	rdistance = Math.abs(rdistance)-(Math.PI/2);
	var rotateFix = w/ship.ability.rotateSpeed*clockWise;
	if(rotateFix>1)rotateFix=1;
	if(rotateFix<-1)rotateFix=-1;
	ship.action.rotateFix = rotateFix;
	var speedFix = 0.8;
	return;
    }
    //how
    AI.prototype._adjustRoundAt = function(point,r,antiClockWise){
	//using matrix to calculate the rotate;
	if(antiClockWise)clockWise = -1;
	else clockWise = 1;
	var size = this.ship.state.size?this.ship.state.size/2:this.ship.state.maxSpeed*2;
	var x=size;
	var y=Math.sqrt(r*r-x*x);
	var posMatrix = $M([[x*clockWise],[y],[1]]);
	var rad =  this.ship.cordinates.sub(point).rad();
	var cosr = Math.cos(rad);
	var sinr = Math.sin(rad);
	var rotateMatrix = $M([[cosr,sinr,0]
			       ,[-sinr,cosr,0]
			       ,[0,0,1]]);
	var realMatrix = rotateMatrix.x(posMatrix);
	var x = realMatrix.row(2).e(1);
	var y = realMatrix.row(1).e(1);
	var pos = new Point(point.x+x,point.y+y);
	this.destination.targetPoint = pos;
	
    }

    //intent
    AI.prototype.standBy = function(){
	this.destination.targetPoint = new Point(this.ship.cordinates);
	return;
    }

    //intent
    AI.prototype.moveTo = function(targetPoint){
	this.destination.roundRoute = null;
	this.destination.targetPoint = targetPoint;
    }
    AI.prototype.roundAt =function(p,r,antiClockWise){
	this.destination.roundRoute = {point:p
				       ,radius:r
				       ,antiClockWise:antiClockWise};
    }
    AI.prototype.toData = function(){
	var data = {
	    destination:{
		targetPoint:this.destination.targetPoint
		,roundRoute:this.destination.roundRoute
		,target:this.destination.target?this.destination.target.id:null
	    }
	}
	return data;
    }
    exports.AI = AI;
})(exports)