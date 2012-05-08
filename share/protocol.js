(function(exports){
    //This module is still in design
    //It's design purpose is to give 
    //convinience to the Server Client Communication
    var defineType = {
	sequence:"_seq_"   //instruct sequence in game
	,point:"_point_"   // {x,y}
	,round:"_round_"   //{point,radius,antiClockWise}
	,time:"_time_"     //global clock
    }
    instructions = {
	moveTo:0
	,roundAt:1
	,lockTarget:2
    }
    request = {
	s:defineType.sequence  // s=0 meas request sync
	,c:instructions.moveTo
	,p:defineType.point
    }
    clientCommand = {
	sync:1
	,moveTo:2
	,roundAt:3
	,lockTarget:4
	,activeModule:5
	,passStarGate:6
	,chaseTarget:8
	,roundAtTarget:9
	,setDockStation:10
	,GOD_removeShip:11
	,GOD_enterShip:12
	,GOD_shipDocked:13
	,setModuleTarget:14
	,jumpTo:15 
	,GOD_shipJumped:16
    }
    response = {
	t:defineType.time      // t=0 meas need initial sync
	,s:defineType.sequence  //s=0 meas contain data ,else mease approve at seq
	,data:null             //
    }
    responseInfo = {
	reply:0   //instruction accept at when?
	,data:1   //sync data or init data
    }
    exports.clientOutdate = {
	t:0
    }
    exports.clientCommand = clientCommand;
})(exports)