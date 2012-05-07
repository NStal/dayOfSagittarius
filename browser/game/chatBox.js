(function(exports){
    function ChatBox(template){
	Widget.call(this,template);
	var self = this; 
	this.channel = 0;
	this.onClickChannelButton = function(){
	    this.channel = this.channelCodeInputJ.val();
	    if(!this.channel)this.channel = "0";
	    this.chatRoomJ.show(); 
	    this.channelSelectorJ.hide();
	    this.channelDisplayerJ.text("Current Channel:"+this.channel);
	    this.contentJ.append("change to channel "+this.channel+"</br>");
	}
	Static.gateway.on("chatMessage",function(msg){
	    if(self.channel.toString() == msg.channel.toString()){
		var item = $("<p>").text(msg.auth.username+":"+msg.content);
		self.contentJ.append(item);
		self.contentJ.scrollTop(self.contentJ[0].scrollHeight);
	    }
	})
	this.channelCodeInputJ.keydown(function(e){
	    var enter = 13;
	    if(e.which == enter){
		self.onClickChannelButton(); 
		return false;
	    }
	})
	this.onClickChangeChannelButton = function(){
	    this.channelSelectorJ.show();
	    this.chatRoomJ.hide();
	}
	this.chatInputJ.keyup(function(e){
	    if(e.which == 13){
		self.onClickSubmitWordButton();
	    }
	});
	this.onClickSubmitWordButton = function(){
	    var word = this.chatInputJ.val();
	    if(word=="\\clear"){
		this.contentJ.html("");
		this.chatInputJ.val("");
		return;
	    }
	    if(word.length==0){
		return;
	    }
	    Static.gateway.send({
		channel:this.channel.toString()
		,content:word
	    })
	    this.chatInputJ.val("");
	}
    }
    ChatBox.prototype.show = function(){
	this.isShown = true;
	this.nodeJ.fadeIn(200);
	this.channelDisplayerJ.text("Current Channel :"+this.channel);
    }
    ChatBox.prototype.hide = function(){
	this.nodeJ.fadeOut(200);
	this.isShown = false;
    }
    ChatBox.prototype.toggle = function(){
	if(this.isShown)this.hide()
	else this.show()
    }
    exports.ChatBox = ChatBox;
})(exports)