
var app = app || {};

/* Track View */

app.TrackView = Backbone.View.extend({

    tagName: 'div',

    className: 'track',

    template: JST['tracks/show'],    

    initialize: function(opts) {
	this.listenTo(this.model, "change", this.render)
	this.editable = opts.editable
	this.playlistable = opts.playlistable
	this.playlistdropdown= null
	this.services = ["youtube", "soundcloud"]
    },

    events : 
    {
	'click .play' : 'play',
	'click .stop' : 'stop',
	'click .playlist' : 'playlist'
    },

    render: function() {
	/* we pass track_age separately, as rails seems 
	 * to have trouble rendering template if we generate
	 * an attribute outside of what's persisted
	 *
	 * this.model & this.editable are passed as args in 
	 * TracksView:add_collection()
	 */
	this.$el.html( this.template(
	    {
		track: this.model.toJSON(),
		track_age: this.model.get("age"),
		editable: this.editable,
		playlistable : this.playlistable
	    }
	));
	
	return this;
    },

    play : function(e) {
	if (DEBUG)
	    console.log("[TrackView] play")

	var $track_meta = $(e.currentTarget).parents('.track-meta')
	var timestamp = $(e.currentTarget).attr('timestamp');
	var service = $track_meta.attr("service")

	/*play in-site*/
	if ($.inArray(service, this.services) >= 0) {

	    app.vent.trigger("Player:play", $track_meta, timestamp)

	}
	/*launch external site*/
	else {

	    app.vent.trigger("Player:play_extension",
			     $track_meta, timestamp)

	}

    },

    stop : function() {
	if (DEBUG)
	    console.log("[TrackView] stop")
    },

    playlist : function(e) {
	if (DEBUG)
	    console.log("[TrackView] playlist")
	var $track = $(e.currentTarget).closest('.track-meta')

	/*noticed a race condition w/ YouTube Player 
	 *that (rarely) messes dropdowns, so we create anew
	 *everytime, seems to lead to consistent behavior
	 */
	if(this.playlistdropdown) {
	    this.playlistdropdown.close()
	}

	this.playlistdropdown = new app.PlaylistsDropDownView($track) 
	this.$el.find('.playlist').append(this.playlistdropdown.$el)
    },

    close : function() {
	if (DEBUG)
	    console.log("[TrackView] close")

	if (this.playlistdropdown) {
	    this.playlistdropdown.close()
	}

	this.remove()
	this.unbind()
    }
})

