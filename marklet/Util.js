
SB.Util = (function() {

    var util = {};


    function prezero(num)
    {
	return (num.toFixed().length > 1 ? num.toFixed() : "0" + num.toFixed())
    }

    function formatTime(hours, min, sec)
    {
	if (hours < 1)
	{
	    return prezero(min) + ":" + prezero(sec)
	}

	return hours + ":" + prezero(min) + ":" + prezero(sec)
    }


    /*toTime - returns formatted time from ms or secs*/
    util.toTime = function(secs, scale)
    {
	var alpha = (scale == "secs") ? 1 : 1000;

	var hours =  Math.floor(secs / (3600.0 * alpha) )

	var min = Math.floor( (secs / (60.0 * alpha)) - 60 * hours )

	var sec = (secs / (60 * alpha) - (60 * hours) -  min) * 60 

	/*granularity: round vs floor*/
	if (scale == "secs") 
	{
	    return formatTime(hours, min, Math.round(sec))
	}

	return formatTime(hours, min, Math.floor(sec))
    }


    util.load_jQuery = function() {

	if ( typeof jQuery === "undefined" )
	{
	    var script = document.createElement('script')
	    script.id = 'sb-jb'
	    script.type = 'text/javascript'
	    script.src = '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'
	    document.body.appendChild(script)
	}

    }

    return util;
}());





