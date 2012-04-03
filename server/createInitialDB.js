var mongodb = require("mongodb");
var server =new mongodb.Server("localhost"
			       ,27017
			       ,{});
var connector = new mongodb.Db("dayOfSagittarius"
			       ,server
			       ,{});
var galaxyInfoInserters = {
    "Nolava":function(col){
	for(var i=0;i<3;i++){
	    var ship = {
		name:"ship"+i
		,owner:"nstal"
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
		,modules:[0]
		,reward:1200
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
