(function(exports){
    var Drawable = require("./drawing/drawable").Drawable;
    var Expand = require("./drawing/effect").Expand;
    var settings = require("./settings").settings;
    var Instance = require("./share/util").Instance;
    var Point = require("./share/util").Point;
    var WaitingPage = Drawable.sub();
    WaitingPage.prototype._init = function(node){
	Widget.call(this,node)
	
	this.canvas = this.screenNode;
	this.canvas.width = settings.width;
	this.canvas.height = settings.height;
	this.drawingInstance = new Instance();
	this.drawingInstance.setRate(settings.rate);
	var self = this;
	this.centerPoint = new Point(settings.width/2,settings.height/2);
	this.drawingInstance.next = function(){
	    self.next();
	}
	this.index = 0;
	this.waitingScene = new WaitingScene();
	this.waitingScene.position = this.centerPoint;
	this.add(this.waitingScene);
    }
    WaitingPage.prototype.endWaiting = function(){
	this.isEnding = true;
	this.waitingScene.text = "载入完毕";
    }
    WaitingPage.prototype.hide = function(){
	this.drawingInstance.stop();
	this.canvas.style.display = "none";
	this.nodeJ.hide();
	this.isWaiting = false;
    }
    WaitingPage.prototype.next = function(){
	if(this.isEnd){
	    this.hide();
	}
	if(this.isEnding){
	    this.alpha-=0.04;
	    if(this.r!=0)
		this.r+=5;
	    else
		this.r = 3;
	    if(this.alpha<=0.1){
		this.isEnd = true;
	    }
	}
	this.index++;
	var context = this.canvas.getContext("2d"); 
	context.globalAlpha = this.alpha;
	context.clearRect(0,0,this.canvas.width,this.canvas.height); 
	context.beginPath();
	context.rect(0,0,this.canvas.width,this.canvas.height);
	context.fill();
	this.draw(context);
    }
    var WaitingScene = Drawable.sub();
    WaitingScene.prototype._init = function(){
	this.index = 0;
	this.r = 0;
    }
    WaitingScene.prototype.onDraw = function(context){
	this.index++;
	context.save();
	context.strokeStyle = "white";
	context.beginPath();
	context.rotate(this.index/10);
	context.arc(0,0,20+this.r,0,Math.PI*2/1.5); 
	context.stroke();
	context.beginPath();
	context.rotate(this.index/13);
	context.arc(0,0,15+this.r,0,Math.PI*2/1.8); 
	context.stroke();
	context.beginPath();
	context.rotate(-this.index/4);
	context.arc(0,0,17+this.r,0,Math.PI*2/1.2);
	context.stroke();
	context.restore();
	context.translate(0,40);
	context.textAlign = "center";
	context.fillStyle = "white";
	context.beginPath();
	context.fillText(this.text,0,0);
    }    
    WaitingPage.prototype.startWaiting = function(){
	var self = this;
	if(this.isWaiting){
	    return
	}
	this.isWaiting = true;
	this.waitingScene.text = "载入中...";
	this.r = 0;
	this.isEnd = false;
	this.isEnding = false;
	this.alpha = 1;
	this.drawingInstance.start();
	$(this.canvas).show();
	this.nodeJ.show();
    }
    exports.WaitingPage = WaitingPage; 
})(exports)