var app = app || {}

app.TracksView = Backbone.View.extend({
    
    tagname: 'div',

    id: 'tracks',
    
    initialize: function() {
	console.log("[TracksView] initialize")
	this.collection = new app.Tracks();
	this.listenTo( this.collection, 'reset', this.render );

	this.collection.fetch({reset: true});
	this.render();
    },

    render: function() {
	console.log("[TracksView] render")
	
	this.collection.each(function(t) {
	    this.renderTrack(t);
	}, this);

	$('#main').append(this.$el);
    },

    renderTrack: function(track) {
	console.log("[TracksView] renderTrack")

	var trackView = new app.TrackView( {
	    model: track
	});
	this.$el.append( trackView.render().el );
    }

});
