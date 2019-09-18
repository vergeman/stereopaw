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
	    return min + ":" + prezero(sec)
	}

	return hours + ":" + prezero(min) + ":" + prezero(sec)
    }

//format : textToSecs("1h", "34m", "10s")
    util.textToSecs = function(hrs, mins, secs) {

	var total_secs = 0;

	if (hrs)
	    total_secs += parseInt(60 * 60 * hrs[0].match(/\d+/)[0])

	if (mins)
	    total_secs += parseInt(60 * mins[0].match(/\d+/)[0])

	if (secs)
	    total_secs += parseInt(secs)

	return total_secs
    }


    util.TimetoMs = function(timestring) {

        var times = timestring.split(":");
        var ms = 0;
        var modifier = 1;
        console.log(times);
        while (times.length) {
            var unit = times.pop();
            ms += (modifier * unit * 1000);
            modifier *= 60;
        }

        return ms;
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
