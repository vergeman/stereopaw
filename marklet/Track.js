/* 
 * Track Class
 * contains information to be marked
 */
SB.Track = (function() {

    _url = HOST + "/tracks/new";

    var track = {};

    var _title = '', 
    _track_id = '', //service dependent
    _artist = '', 
    _profile_url='',
    _duration='',
    _timestamp='',
    _page_url='',
    _timeformat='',
    _subtrack = '',
    _subartist = '',
    _elapsed='',
    _shareable='';
    _service ='';
    _artwork_url= '';

/*youtube allow timestamp/duration in seconds, as 
 *the iframe player wants those values
*/
    track.set = function(track_id,
			 artist,
			 title,
			 profile_url,
			 duration, //ms
			 timestamp,
			 timeformat, //ms
			 page_url,
			 shareable,
			 service,
			 artwork_url) {

	_track_id = track_id
	_artist = artist
	_title = title
	_profile_url = profile_url
	_duration = duration	//length of song/mix
	_timestamp = timestamp  //raw time ex: 12312310 (ms)
	_timeformat = timeformat  //time of submission ex: 1:12
	_page_url = page_url
	_shareable = shareable
	_service = service
	_artwork_url = artwork_url
	_elapsed = timestamp / duration //% of track elapsed
	
	/*might want to add some img urls, etc*/
    };

    track.getURL = function() {
	return _url + "?" 
	    + "track[track_id]=" + encodeURIComponent(_track_id) + "&"
	    + "track[artist]=" + encodeURIComponent(_artist) + "&"
	    + "track[title]=" + encodeURIComponent(_title) + "&"
	    + "track[page_url]=" + encodeURIComponent(_page_url) + "&"
	    + "track[profile_url]=" + encodeURIComponent(_profile_url) +"&"
	    + "track[timeformat]=" + encodeURIComponent(this.getTimeFormat()) + "&"
	    + "track[timestamp]=" + encodeURIComponent(_timestamp) +"&"
	    + "track[duration]=" + encodeURIComponent(_duration) +"&"
	    + "track[shareable]=" + encodeURIComponent(_shareable) +"&"
	    + "track[service]=" + encodeURIComponent(_service) +"&"
	    + "track[artwork_url]=" + encodeURIComponent(_artwork_url) +"&"
//not sure about these
	    + "track[subtrack]=" + encodeURIComponent(_subtrack) + "&"
	    + "track[subartist]=" + encodeURIComponent(_subartist);
	
    }

    track.getTitle = function() {
	return _title
    };

    track.getArtist = function() {
	return _artist
    };
    
    track.getTimeFormat = function() {
	return _timeformat
    };

    track.getElapsed = function() {
	return _elapsed
    };

    track.getDuration = function() {
	return _duration
    }

    track.toJSON = function() {
	return {
	    track_id: _track_id,
	    title: _title,
	    artist: _artist,
	    profile_url: _profile_url,
	    duration: _duration,
	    timestamp: _timestamp,
	    page_url: _page_url,
	    timeformat: _timeformat,
	    subtrack: _subtrack,
	    subartist: _subartist,
	    elapsed: _elapsed,
	    shareable: _shareable,
	    service: _service,
	    artwork_url: _artwork_url,
	    url: track.getURL()
	}
    };

    return track;

}());

