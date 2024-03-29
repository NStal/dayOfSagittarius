(function(exports){
    var GALAXIES = [{
	name:"Nolava"
	,color:"black"
	,position:{x:300,y:400}
	,size:24
	,to:["Evy","Lerum"]
	,server:{
	    host:"115.156.219.166"
	    ,localport:20000
	    ,port:10000
	}
    },{
	name:"Evy"
	,color:"black"
	,position:{x:100,y:300}
	,size:15
	,to:["Xepia","Nolava"]
	,server:{
	    host:"115.156.219.166"
	    ,localport:20001
	    ,port:10001
	}
    },{
	name:"Xepia"
	,color:"black"
	,position:{x:700,y:135}
	,size:18
	,to:["Lerum","Evy","Yuko"]
	,server:{
	    host:"115.156.219.166"
	    ,localport:20002
	    ,port:10002
	}
    },{
	name:"Lerum"
	,color:"black"
	,position:{x:400,y:400}
	,size:11
	,to:["Nolava","Xepia","Axir"]
	,server:{
	    host:"115.156.219.166"
	    ,localport:20003
	    ,port:10003
	}
    },{
	name:"Yuko"
	,color:"black"
	,position:{x:1020,y:500}
	,size:22
	,to:["Axir","Xepia"]
	,server:{
	    host:"115.156.219.166"
	    ,localport:20004
	    ,port:10004
	}
	
    },{
	name:"Axir"
	,color:"black"
	,position:{x:770,y:570}
	,size:12
	,to:["Yuko","Lerum"]
	,server:{
	    host:"115.156.219.166"
	    ,localport:20005
	    ,port:10005
	}
    }];
    exports.GALAXIES = GALAXIES;
})(exports)