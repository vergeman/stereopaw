var app = app || {}

app.TracksView = Backbone.View.extend({
    
    tagname: 'div',

    id: 'tracks',

    initialize: function(tracks_collection) {
	console.log("[TracksView] initialize")

	this.collection = tracks_collection;

	//we set listener that calls render upon async fetch complete
	this.listenTo( this.collection, 'reset', this.render );

	this.collection.fetch({reset: true});
    },

    render: function() {
	console.log("[TracksView] render")

	this.collection.each(function(t) {
	    this.renderTrack(t);
	}, this);
	
	return this;
    },

    renderTrack: function(track) {
	//console.log("[TracksView] renderTrack")

	var trackView = new app.TrackView( {
	    model: track
	});

	this.$el.append( trackView.render().el );
    }

});
