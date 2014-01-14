/* 
 * Track Class
 * contains information to be marked
 */
SB.Track = (function() {
    _url = "http://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5151/tracks/new";

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


    track.set = function(track_id, artist, title, profile_url, duration, timestamp, timeformat, page_url, shareable) {

	_track_id = track_id
	_artist = artist
	_title = title
	_profile_url = profile_url
	_duration = duration	//length of song/mix
	_timestamp = timestamp  //raw time ex: 12312310 (ms)
	_timeformat = timeformat  //time of submission ex: 1:12
	_page_url = page_url
	_shareable = shareable
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

    return track;

}());

