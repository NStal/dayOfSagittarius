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
    Static.gameResourceManager = gameResourceManager;
    Static.gameResourceManager.init(Items);
    Static.waitingPage = new WaitingPage(this.waitingSceneNode);
    var __config = {
	username:username
	,rate:settings.rate
	,galaxy:null
	,time:0
	,delay:settings.delay
    } 
    Static.username = username;
    
    Static.resourceLoader = new ResourceLoader();
    Static.resourceLoader.add(GameResource);
    var initTask = new MapTask();
    initTask.newTask();
    Static.resourceLoader.on("finish",function(){
	self.ready = true;
	initTask.complete();
    })
    Static.resourceLoader.start();
    var self = this;
    initTask.on("finish",function(){
	main.clientWorld = new ClientWorld(__config); 
	main.clientWorld.start(); 
	var StarStationScene = require("./starStationScene/starStationScene").StarStationScene;
	Static.starStationScene = new StarStationScene(self.starStationSceneNode);
    })
    Static.waitingPage.startWaiting();
    window.ontouchmove = function(e){
	e.preventDefault();
    }
}