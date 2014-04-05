var app = app || {};

app.Util = Backbone.Model.extend({ 

    defaults :{},
    initialize : function() {},
},


{
    /*STATIC UTIL */

    /*show_error is commonly used throughout views
     * to display json errors on the forms
     */
    show_error : function(errors) {
	if (DEBUG)
	    console.log("[Util] show_error")
	//clear all errors
	$('small').removeClass('error')
	$('small').html('')
	$('.input-label-prefix > span').css("color", "#333333")

	//add any errors
	_.each(errors, function(val, key) {

	    $('.error_' + key).html(val)
	    $('.error_' + key).addClass('error')
	    $('.error_' + key).parent().prev().children().css("color", "orangered")
	    $('.error_' + key).show()
	});
    },


    /*makes array of args for Date.UTC, converting timeformat 
     *to [0, 0, ...] 
     *with each element a unit of time up to seconds
     */
    _sec_to_times : function(formatted_time) {
        var times = (formatted_time.split(":")).reverse()
	times = times.map(function(i) { return i * 1 })
        while (times.length < 6) {
            times.push(0)
        }
	return times.reverse()
    },

    /*converts a timeformat to milleseconds
     * ex: "1:01" -> 61000 milleseconds
     */
    to_ms : function(formatted_time) {	
	return Date.UTC.apply(window, this._sec_to_times(formatted_time)) - Date.UTC.apply(window, this._sec_to_times("0"))
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
