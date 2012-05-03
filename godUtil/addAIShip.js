var addShipsAtGalaxy = require("./godUtil").addShipsAtGalaxy;
var name = process.argv[2]
var count = process.argv[3];
//to number
if(!name){
    console.log("no galaxy name provide");
    console.log("exit");
    process.kill();
}
if(typeof count!="number"){
    console.log("no count set,default one");
    count = 1;
}else{
    count = count-0;
}
var getShipTemplate = function(){
    return {
	name:"name"
	,owner:"AI"
	,pilot:"AI"
	,cordinates:{x:100,y:100}
	,category:0
	,ability:{
	    maxSpeed:25
	    ,structure:10000
	    ,maxRotateSpeed:0.2
	    ,speedFactor:0.8
	    ,cpu:10
	    ,size:18
	    ,curveForwarding:true
	}
	,modules:[]
	,reward:5200
	,action:{
	    rotateFix:0
	    ,speedFix:0
	}
	,physicsState:{
	    toward:0
	}
    };
}
var ships = [];
for(var i=0,length=count;i < length;i++){
    var ship = getShipTemplate();
    ship.cordinates.x = Math.random()*1000;
    ship.cordinates.y = Math.random()*800;
    ships.push(ship);
}
addShipsAtGalaxy(name,ships,function(){
    console.log("done");
    process.kill();
});