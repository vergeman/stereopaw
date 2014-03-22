
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

	this.increment_plays(e);
    },

    stop : function() {
	console.log("[TrackView] stop")
    },

    close : function() {
	console.log("[TrackView] close")
	this.remove()
	this.unbind()
    },

    /* we don't sync since track is a nested resource
     * 'owned' by a user, so eveyrone shouldn't be
     * able to update attributes. 
     * also it's simple enough and I suspect there will
     * be other operations needed besides just updating 
     * a play count
     */
    increment_plays : function(e) {
	console.log("[TrackView] increment_plays")
	var self = this;
	var $track_meta = $(e.currentTarget).closest('.track-meta')
	var data = {'track': { 'id': $track_meta.attr("id") } }

	$.post("/tracks/play.json",
	       data,
	       function(data) {
		   self.model.set("plays", 
				  self.model.get("plays") + 1)
	       }
	      )
    }

})

