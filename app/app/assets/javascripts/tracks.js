/*Player events */

$('.play').click(function() {
    //also timestamp optional
    service = $(this).attr("service")
    track_id = $(this).attr("track_id")
    timestamp = $(this).attr("timestamp")
    console.log("play " + service)

    SBPlayer.play[service](track_id, timestamp)
});

$('.stop').click(function() {
    console.log("stop")
    SBPlayer.stop()
});

