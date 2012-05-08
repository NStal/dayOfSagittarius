(function(exports){
    var Class = require("../../share/util").Class;
    var Point = require("../../share/util").Point; 
    var PrototypeStore = Class.sub();

    PrototypeStore.prototype._init = function (){
	this.arr = new Array();
    }
    PrototypeStore.prototype.get = function (name){
	for(var i=0 ; i < this.arr.length;i++){
	    if(this.arr[i].name == name)
		return this.arr[i];
	}
	console.error("Can't find name:"+name);
    }
    PrototypeStore.prototype.add = function (){
	for(var i=0 ; i<arguments.length ; i++)
	    this.arr.push(arguments[i]);
    }
    PrototypeStore.prototype.giveDataTo = function (target){
	if(!target.name){
	    console.error("target hos no name",target);
	    return;
	}
	var storeData = this.get(target.name);
	if(!storeData)
	    return;
	for(var i in storeData){
	    target[i] = storeData[i];
	}
    }
    ptStore = {};
    ptStore.npcStore = new PrototypeStore();
    ptStore.npcStore.add(
	{name:"Homura",
	 pic:"./site/css/pics/homura.png",
	 icon:"",
	}
	,{name:"Yomi",
	  pic:"./site/css/pics/yomi.png",
	  icon:"",
	 }
	,{name:"Inori",
	  pic:"./site/css/pics/inori.jpg",
	  icon:"",
	 }
	,{name:"Luna",
	  pic:"",
	  icon:"",
	 }
	,{name:"Tom",
	  pic:"",
	  icon:"",
	 }
	,{name:"Jessica",
	  pic:"",
	  icon:"",
	 }
	,{name:"Izzac",
	  pic:"",
	  icon:"",
	 }
	,{name:"Mirria",
	  pic:"./site/css/pics/neko.png",
	  icon:"",
	 }
    );
    ptStore.equipmentStore = new PrototypeStore();
    ptStore.equipmentStore.add(
	{name:"HeavyPropeller"
	 ,type:"Propeller"
	 ,intro:"a powerful and fast Propeller"
	 ,fieldData:[
	     [2,2,2,2],
	     [2,2,2,2],
	     [2,2,2,2]
	 ]
	 ,force:10000
	 ,ec:300//Energy consumption
	},
	{name:"MeddiumPropeller"
	 ,type:"Propeller"
	 ,fieldData:[
	     [2,2],
	     [2,2]
	 ]
	 ,force:1500
	},
	{name:"LightPropeller"
	 ,type:"Propeller"
	 ,force:200
	},
	{name:"HeavyBeamRaife"
	 ,type:"Weapon"
	 ,intro:"a powerful BeamRaife"
	 ,fieldData:[
	     [0,0,3,3,3,0],
	     [3,3,3,3,3,3],
	     [3,3,3,3,3,3],
	     [0,0,3,3,3,0]
	 ]
	 ,
	},
	{name:"MeddiumBeamRaife"
	 ,type:"Weapon"
	 ,fieldData:[
	     [3,3,3,3,3],
	     [3,3,3,3,3],
	 ]
	},
	{name:"LightBeamRaife"
	 ,type:"Weapon"
	},
	{name:"MiddiumCommandCenter"
	 ,type:"CommandCenter"
	 ,intro:"a CommandCenter witch provids better performence"
	 ,fieldData:[
 	     [0,0,1,0,0],
	     [0,1,1,1,0],
	     [1,0,1,0,1],
	     [0,1,1,1,0],
	     [0,0,1,0,0]
	 ]
	},
	{name:"LightBattery"
	 ,type:"Battery"
	 ,fieldData:[
	     [1],
	     [1]
	 ]
	},
	{name:"SmallDepot"
	 ,type:"Depot"
	 ,fieldData:[
	     [1,1,1],
	     [1,1,1],
	     [1,1,1]
	 ]
	},
	{name:"MeddiumEngine"
	 ,type:"Engine"
	 ,fieldData:[
	     [0,1,0,1,0],
	     [1,1,1,1,1],
	     [1,1,1,1,1],
	     [1,1,1,1,1],
	     [0,1,0,1,0]
	 ]
	},
	{name:"LightEngine"
	 ,type:"Engine"
	 ,fieldData:[
	     [1,1,1],
	     [1,1,1],
	     [1,1,1]
	 ]
	},
	{name:"SmallQuarters"
	 ,type:"Quartees"
	}
    );
    ptStore.shipStore = new PrototypeStore();
    ptStore.shipStore.add(
	{name:"DwanTracker"
	 ,width:525
	 ,height:518
	 ,size:4
	 ,shapePathArray:[{"closed":true
			   ,"pointArray":[{"x":-0.5,"y":-259},{"x":-87.5,"y":-183},{"x":-204,"y":108.5,"cpx":-204.5,"cpy":10},{"x":-195,"y":151.5},{"x":-140.5,"y":129},{"x":-70,"y":258},{"x":-21.5,"y":256},{"x":-18.5,"y":175},{"x":15,"y":175},{"x":20,"y":257},{"x":73,"y":258},{"x":143.5,"y":132},{"x":196.5,"y":157},{"x":208.5,"y":106},{"x":86.5,"y":-189,"cpx":210.5,"cpy":55}]},
			  {"closed":true
			   ,"pointArray":[{"x":-143.5,"y":140},{"x":-209.5,"y":171},{"x":-262.5,"y":253},{"x":-166.5,"y":259},{"x":-122.5,"y":208}]},
			  {"closed":true
			   ,"pointArray":[{"x":145.5,"y":143},{"x":121.5,"y":210},{"x":156.5,"y":256},{"x":262.5,"y":247},{"x":205.5,"y":174}]}
			 ]
	 ,structurePathArray:[{"closed":true
			       ,"pointArray":[{"x":-2.5,"y":-197},{"x":-57.5,"y":-154},{"x":-76.5,"y":-122},{"x":-22.5,"y":-126},{"x":24.5,"y":-126,"cpx":-2.5,"cpy":-145},{"x":73.5,"y":-123},{"x":51.5,"y":-159}]},
			      {"center":{"x":-0.5,"y":-96},"radius":28.792360097775937},
			      {"center":{"x":-0.5,"y":-96},"radius":22},
			      {"closed":true
			       ,"pointArray":[{"x":-25,"y":-67},{"x":27.5,"y":-69,"cpx":6.5,"cpy":-52},{"x":30.5,"y":-46},{"x":13.5,"y":-18},{"x":11.5,"y":46},{"x":-0.5,"y":58},{"x":-12.5,"y":46},{"x":-13.5,"y":-20},{"x":-28,"y":-46}]},
			      {"closed":true
			       ,"pointArray":[{"x":132,"y":-72},{"x":117,"y":47},{"x":127,"y":21},{"x":139,"y":-57}]},
			      {"closed":true
			       ,"pointArray":[{"x":144,"y":-44},{"x":133,"y":29},{"x":124,"y":55},{"x":138,"y":34},{"x":150,"y":-30}]},
			      {"closed":true
			       ,"pointArray":[{"x":-130,"y":-72},{"x":-101,"y":41},{"x":-116,"y":15},{"x":-135,"y":-59}]},
			      {"closed":true
			       ,"pointArray":[{"x":-142,"y":-48},{"x":-108,"y":53},{"x":-127,"y":18},{"x":-145,"y":-31}]},
			      {"closed":true
			       ,"pointArray":[{"x":-152,"y":149},{"x":-202,"y":172},{"x":-192,"y":193},{"x":-175,"y":182},{"x":-163,"y":190},{"x":-163,"y":207},{"x":-135,"y":206}]},
			      {"closed":true
			       ,"pointArray":[{"x":148,"y":153},{"x":131,"y":202},{"x":150,"y":219},{"x":156,"y":202},{"x":150,"y":190},{"x":161,"y":182},{"x":180,"y":197},{"x":203,"y":188}]},
			      {"closed":true
			       ,"pointArray":[{"x":-81,"y":-173},{"x":-128,"y":-88},{"x":-166,"y":-6},{"x":-191,"y":98},{"x":-184,"y":120},{"x":-173,"y":113},{"x":-167,"y":120},{"x":-168,"y":129},{"x":-132,"y":115},{"x":-99,"y":180},{"x":-74,"y":158},{"x":-39,"y":170},{"x":-34,"y":151},{"x":30,"y":152},{"x":36,"y":169},{"x":63,"y":161},{"x":100,"y":180},{"x":138,"y":116},{"x":183,"y":138},{"x":171,"y":120},{"x":179,"y":107},{"x":193,"y":115},{"x":198,"y":95},{"x":176,"y":21},{"x":143,"y":-58},{"x":81,"y":-182},{"x":9,"y":-233},{"x":-12,"y":-233}]},
			      {"center":{"x":-155,"y":93},"radius":7},
			      {"center":{"x":-158,"y":70},"radius":9},
			      {"center":{"x":-139,"y":62},"radius":7},
			      {"center":{"x":176,"y":78},"radius":9},
			      {"center":{"x":163,"y":98},"radius":7},
			      {"center":{"x":158,"y":63},"radius":7}
			     ]
	 ,fieldData:[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
		     [0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,2,2],
		     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		     [0,0,0,0,0,3,3,3,3,3,1,1,1,1,1,1,0,0,0,0,0],
		     [0,0,0,0,0,3,3,3,3,3,1,1,1,1,1,1,0,0,0,0,0],
		     [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
		     [0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,0,0,0,2,0],
		     [0,0,3,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0],
		     [0,3,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
		     [0,0,3,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0],
		     [0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,0,0,0,2,0],
		     [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
		     [0,0,0,0,0,3,3,3,3,3,1,1,1,1,1,1,0,0,0,0,0],
		     [0,0,0,0,0,3,3,3,3,3,1,1,1,1,1,1,0,0,0,0,0],
		     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		     [0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,2,2],
		     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
		     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		    ]
	}
    );

    
})(exports)