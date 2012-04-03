var Site = function(){
    Widget.call(this,document.body);
    var self = this;
    this.onClickLoginButton = function(){
	main.game = new Game(self.loginUsernameInputJ.val());
	main.game.start();
	game = main.game;
	this.landingPageJ.hide();
	this.canvasContainerJ.show();
    }
    
}