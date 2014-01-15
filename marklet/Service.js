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
	],
    _match = null,
    _locale = window.location.origin;

    function _find() {
	_services.some(function(regex) {
	    if ( m = regex.exec(_locale) ) {
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
