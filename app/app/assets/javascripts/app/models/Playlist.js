var app = app || {};

app.Playlist = Backbone.Model.extend({

    defaults : {},

    initialize : function() {
	if (DEBUG)
	    console.log("[Playlist] initialize")
    }


});
