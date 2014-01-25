var app = app || {}

app.TracksView = Backbone.View.extend({
    
    tagname: 'div',

    id: 'tracks',

    template: HandlebarsTemplates['tracks/index'],


    initialize: function() {
	console.log("[TracksView] initialize")
	this.parent = '#content';

	this.collection = new app.Tracks();
	//we set listener that calls render
	this.listenTo( this.collection, 'reset', this.render );


	this.collection.fetch({reset: true});
    },

    render: function() {
	console.log("[TracksView] render")

	this.collection.each(function(t) {
	    this.renderTrack(t);
	}, this);

	$(this.parent).append( this.template() ); //header
	$(this.parent).append(this.$el); //tracks

    },

    renderTrack: function(track) {
	console.log("[TracksView] renderTrack")

	var trackView = new app.TrackView( {
	    model: track
	});

	this.$el.append( trackView.render().el );
    }

});
