var Site = function(){
    Widget.call(this,document.body);
    var self = this;
    this.onClickLoginButton = function(){
	//test
	this.initGame(self.loginUsernameInputJ.val());
	self.landingPageJ.hide();
	self.canvasContainerJ.show();
    } 
}
Site.prototype.initGame = function(username){
    settings.width = $("body").width();
    settings.height = $("body").height();
    Static.waitingPage = new WaitingPage(document.getElementById('waitingPage'));
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