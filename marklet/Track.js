/* 
 * Track Class
 * contains information to be marked
 */
SB.Track = (function() {
    _url = "http://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5151/Track/new";

    var track = {};
    _title = '', 
    _artist = '', 
    _profile_url='',
    _duration='',
    _timestamp='',
    _page_url='',
    _timeformat='',
    _subtrack = '',
    _subartist = '',
    _elapsed='';


    track.set = function(artist, title, profile_url, duration, timestamp, timeformat, page_url) {

	_title = title
	_artist = artist
	_profile_url = profile_url
	_duration = duration
	_timestamp = timestamp
	_page_url = page_url

	_timeformat = timeformat
	_elapsed = timestamp / duration
	/*might want to add some img urls, etc*/
    };

    track.getURL = function() {
	return _url + "?" 
	    + "u=" + encodeURIComponent(_page_url) + "&"
	    + "ts=" + encodeURIComponent(this.getTimeFormat()) + "&"
	    + "t=" + encodeURIComponent(_title) + "&"
	    + "a=" + encodeURIComponent(_artist) + "&"
	    + "st=" + encodeURIComponent(_subtrack) + "&"
	    + "sa=" + encodeURIComponent(_subartist);
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


    return track;

}());

