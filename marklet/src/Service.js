/*
 * Get service name from website
 * or else service NA (todo: error handling)
 */

SB.Service = (function () {
    var service = {};

    var _services = 
	[
		/^https?:\/\/.*(mixcloud).com/g,
		/^https?:\/\/.*(soundcloud).com/g,
		/^https?:\/\/.*(youtube).com/g,
		/^https?:\/\/.*(spotify).com/g,
		/^https?:\/\/.*(stereopaw).com/g
	    /*diffuclty passing regex via .env.dev*/
	    /*@ifdef DEBUG*/
	    ,
	    	/^https?:\/\/.*(compute.amazonaws.com:5151)/g
	    /*@endif*/
	],

    _match = null,
    _locale = window.location.origin;

    function _find() {
	_services.some(function(regex) {
	    if ( m = regex.exec(_locale) ) {
		/* @ifdef DEBUG*/
		if (m[1] == "compute.amazonaws.com:5151") {
		    m[1] = "stereopaw"
		}
		/*@endif*/
		return _match = m[1];
	    }
	})
    }

    service.getService = function() {
	if (_match == null) {
	    _find()
	}
	return _match ? _match.toLowerCase() : "NA"
    };

    return service;

}());
