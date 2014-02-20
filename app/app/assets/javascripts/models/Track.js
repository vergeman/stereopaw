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
    }

});

