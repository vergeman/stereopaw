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

	//this.loadellipsis();
    },

    renderTrack: function(track) {
	console.log("[TracksView] renderTrack")

	var trackView = new app.TrackView( {
	    model: track
	});

	this.$el.append( trackView.render().el );

    },


    loadellipsis: function() {
	console.log("[loadellipsis]")

	$(".track-title .text").dotdotdot({
	    /*The HTML to add as ellipsis. */
	    ellipsis: '... ',
	    
	    /*How to cut off the text/html: 'word'/'letter'/'children' */
	    wrap: 'word',
	    
	    /*Wrap-option fallback to 'letter' for long words */
	    fallbackToLetter: true,
	    
	    /*jQuery-selector for the element to keep and put after the ellipsis. */
	    after: null,
	    
	    /*Whether to update the ellipsis: true/'window' */
	    watch: true,
	    
	    /*Optionally set a max-height, if null, the height will be measured. */
	    height: null,
	    
	    /*Deviation for the height-option. */
	    tolerance: 0,
	    
	    /*Callback function that is fired after the ellipsis is added,
	      receives two parameters: isTruncated(boolean), orgContent(string). */
	    callback: function( isTruncated, orgContent ) {},
	    
	    lastCharacter: {
		
		/*Remove these characters from the end of the truncated text. */
		remove: [ ' ', ',', ';', '.', '!', '?' ],
		
		/*Don't add an ellipsis if this array contains 
		  the last character of the truncated text. */
		noEllipsis: []
	    }
	});

    }

});
