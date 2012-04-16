var mongodb = require("mongodb");
var server =new mongodb.Server("localhost"
			       ,27017
			       ,{});
var connector = new mongodb.Db("dayOfSagittarius"
			       ,server
			       ,{});
var getShipTemplate = function(){
    return {
	name:"name"
	,owner:"AI"
	,cordinates:{x:100,y:100}
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
	,modules:[]
	,reward:1200
	,action:{
	    rotateFix:0
	    ,speedFix:0
	}
	,physicsState:{
	    toward:0
	}
    };
}
var galaxyInfoInserters = {
	"Nolava":function(col){
	    col.remove();
	    //main ship for AI
	    var ship = getShipTemplate();
	    ship.owner = "AI";
	    ship.name = "AI CommandorShip";
	    ship.pilot = "AI"+Math.floor(Math.random()*1000);
	    ship.ability.maxSpeed = 4;
	    //Equiped with 1 Missile 2 Cannon 2 Beam
	    ship.modules.push(2,2,2,0,0,1,1);
	    col.insert(ship);
	    //main ship for "nstal"
	    ship = getShipTemplate();
	    ship.owner = "nstal";
	    ship.pilot = "nstal";
	    ship.name = "nstal CommandorShip";
	    ship.modules.push(2,2,2);
	    ship.cordinates = {x:500,y:500};
	    col.insert(ship);
	}
    ,"Evy":function(col){
	for(var i=0;i<5;i++){
	    var ship = {
		name:"ship"+i
		,owner:"giyya"
		,cordinates:{x:100,y:100}
		,category:0
		,reward:1000
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
	    col.insert(ship);
	}
    }
}
var StarStations = [{
    name:"Nolava-I"
    ,position:{x:900,y:500}
    ,ships:[]
}];
connector.open(function(err,db){
    if(err || !db){
	console.log(err);
	console.warn("fail to connected");
	return;
    }
    for(var item in galaxyInfoInserters){
	//galaxy collection should be
	//galaxy_name
	db.collection("galaxy_"+item,function(err,col){
	    if(err || !col){
		console.warn("fail to get collection");
		return;
	    }
	    galaxyInfoInserters[item](col);
	});
    }
    db.collection("SystemInfo",function(err,col){
	if(err || !col){
	    console.trace();
	    console.warn("fail to get collection");
	    return;
	}
	//dosomething to init system info
	process.kill();
    })
})

