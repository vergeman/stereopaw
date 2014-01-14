console.log("[SoundByte 2.0]");var SB=(function(){var b=null,c=null,d=null,a="";var e={init:function(){b=this;b.Util.load_jQuery();c=setInterval(function(){if(typeof jQuery=="undefined"){return false}else{clearInterval(c);b.start()}},150)},start:function(){console.log("[SoundByte 2.0] start()");b.service=b.Service.getService();console.log("Service: "+b.service);if(!document.getElementById("sb-app")){b.Page.insert_page();b.events()}b.update()},events:function(){console.log("[SoundByte 2.0] events()");$("#sb-close").bind("click",function(){console.log("[SoundByte 2.0] Exiting");clearInterval(b._interval);$("#sb-submit-button").unbind("click");$("#sb-close").unbind("click");$("#sb-script").remove();$("#sb-style").remove();$("#sb-app").remove()});$("#sb-submit-button").bind("click",function(f){f.preventDefault();window.open(b.Track.getURL(),"SoundByte","top=0,left=0,width=600, height=500");console.log("clicked");$("#sb-close").click();console.log("closing")});$("#sb-display-bar").mouseover(function(f){$("#sb-display-seek").show()});$("#sb-display-bar").mouseout(function(f){$("#sb-display-seek").hide()});$("#sb-display-bar").mousemove(function(g){var h=$(this).parent().offset();var f=g.pageX-h.left;$("#sb-display-seek").css("left",f+"px")});$("#sb-display-bar").click(function(g){console.log("seek");var h=$(this).parent().offset();var f=g.pageX-h.left;b.Data.seek(f/$("#sb-display-bar").width())})},update:function(){console.log("[SoundByte 2.0] update()");b._interval=setInterval(function(){b.Data.setTrack(b.service,b.Track);b.render()},300)},render:function(){console.log("[SoundByte 2.0] render()");if($("#sb-app").is(":hidden")){$("#sb-app").fadeIn()}document.getElementById("sb-track-title").innerHTML=b.Track.getTitle();document.getElementById("sb-track-artist").innerHTML=b.Track.getArtist();document.getElementById("sb-track-service").innerHTML=b.service;document.getElementById("sb-time").innerHTML=b.Track.getTimeFormat();document.getElementById("sb-display-bar-elapsed").setAttribute("style","width: "+b.Track.getElapsed()*100+"%;")}};return e}());SB.Util=(function(){var a={};function b(d){return(d.toFixed().length>1?d.toFixed():"0"+d.toFixed())}function c(d,e,f){if(d<1){return e+":"+b(f)}return d+":"+b(e)+":"+b(f)}a.toTime=function(f,i){var h=(i=="secs")?1:1000;var d=Math.floor(f/(3600*h));var e=Math.floor((f/(60*h))-60*d);var g=(f/(60*h)-(60*d)-e)*60;if(i=="secs"){return c(d,e,Math.round(g))}return c(d,e,Math.floor(g))};a.load_jQuery=function(){if(typeof jQuery==="undefined"){var d=document.createElement("script");d.id="sb-jb";d.type="text/javascript";d.src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";document.body.appendChild(d)}};return a}());SB.Page=(function(){var b='<div id = "sb-close">x</div><h1 id = "sb-title">SoundByte</h1><div id = "sb-track"><div id = "sb-track-title"></div><div id = "sb-track-artist"></div><div id = "sb-track-service"></div></div><div id = "sb-player"><div id = "sb-time"></div><div id = "sb-display-bar"><div id = "sb-display-bar-elapsed"></div><div id = "sb-display-seek"></div></div><div id = "sb-player-play">></div></div><div id = "sb-submit">     <button id = "sb-submit-button">Submit</button></div></div>';var a="#sb-app { position: fixed; top: 50px; right: 0; width: 300px;background-color: #fff;border: 1px solid #aaa;z-index: 99999999999999999;display:none}#sb-close { float:right;}#sb-display-bar { width: 100%;cursor: pointer;height: 10px;background-color: #000;}#sb-display-bar-elapsed { width: 0%;height: 8px;background-color: #aaa}#sb-display-seek { position:relative;top: -8px;width: 2px;height: 10px;background-color: #eee111;display:none;}";function c(f,g){var h=document.createElement(f.type);h.setAttribute(f.attr,f.value);h.innerHTML=g;document.body.appendChild(h)}var d={insert_page:function(){c({type:"div",attr:"id",value:"sb-app"},b);c({type:"style",attr:"id",value:"sb-style"},a)}};return d}());SB.Service=(function(){var a={};var c=[/^https?:\/\/.*(mixcloud).com/g,/^https?:\/\/.*(soundcloud).com/g],e=null,b=window.location.origin;function d(){c.some(function(f){if(m=f.exec(b)){return e=m[1]}})}a.getService=function(){if(e==null){d()}return e?e.toLowerCase():"NA"};return a}());SB.Track=(function(){_url="http://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5151/tracks/new";var b={};var n="",a="",j="",k="",f="",g="",h="",e="",c="",d="",i="",l="";b.set=function(w,q,t,u,p,r,o,s,v){a=w;j=q;n=t;k=u;f=p;g=r;e=o;h=s;l=v;i=r/p};b.getURL=function(){return _url+"?track[track_id]="+encodeURIComponent(a)+"&track[artist]="+encodeURIComponent(j)+"&track[title]="+encodeURIComponent(n)+"&track[page_url]="+encodeURIComponent(h)+"&track[profile_url]="+encodeURIComponent(k)+"&track[timeformat]="+encodeURIComponent(this.getTimeFormat())+"&track[timestamp]="+encodeURIComponent(g)+"&track[duration]="+encodeURIComponent(f)+"&track[shareable]="+encodeURIComponent(l)+"&track[subtrack]="+encodeURIComponent(c)+"&track[subartist]="+encodeURIComponent(d)};b.getTitle=function(){return n};b.getArtist=function(){return j};b.getTimeFormat=function(){return e};b.getElapsed=function(){return i};b.getDuration=function(){return f};return b}());SB.Data=(function(){var g=null,e=null,f=null;function b(h,l,k){try{return h()}catch(j){try{return l()}catch(i){return k}}}var a={mixcloud:function(){var i={},h;i=b(function(){return $("#player-module").data()["controller:player_module"].playerStatus},function(){return 0},{});h=b(function(){return i.audio_position},function(){return 0},0);e.set(b(function(){return $("#cloudcast-owner-link > span")[0].innerHTML},function(){return $("#cloudcast-owner-link")[0].innerHTML},""),$("#cloudcast-name").html(),"http://www.mixcloud.com"+$("#cloudcast-owner-link").attr("href"),i.now_playing_audio_length,h,SB.Util.toTime(h,"secs"),"http://www.mixcloud.com"+i.now_playing_key)},soundcloud:function(){var i=require("lib/play-manager");f=i.getCurrentSound();var j=i.getCurrentMetadata();var h=j.sound.audio.currentTime();e.set(j.sound.attributes.id,j.sound.attributes.user.username,j.sound.attributes.title,j.sound.attributes.user.permalink_url,j.sound.attributes.duration,h,SB.Util.toTime(h,"ms"),j.sound.attributes.permalink_url,(j.sound.attributes.sharing=="public"?true:false))},spotify:function(){},youtube:function(){},grooveshark:function(){},"8tracks":function(){},earbits:function(){},pandora:function(){},NA:function(){return"NA"}};var c={soundcloud:{seek:function(h){f.seek(h*e.getDuration())},pause:function(){},play:function(){}},NA:function(){return"NA"}};var d={};d.setTrack=function(h,i){g=h;e=i;a[g]()};d.seek=function(h){c[g]["seek"](h)};return d}());SB.init();