
var app = app || {};

app.PlaylistView = Backbone.View.extend({


    tagName: 'div',

    className: 'playlist',

    template: JST['playlists/show'],

    initialize : function(opts) {
	console.log("[PlaylistView] initialize")

	this.listenTo(this.model, "change", this.render)

    },

    events : {},

    render: function() {
	console.log("[PlaylistView] render")
	this.$el.html( this.template( 
	    { playlist: this.model.toJSON() } 
	));
	return this;
    },

    close : function() {
	console.log("[PlaylistView] close")
	this.remove()
	this.unbind()
    }
});
