console.log("[stereopaw 2.0]"),HOST="//ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5151";var SB=function(){var self=null,_interval=null,sb={init:function(){self=this,self.Util.load_jQuery(),_interval=setInterval(function(){return"undefined"==typeof jQuery?!1:(clearInterval(_interval),void self.start())},150)},start:function(){console.log("[stereopaw 2.0] start()"),self.service=self.Service.getService(),console.log("Service: "+self.service),document.getElementById("sb-app")||("NA"==self.service?self.Page.insert_error_page():self.Page.insert_page(),self.events()),self.update()},events:function(){console.log("[stereopaw 2.0] events()"),$("#sb-close").bind("click",function(){console.log("[stereopaw 2.0] Exiting"),clearInterval(self._interval),$("#sb-submit-button").unbind("click"),$("#sb-close").unbind("click"),$("#sb-script").remove(),$("#sb-style").remove(),$("#sb-app").remove()}),$("#sb-submit-button").bind("click",function(e){e.preventDefault(),window.open(self.Track.getURL(),"stereopaw","top=0,left=0,width=600, height=675"),console.log("clicked"),$("#sb-close").click(),console.log("closing")}),$("#sb-display-bar").mouseover(function(){$("#sb-display-seek").show()}),$("#sb-display-bar").mouseout(function(){$("#sb-display-seek").hide()}),$("#sb-display-bar").mousemove(function(e){var offset=$(this).parent().offset(),x=e.pageX-offset.left;$("#sb-display-seek").css("left",x+"px")}),$("#sb-display-bar").click(function(e){console.log("seek");var offset=$(this).parent().offset(),x=e.pageX-offset.left;self.Data.seek(x/$("#sb-display-bar").width())})},update:function(){console.log("[stereopaw 2.0] update()"),self._interval=setInterval(function(){self.Data.setTrack(self.service,self.Track),self.render()},300)},render:function(){console.log("[stereopaw 2.0] render()"),$("#sb-app").is(":hidden")&&$("#sb-app").fadeIn(),"NA"!=self.service&&(self.Track.getTitle()?document.getElementById("sb-track-title").innerHTML=self.Track.getTitle():document.getElementById("sb-track-title-label").style.display="none",self.Track.getArtist()?document.getElementById("sb-track-artist").innerHTML=self.Track.getArtist():document.getElementById("sb-track-artist-label").style.display="none",self.Track.getTimeFormat()?document.getElementById("sb-time").innerHTML=self.Track.getTimeFormat():document.getElementById("sb-track-time-label").style.display="none")}};return sb}();SB.Util=function(){function prezero(num){return num.toFixed().length>1?num.toFixed():"0"+num.toFixed()}function formatTime(hours,min,sec){return 1>hours?min+":"+prezero(sec):hours+":"+prezero(min)+":"+prezero(sec)}var util={};return util.TimetoMs=function(timestring){return min=timestring.split(":")[0],sec=timestring.split(":")[1],60*min*1e3+1e3*sec},util.toTime=function(secs,scale){var alpha="secs"==scale?1:1e3,hours=Math.floor(secs/(3600*alpha)),min=Math.floor(secs/(60*alpha)-60*hours),sec=60*(secs/(60*alpha)-60*hours-min);return"secs"==scale?formatTime(hours,min,Math.round(sec)):formatTime(hours,min,Math.floor(sec))},util.load_jQuery=function(){if("undefined"==typeof jQuery){var script=document.createElement("script");script.id="sb-jb",script.type="text/javascript",script.src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",document.body.appendChild(script)}},util}(),SB.Page=function(){function parseCSSObj(obj){css="";for(key in obj)obj.hasOwnProperty(key)&&"object"==typeof obj[key]&&(css+=key+"{"+parseCSSObj(obj[key])+"}"),obj.hasOwnProperty(key)&&"string"==typeof obj[key]&&(css+=key+":"+obj[key]+";");return css}function build_element(element,content){var e=document.createElement(element.type);e.setAttribute(element.attr,element.value),e.innerHTML=content,document.body.appendChild(e)}var HOME=HOST,_header=['<div id = "sb-close">',["<img src= "+HOME+'/icon-close.png width="12px"/>'].join("\n"),"</div>",'<div id="sb-logo">',['<img width="26" src= '+HOME+"/assets/stereopaw-logo-main.png/>"].join("\n"),"</div>",'<div id = "sb-title">',["<img src= "+HOME+"/stereopaw-marklet-title.png/>"].join("\n"),"</div>"].join("\n"),_content=[_header,'<div id = "sb-track">',['<div id = "sb-track-title-label" class = "sb-label">Title</div>','<div id = "sb-track-title"></div>','<div id = "sb-track-artist-label" class = "sb-label">Artist</div>','<div id = "sb-track-artist"></div>','<div id = "sb-track-time-label" class = "sb-label">Timestamp</div>','<div id = "sb-time"></div>'].join("\n"),"</div>",'<div id = "sb-player">',['<div id = "sb-display-bar">',['<div id = "sb-display-bar-elapsed"></div>','<div id = "sb-display-seek"></div>'].join("\n"),"</div>"].join("\n"),"</div>",'<div id = "sb-submit">',['<div id="sb-submit-button">Submit</div>'].join("\n"),"</div>"].join("\n"),_error=[_header,'<div id = "sb-error">',['<div class="sb-service"> This website is not yet supported </div>','<div class="sb-service"> Sorry! </div>'].join("\n"),"</div>"].join("\n"),_styles={"#sb-app":{position:"fixed !important",top:"50px !important",right:"0 !important",width:"300px","background-color":"#fff",border:"1px solid #aaa","z-index":"99999999999999999","text-align":"left",display:"none"},"#sb-error":{margin:"10px 0px"},".sb-service":{padding:"10px"},"#sb-title":{padding:"10px","margin-top":"8px","border-bottom":"1px solid #000","margin-left":"10px","margin-right":"10px"},"#sb-track":{"margin-left":"10px","font-size":"14px","padding-top":"10px","margin-right":"10px",font:'12px/1.4 "Lucida Grande","Lucida Sans Unicode","Lucida Sans",Garuda,Verdana,Tahoma,sans-serif;'},"#sb-close":{"float":"right",padding:"8px","padding-right":"6px",cursor:"pointer"},"#sb-logo":{"float":"left",padding:"8px","padding-left":"10px","margin-right":"4px"},"#sb-time":{"font-size":"14px"},"#sb-display-bar":{width:"100%",cursor:"pointer",height:"10px","background-color":"#000",display:"none"},"#sb-display-bar-elapsed":{width:"0%",height:"8px","background-color":"#aaa"},".sb-label":{"font-size":"12px","margin-top":"10px",color:"#a2a2a2"},"#sb-track-title":{"font-size":"18px"},"#sb-track-artist":{"font-size":"14px"},"#sb-display-seek":{position:"relative",top:"-8px",width:"2px",height:"10px","background-color":"#eee111",display:"none"},"#sb-submit":{width:"100%;","margin-top":"20px"},"#sb-submit-button":{background:"#0066cc",color:"white",padding:"10px",margin:"10px","text-align":"center","font-size":"14px",cursor:"pointer"}},page={insert_page:function(){build_element({type:"div",attr:"id",value:"sb-app"},_content),build_element({type:"style",attr:"id",value:"sb-style"},parseCSSObj(_styles))},insert_error_page:function(){build_element({type:"div",attr:"id",value:"sb-app"},_error),build_element({type:"style",attr:"id",value:"sb-style"},parseCSSObj(_styles))}};return page}(),SB.Service=function(){function _find(){_services.some(function(regex){return(m=regex.exec(_locale))?_match=m[1]:void 0})}var service={},_services=[/^https?:\/\/.*(mixcloud).com/g,/^https?:\/\/.*(soundcloud).com/g,/^https?:\/\/.*(youtube).com/g,/^https?:\/\/.*(spotify).com/g],_match=null,_locale=window.location.origin;return service.getService=function(){return null==_match&&_find(),_match?_match.toLowerCase():"NA"},service}(),SB.Track=function(){_url=HOST+"/tracks/new";var track={},_title="",_track_id="",_artist="",_profile_url="",_duration="",_timestamp="",_page_url="",_timeformat="",_subtrack="",_subartist="",_elapsed="",_shareable="";return _service="",_artwork_url="",track.set=function(track_id,artist,title,profile_url,duration,timestamp,timeformat,page_url,shareable,service,artwork_url){_track_id=track_id,_artist=artist,_title=title,_profile_url=profile_url,_duration=duration,_timestamp=timestamp,_timeformat=timeformat,_page_url=page_url,_shareable=shareable,_service=service,_artwork_url=artwork_url,_elapsed=timestamp/duration},track.getURL=function(){return _url+"?track[track_id]="+encodeURIComponent(_track_id)+"&track[artist]="+encodeURIComponent(_artist)+"&track[title]="+encodeURIComponent(_title)+"&track[page_url]="+encodeURIComponent(_page_url)+"&track[profile_url]="+encodeURIComponent(_profile_url)+"&track[timeformat]="+encodeURIComponent(this.getTimeFormat())+"&track[timestamp]="+encodeURIComponent(_timestamp)+"&track[duration]="+encodeURIComponent(_duration)+"&track[shareable]="+encodeURIComponent(_shareable)+"&track[service]="+encodeURIComponent(_service)+"&track[artwork_url]="+encodeURIComponent(_artwork_url)+"&track[subtrack]="+encodeURIComponent(_subtrack)+"&track[subartist]="+encodeURIComponent(_subartist)},track.getTitle=function(){return _title},track.getArtist=function(){return _artist},track.getTimeFormat=function(){return _timeformat},track.getElapsed=function(){return _elapsed},track.getDuration=function(){return _duration},track}(),SB.Data=function(){function try_get(f1,f2,def){try{return f1()}catch(err){try{return f2()}catch(err2){return def}}}var _service=null,_track=null,_player=null,_set={mixcloud:function(){var mc_time,mc={};mc=try_get(function(){return $("#player-module").data()["controller:player_module"].playerStatus},function(){return 0},{}),mc_time=try_get(function(){return mc.audio_position},function(){return 0},0),_track.set(try_get(function(){return $("#cloudcast-owner-link > span")[0].innerHTML},function(){return $("#cloudcast-owner-link")[0].innerHTML},""),$("#cloudcast-name").html(),"http://www.mixcloud.com"+$("#cloudcast-owner-link").attr("href"),mc.now_playing_audio_length,mc_time,SB.Util.toTime(mc_time,"secs"),"http://www.mixcloud.com"+mc.now_playing_key)},soundcloud:function(){var sc_mgr=require("lib/play-manager");_player=sc_mgr.getCurrentSound();var sc_md=sc_mgr.getCurrentMetadata(),sc_time=sc_md.sound.audio.currentTime(),artwork_url=sc_md.sound.attributes.artwork_url||sc_md.sound.attributes.user.avatar_url;null==artwork_url?"":artwork_url.replace("-large.jpg","-t200x200.jpg"),_track.set(sc_md.sound.attributes.id,sc_md.sound.attributes.user.username,sc_md.sound.attributes.title,sc_md.sound.attributes.user.permalink_url,sc_md.sound.attributes.duration,sc_time,SB.Util.toTime(sc_time,"ms"),sc_md.sound.attributes.permalink_url,"public"==sc_md.sound.attributes.sharing?!0:!1,_service,artwork_url)},youtube:function(){null==_player&&(_player=document.getElementById("movie_player"));var yt_artist=try_get(function(){return document.getElementsByClassName("metadata-info-title")[1].nextSibling.nextSibling.innerHTML},function(){return""},""),yt_title=try_get(function(){return document.getElementsByClassName("metadata-info-title")[0].innerHTML.match(/"(.*)\"/)[1]},function(){return ytplayer.config.args.title},""),yt_time=try_get(function(){return _player.getCurrentTime()},function(){return 0},0),yt_duration=try_get(function(){return _player.getDuration()},function(){return 0},0);_track.set(ytplayer.config.args.video_id,yt_artist,yt_title,ytplayer.config.args.loaderUrl,yt_duration,yt_time,SB.Util.toTime(yt_time,"secs"),ytplayer.config.args.loaderUrl,!0,_service,"http://img.youtube.com/vi/"+ytplayer.config.args.video_id+"/0.jpg")},spotify:function(){var duration=SB.Util.TimetoMs(window.frames[1].document.getElementById("track-length").innerHTML),time=SB.Util.TimetoMs(window.frames[1].document.getElementById("track-current").innerHTML);_track.set(window.frames[1].document.getElementById("track-name").children[0].href.match(/track\/(.*)/)[1],window.frames[1].document.getElementById("track-artist").children[0].text,window.frames[1].document.getElementById("track-name").children[0].text,window.frames[1].document.getElementById("track-artist").children[0].href,duration,time,window.frames[1].document.getElementById("track-current").innerHTML,window.frames[1].document.getElementById("track-name").children[0].href,!0,"spotify")},grooveshark:function(){},"8tracks":function(){},earbits:function(){},pandora:function(){},NA:function(){return"NA"}},_audiomgr={soundcloud:{seek:function(percentage){_player.seek(percentage*_track.getDuration())},pause:function(){},play:function(){}},youtube:{seek:function(percentage){_player.seekTo(percentage*_track.getDuration())},pause:function(){},play:function(){}},NA:function(){return"NA"}},data={};return data.setTrack=function(service,track){_service=service,_track=track,_set[_service]()},data.seek=function(percentage){_audiomgr[_service].seek(percentage)},data}(),SB.init();