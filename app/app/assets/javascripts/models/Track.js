var app = app || {};

app.Track = Backbone.Model.extend({ 

    defaults : {},
    initialize : function() 
    {
	this.gen_age();
	this.gen_attribute_link();
	this.gen_duration_format();

	console.log("[Track] initalized")
    },
    gen_duration_format: function() {
	this.set("duration_format", this._gen_duration_format());
    },
    gen_age : function() {
	var today = new Date();
	var date = new Date( this.get('created_at') )	
	var timediff = ( today.getTime() - date.getTime() )

	if (timediff / (1000*60) < 60  ) {
	    this.set('age', Math.round(timediff / (1000*60) ) + "m")
	}
	else if (timediff / (1000*60*60) <= 24) {
	    this.set('age', Math.round(timediff / (1000*60*60) ) + "h")
	}
	else {
	    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	    this.set('age', months[date.getMonth()] + " " + date.getDate())
	}
    },

    gen_attribute_link : function() {
	switch(this.get('service') ) {
	    case 'youtube':
	    this.set(
		{
		    attribution_url: "http://developers.google.com/youtube/images/YouTube_logo_standard_white.png",
		    attribution_width: "60px",
		    attribution_height: "38px"
		}
	    )
	    break;

	    case 'soundcloud':
	    this.set(
		{
		    attribution_url: "http://developers.soundcloud.com/assets/logo_black.png",
		    attribution_width: "104px",
		    attribution_height: "16px"
		}
	    )
	    break;

	    default:
	    this.set({attribution_url: ""})
	}
    },

    /*UTIL */

    _gen_duration_format : function() {
	var _service = this.get("service")
	var _duration = this.get("duration")

	switch(_service) {

	    case "youtube":
	    return this.toTime(_duration, "secs");
	    break;

	    default:
	    return this.toTime(_duration, "ms");

	}
	
    },
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
    }

});

