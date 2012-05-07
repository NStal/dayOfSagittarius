(function(exports){
    var EventEmitter = require("../share/util").EventEmitter;
    var AudioManager = EventEmitter.sub();
    //set up sound manager
    window.soundManager.url = "plugins/sound/soundmanager2.swf"
    window.soundManager.onready(function(){
	/*soundManager.ready = true;
	if(!Static.site)return;
	if(Static.site.soundReady){
	    Static.site.soundReady();
	}
	else{
	    Static.site.isSoundReady = true;
	}*/
    })
    AudioManager.prototype._init = function(){
	
    }
    AudioManager.prototype.play = function(name){
	Static.resourceLoader.get();
    }
    AudioManager.prototype.playOnce = function(){
	
    }
    var Audio = EventEmitter.sub();
    Audio.prototype._init = function(url){
	this.id = Math.random().toString();
	this.url = url;
	this.sound = soundManager.createSound({
	    id:this.id
	    ,url:this.url
	})
    }
    Audio.prototype.play  = function(){
	var self = this;
	this.sound.play({
	    onfinish:function(){
		if(self.loop){
		    self.play();
		}
	    }});
    }
    Audio.prototype.pause = function(){
	this.sound.pause();
    }
    exports.Audio = Audio;
    exports.AudioManager = AudioManager;
})(exports)