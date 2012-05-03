(function(exports){
    exports.ItemEnum = {
	module:1
    }
    exports.ModuleEnum = {
	CannonEmitter:0
	,BeamEmitter:1
	,MissileEmitter:2
	,Shield:3
	,Armor:4
	,RemoteShieldRecharger:5
    }
    var m = exports.ModuleEnum;
    var e = exports.ItemEnum;
    exports.Items = [{
	id:0
	,name:"BeamEmitter (tiny)"
	,type:e.module
	,attribute:{
	    moduleId:m.BeamEmitter
	    ,accuracyFactor:1.6
	    ,coolDown:150
	    ,ammunitionInfo:{
		damagePoint:4
		,count:30
		,range:550
	    }
	}
    },{
	id:1
	,name:"BeamEmitter (small)"
	,type:e.module
	,attribute:{
	    moduleId:m.BeamEmitter
	    ,accuracyFactor:1.4
	    ,coolDown:180
	    ,ammunitionInfo:{
		damagePoint:12
		,count:30
		,range:600
	    }
	}
    },{
	id:2
	,name:"BeamEmitter (middle)"
	,type:e.module
	,attribute:{
	    moduleId:m.BeamEmitter
	    ,accuracyFactor:1.4
	    ,coolDown:210
	    ,ammunitionInfo:{
		damagePoint:30
		,count:35
		,range:700
	    }
	}
    },{
	id:3
	,name:"BeamEmitter (Big)"
	,type:e.module
	,attribute:{
	    moduleId:m.BeamEmitter
	    ,accuracyFactor:1.2
	    ,coolDown:240
	    ,ammunitionInfo:{
		damagePoint:60
		,count:50
		,range:780
	    }
	}
    },{
	id:4
	,name:"BeamEmitter (Massive)"
	,type:e.module
	,attribute:{
	    moduleId:m.BeamEmitter
	    ,accuracyFactor:1.1
	    ,coolDown:450
	    ,ammunitionInfo:{
		damagePoint:200
		,count:60
		,range:800
	    }
	}
    },{
	id:5
	,name:"BeamEmitter (Epic)"
	,type:e.module
	,attribute:{
	    moduleId:m.BeamEmitter
	    ,accuracyFactor:1.0
	    ,coolDown:900
	    ,ammunitionInfo:{
		damagePoint:1000
		,count:80
		,range:850
	    }
	}
    },{
	id:6
	,name:"MissileEmitter (tiny)"
	,type:e.module
	,attribute:{
	    moduleId:m.MissileEmitter
	    ,coolDown:330
	    ,ammunitionInfo:{
		damagePoint:240
		,range:1600
	    }
	}
    },{
	id:7
	,name:"MissileEmitter (small)"
	,type:e.module
	,attribute:{
	    moduleId:m.MissileEmitter
	    ,coolDown:360
	    ,ammunitionInfo:{
		damagePoint:600
		,range:1800
	    }
	}
    },{
	id:8
	,name:"MissileEmitter (middle)"
	,type:e.module
	,attribute:{
	    moduleId:m.MissileEmitter
	    ,coolDown:510
	    ,ammunitionInfo:{
		damagePoint:2000
		,range:1800
	    }
	}
    },{
	id:9
	,name:"MissileEmitter (Big)"
	,type:e.module
	,attribute:{
	    moduleId:m.MissileEmitter
	    ,coolDown:720
	    ,ammunitionInfo:{
		damagePoint:8000
		,range:1800
	    }
	}
    },{
	id:10
	,name:"MissileEmitter (Massive)"
	,type:e.module
	,attribute:{
	    moduleId:m.MissileEmitter
	    ,coolDown:810
	    ,ammunitionInfo:{
		damagePoint:20000
		,range:1800
	    }
	}
    },{
	id:11
	,name:"MissileEmitter (Epic)"
	,type:e.module
	,attribute:{
	    moduleId:m.MissileEmitter
	    ,coolDown:960
	    ,ammunitionInfo:{
		damagePoint:100000
		,range:1800
	    }
	}
    },{
	id:12
	,name:"CannonEmitter (tiny)"
	,type:e.module
	,attribute:{
	    moduleId:m.CannonEmitter
	    ,coolDown:90
	    ,accuracyFactor:1.2
	    ,ammunitionInfo:{
		damagePoint:100 
		,range:400
	    }
	}
    },{
	id:13
	,name:"CannonEmitter (small)"
	,type:e.module
	,attribute:{
	    moduleId:m.CannonEmitter
	    ,coolDown:90 
	    ,accuracyFactor:1.15
	    ,ammunitionInfo:{
		damagePoint:240
		,range:400 
	    }
	}
    },{
	id:14
	,name:"CannonEmitter (middle)"
	,type:e.module
	,attribute:{
	    moduleId:m.CannonEmitter
	    ,coolDown:90
	    ,accuracyFactor:1.1
	    ,ammunitionInfo:{
		damagePoint:500
		,range:350 
	    }
	}
    },{
	id:15
	,name:"CannonEmitter (Big)"
	,type:e.module
	,attribute:{
	    moduleId:m.CannonEmitter
	    ,coolDown:90
	    
	    ,accuracyFactor:1.05
	    ,ammunitionInfo:{
		damagePoint:1200
		,range:330 
	    }
	}
    },{
	id:16
	,name:"CannonEmitter (Massive)"
	,type:e.module
	,attribute:{
	    moduleId:m.CannonEmitter
	    ,coolDown:90 
	    ,accuracyFactor:1
	    ,ammunitionInfo:{
		damagePoint:3000
		,range:320 
	    }
	}
    },{
	id:17
	,name:"CannonEmitter (Epic)"
	,type:e.module
	,attribute:{
	    moduleId:m.CannonEmitter
	    ,coolDown:90 
	    ,accuracyFactor:0.5
	    ,ammunitionInfo:{
		damagePoint:9000
		,range:300 
		,accuracyFactor:0.5
	    }
	}
    },{
	id:18
	,name:"ShieldGenerator (tiny)"
	,type:e.module
	,attribute:{
	    moduleId:m.Shield
	    ,ability:{
		capacity:500
		,recoverInterval:510
		,recoverAmmount:120
		,electricityConsumption:60
	    }
	}
    },{
	id:19
	,name:"ShieldGenerator (small)"
	,type:e.module
	,attribute:{
	    moduleId:m.Shield
	    ,ability:{
		capacity:1500
		,recoverInterval:540
		,recoverAmmount:400
		,electricityConsumption:190
	    }
	}
    },{
	id:20
	,name:"ShieldGenerator (middle)"
	,type:e.module
	,attribute:{
	    moduleId:m.Shield
	    ,ability:{
		capacity:6000
		,recoverInterval:700
		,recoverAmmount:1000
		,electricityConsumption:400
	    }
	}
    },{
	id:21
	,name:"ShieldGenerator (big)"
	,type:e.module
	,attribute:{
	    moduleId:m.Shield
	    ,ability:{
		capacity:25000
		,recoverInterval:900
		,recoverAmmount:2100
		,electricityConsumption:600
	    }
	}
    },{
	id:22
	,name:"ShieldGenerator (massive)"
	,type:e.module
	,attribute:{
	    moduleId:m.Shield
	    ,ability:{
		capacity:100000
		,recoverInterval:1200
		,recoverAmmount:6000
		,electricityConsumption:1500
	    }
	}
    },{
	id:23
	,name:"ShieldGenerator (epic)"
	,type:e.module
	,attribute:{
	    moduleId:m.Shield
	    ,ability:{
		capacity:500000
		,recoverInterval:2100
		,recoverAmmount:12000
		,electricityConsumption:2000
	    }
	}
    },{
	id:24
	,name:"Armor (tiny)"
	,type:e.module
	,attribute:{
	    moduleId:m.Armor
	    ,ability:{
		resistPoint:1500 
	    }
	}
    },{
	id:25
	,name:"Armor (small)"
	,type:e.module
	,attribute:{
	    moduleId:m.Armor
	    ,ability:{
		resistPoint:5000
	    }
	}
    },{
	id:26
	,name:"Armor (middle)"
	,type:e.module
	,attribute:{
	    moduleId:m.Armor
	    ,ability:{
		resistPoint:24000
	    }
	}
    },{
	id:27
	,name:"Armor (big)"
	,type:e.module
	,attribute:{
	    moduleId:m.Armor
	    ,ability:{
		resistPoint:80000
	    }
	}
    },{
	id:28
	,name:"Armor (massive)"
	,type:e.module
	,attribute:{
	    moduleId:m.Armor
	    ,ability:{
		resistPoint:300000
	    }
	}
    },{
	id:29
	,name:"Armor (epic)"
	,type:e.module
	,attribute:{
	    moduleId:m.Armor
	    ,ability:{
		resistPoint:1500000
	    }
	}
    },{
	id:30
	,name:"RemoteShieldRecharger (tiny)"
	,type:e.module
	,attribute:{
	    moduleId:m.RemoteShieldRecharger
	    ,coolDown:300
	    ,accuracyFactor:1.2
	    ,ammunitionInfo:{
		repairAmmount:300
		,range:400
		,count: 15
	    }
	}
    },{
	id:31
	,name:"RemoteShieldRecharger (small)"
	,type:e.module
	,attribute:{
	    moduleId:m.RemoteShieldRecharger
	    ,coolDown:330
	    ,accuracyFactor:1.15
	    ,ammunitionInfo:{
		repairAmmount:600
		,range:400 
		,count: 15
	    }
	}
    },{
	id:32
	,name:"RemoteShieldRecharger (middle)"
	,type:e.module
	,attribute:{
	    moduleId:m.RemoteShieldRecharger
	    ,coolDown:360
	    ,accuracyFactor:1.1
	    ,ammunitionInfo:{
		repairAmmount:1000
		,range:390 
		,count: 15
	    }
	}
    },{
	id:33
	,name:"RemoteShieldRecharger (Big)"
	,type:e.module
	,attribute:{
	    moduleId:m.RemoteShieldRecharger
	    ,coolDown:420
	    
	    ,accuracyFactor:1.05
	    ,ammunitionInfo:{
		repairAmmount:2000
		,range:370
		,count: 15 
	    }
	}
    },{
	id:34
	,name:"RemoteShieldRecharger (Massive)"
	,type:e.module
	,attribute:{
	    moduleId:m.RemoteShieldRecharger
	    ,coolDown:600
	    ,accuracyFactor:1
	    ,ammunitionInfo:{
		repairAmmount:4000
		,range:350 
		,count: 15
	    }
	}
    }]
})(exports)