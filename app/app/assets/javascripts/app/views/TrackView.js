
var app = app || {};

/* Track View */

app.TrackView = Backbone.View.extend({

    tagName: 'div',

    className: 'track',

    template: JST['tracks/show'],    

    initialize: function() {
	this.listenTo(this.model, "change", this.render)
    },

    events : 
    {
	'click .play' : 'play',
	'click .stop' : 'stop'
    },

    render: function() {
	/* we pass track_age separately, as rails seems 
	 * to have trouble rendering template if we generate
	 * an attribute outside of what's persisted
	 */
	this.$el.html( this.template({track: this.model.toJSON(),
				      track_age: this.model.get("age")}) );
	
	return this;
    },

    play : function(e) {
	console.log("[TrackView] play")

	var time = $(e.currentTarget).attr('timestamp');

	app.vent.trigger("Player:play", $(e.currentTarget).parents('.track-meta'), time)

    },
    stop : function() {
	console.log("[TrackView] stop")
    },

    close : function() {
	console.log("[TrackView] close")
	this.remove()
	this.unbind()
    }
})

