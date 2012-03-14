(function(exports){
    var defineType = {
	sequence:"_seq_"   //instruct sequence in game
	,point:"_point_"   // {x,y}
	,round:"_round_"   //{point,radius,antiClockWise}
	,time:"_time_"     //global clock
    }
    instructions = {
	moveTo:0
	,roundAt:1
	,targetAt:2
    }
    request = {
	s:defineType.sequence  // s=0 meas request sync
	,c:instructions.moveTo
	,p:defineType.point
    }
    clientCommand = {
	instruction:0
	,sync:1
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