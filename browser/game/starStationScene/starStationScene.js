(function(exports){
    //for compatibility jXFrame,Here we don't use Class.sub(),instead, we use traditional
    //JS prototype
    var StarStationScene = function(template){
	Widget.call(this,template);
	this.nodeJ.css({display:"none"});
	this.screenNode.width =  settings.width;
	this.screenNode.height = settings.height;
    }
    //onEnterStation is invoke when battleField find the user ship is enter the station
    //for test convinience,It's now auto invoke at site.js
    StarStationScene.prototype.onEnterStation = function(stationName){
	var self = this;
	this.nodeJ.css({display:"block"});
	
	//If you want to see the HttpAPI implementation details of some api
	//check root/browser/api/apiname.js
	//If you want to check the jXFrame(from which HttpAPI/Widget inherit)
	//See root/browser/site/jXFrame or root/browser/jXFrame/remote(just a symlink) for details
	//Your may also enter http://yourip/day/api/getStationInfoByName?name=Nolava-I
	//to directly see the result
	Static.HttpAPI.getStationInfoByName(stationName,function(response){
	    if(!response.result){
		console.warn("Error fail to get station");
		return;
	    } 
	    
	    var context = self.screenNode.getContext("2d")
	    context.textAlign = "center"; 
	    console.log(self.screenNode.width/2,self.screenNode.height/2);
	    context.translate(self.screenNode.width/2,self.screenNode.height/2); 
	    //view can view other station info by console.log(response) in chrome
	    //basiclly,every HttpAPI call return a object like
	    //{result:true,data:{.. what you request ..}}
	    //or {result:false,errorCode:3,errorDiscription:"Discription for error code"};

	    //if you want to test your designs
	    //you can assume what ever data you recieved and do your jobs
	    //latter I will add what ever data you want at backend
	    context.fillText("Giyya's world here:enter station of "+response.data.name,0,0);
	    
	})
    }
    exports.StarStationScene = StarStationScene;
})(exports)