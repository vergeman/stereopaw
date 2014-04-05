
var app = app || {};

app.PlaylistView = Backbone.View.extend({


    tagName: 'div',

    className: 'playlist',

    template: JST['playlists/show'],

    initialize : function(opts) {
	if (DEBUG)
	    console.log("[PlaylistView] initialize")

	this.listenTo(this.model, "change", this.render)

    },

    events : {},

    render: function() {
	if (DEBUG)
	    console.log("[PlaylistView] render")
	this.$el.html( this.template( 
	    { playlist: this.model.toJSON() } 
	));
	return this;
    },

    close : function() {
	if (DEBUG)
	    console.log("[PlaylistView] close")
	this.remove()
	this.unbind()
    }
});
