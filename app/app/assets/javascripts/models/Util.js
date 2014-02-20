var app = app || {};

app.Util = Backbone.Model.extend({ 

    defaults :{},
    initialize : function() {},
},


{
    /*STATIC UTIL */
    prezero : function(num)
    {
	return (num.toFixed().length > 1 ? num.toFixed() : "0" + num.toFixed())
    },

    formatTime : function(hours, min, sec)
    {

	if (hours < 1)
	{
	    return min + ":" + this.prezero(sec)
	}

	return hours + ":" + this.prezero(min) + ":" + this.prezero(sec)
    },
    toTime : function(secs, scale)
    {

	var alpha = (scale == "secs") ? 1 : 1000;

	var hours =  Math.floor(secs / (3600.0 * alpha) )

	var min = Math.floor( (secs / (60.0 * alpha)) - 60 * hours )

	var sec = (secs / (60 * alpha) - (60 * hours) -  min) * 60 

	/*granularity: round vs floor*/
	if (scale == "secs") 
	{
	    return this.formatTime(hours, min, Math.round(sec))
	}

	return this.formatTime(hours, min, Math.floor(sec))
    },

    time_format : function(_service, _duration) {

	switch(_service) {

	    case "youtube":
	    return this.toTime(_duration, "secs");
	    break;

	    default:
	    return this.toTime(_duration, "ms");

	}
	
    }

}






);
