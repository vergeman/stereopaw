var app = app || {};

app.Track = Backbone.Model.extend({ 

    defaults : {},

    initialize : function() 
    {
	console.log("[Track] initalized")
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

