var Site = function(){
    Widget.call(this,document.body);
    var self = this;
    this.onClickLoginButton = function(){
	//test
	this.initGame(self.loginUsernameInputJ.val());
	self.landingPageJ.hide();
    }
}
Site.prototype.initGame = function(username){
    settings.width = $("body").width();
    settings.height = $("body").height();
    Static.waitingPage = new WaitingPage(this.waitingSceneJ.find('#screen')[0]);
    var StarStationScene = require("./starStationScene/starStationScene").StarStationScene;
    Static.starStationScene = new StarStationScene(this.starStationSceneNode);
    //Static.starStationScene.onEnterStation("Nolava-I");
    var __config = {
	username:username
	,rate:settings.rate
	,galaxy:null
	,time:0
	,delay:settings.delay
    } 
    Static.username = username;
    main.clientWorld = new ClientWorld(__config);
    main.clientWorld.start(); 
    clientWorld = main.clientWorld;
}