var app = app || {};

app.Track = Backbone.Model.extend({ 

    defaults : {},
    initialize : function() 
    {
	this.gen_age();
	this.gen_attribute_link();
	this.gen_duration_format();

	this.set("played", false)

	this.listenTo(app.vent, "Track:ResetPlayed", this.reset_played)

	if (DEBUG)
	    console.log("[Track] initalized")
    },

    reset_played : function() {
	if (DEBUG)
	    console.log("[Track] reset_played")

	this.set("played", false)
    },

    played : function() {
	if (DEBUG)
	    console.log("[Track] played")

	this.set("played", true)
    },

    /* we don't BB.sync since track is a nested resource
     * 'owned' by a user, so we're not interested in
     * updating all attributes - just a quick play counter.
     */
    increment_plays : function() {
	if (DEBUG)
	    console.log("[Track] increment_plays")

	/* client side mini 'rate-limiting' - only count a play
	 * if another track has been played on same route
	 *..to just prevent mass clicking
	 */

	if (this.get("played") ) {
	    return;
	}
	var data = {'track': { 'id': this.get("id") } }
	var self = this;
	$.post("/tracks/play.json",
	       data,
	       function(data) {
		   /*clear played flag in *all* models*/
		   app.vent.trigger("Track:ResetPlayed")
		   self.set("plays", self.get("plays") + 1)
		   self.played()
	       }
	      )

    },

    gen_duration_format: function() {
	var service = this.get("service")
	var duration = this.get("duration")

	this.set("duration_format", 
		 app.Util.time_format(service, duration));
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
		    attribution_url: "//developers.google.com/youtube/images/YouTube_logo_standard_white.png",
		    attribution_width: "60px",
		    attribution_height: "38px"
		}
	    )
	    break;

	case 'soundcloud':
	    this.set(
		{
		    attribution_url: "//developers.soundcloud.com/assets/logo_black.png",
		    attribution_width: "104px",
		    attribution_height: "16px"
		}
	    )
	    break;

	default:
	    this.set({attribution_url: ""})
	}
    }

});

