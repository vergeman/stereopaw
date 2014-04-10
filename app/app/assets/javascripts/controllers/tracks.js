function _sec_to_times(formatted_time) {
    var times = (formatted_time.split(":")).reverse()
    times = times.map(function(i) { return i * 1 })
    while (times.length < 6) {
        times.push(0)
    }
    return times.reverse()
}
/*converts a timeformat to milleseconds
 * ex: "1:01" -> 61000 milleseconds
 */
function to_ms(formatted_time) {	
    return Date.UTC.apply(window, _sec_to_times(formatted_time)) - Date.UTC.apply(window, _sec_to_times("0"))
}

$('#musicbutton a').click(function(e) {
    e.preventDefault()
    window.open (document.location.origin + "/meow#tracks")
    javascript:window.close();
})



$('input#track_submit').click(function(e) {
    e.preventDefault()
    var timestamp;

    if ($('input#track_service').val() == "youtube") {
	timestamp = to_ms( $('input#track_timeformat').val() ) / 1000
    }else {
	timestamp = to_ms( $('input#track_timeformat').val() )
    }

    $('input#track_timestamp').val(timestamp)

    $('form#new_track').submit()
});


/*submit page auto close*/

$(document).ready(function() {
    //if we are on the submit page
    if ($('#musicbutton').length) {
	_interval = setInterval(function() {
	    window.close()
	}, 4000)
    }

})
