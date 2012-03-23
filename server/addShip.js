var ship = {
    name:"ship"+i
    ,cordinates:{x:100,y:100}
    ,id:i
    ,category:0
    ,ability:{
	maxSpeed:8
	,structure:10000
	,maxRotateSpeed:0.2
	,speedFactor:0.8
	,cpu:10
	,size:18
	,curveForwarding:true
    }
    ,modules:[0]
    ,action:{
	rotateFix:0
	,speedFix:0
    }
    ,physicsState:{
	toward:0
    } 
};
var name = process.argv[2];
var id = process.argv[3];
if(!id){
    console.log("need a id!");
    process.kill();
}
ship.id = id;
var gs = require("./singleServer/resource/galaxies").GALAXIES;
var g = null;
for(var i=0;i < gs.length;i++){
    if(gs[i].name==name){
	g = gs[i];
    }
}
if(!g){
    console.log("invalid galaxy");
    process.kill();
}
var gInfo = g;
var sock = new (require("ws"))("ws://"+gInfo.server.host+":"+gInfo.server.port);
sock.on("open",function(){
    sock.send(JSON.stringify({
	cmd:7
	,data:{
	    ship:ship
	    ,from:"god"
	}
    })); 
    console.log("done");
    process.kill();
})


