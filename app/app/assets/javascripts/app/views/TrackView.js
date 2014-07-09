
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
	this.is_external = opts.is_external
	this.logged_in = opts.logged_in,
	this.playlistdropdown= null
    },

    events : 
    {
	'click .play' : 'play',
	'click .stop' : 'stop',
	'click .playlist' : 'playlist',
	'click .report' : 'report_show',
	'click .options .yes' : 'report_yes',
	'click .options .no' : 'report_no'
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
		playlistable : this.playlistable,
		is_external : this.is_external,
		logged_in : this.logged_in
	    }
	));
	
	return this;
    },

    play : function(e) {
	if (DEBUG)
	    console.log("[TrackView] play")

	var $track_meta = $(e.currentTarget).parents('.track-meta')
	var timestamp = $(e.currentTarget).attr('timestamp');

	app.vent.trigger("Player:play", $track_meta, timestamp)
    },

    stop : function() {
	if (DEBUG)
	    console.log("[TrackView] stop")
    },

    report_no : function(e) {
	if (DEBUG)
	    console.log("[TrackView] report_no")

	$(e.currentTarget).parents('.options').toggle()
	$(e.currentTarget).parents('.track-report').children('.report').toggle()
    },

    report_yes : function(e) {
	if (DEBUG)
	    console.log("[TrackView] report_yes")

	/*submit track_id to backend for spam processing*/
	var track_id = this.model.get("id")

	$.post('/tracks/report.json', 
	       {'id' : track_id},
	       function(data) {
		   if (DEBUG)
		       console.log("[TrackView] POST Report cb")
	       }
	      ).fail(function() {
		  if (DEBUG)
		      console.log("[TrackView] POST Report ERROR")
	      })

	/*remove track from collection*/
	app.vent.trigger("PlayerQueue:remove_as_flagged", track_id)

	/*remove from view*/
	$(e.currentTarget).parents('.track').fadeOut(500, function() { $(this).remove();} );
    },

    report_show : function(e) {
	if (DEBUG)
	    console.log("[TrackView] report_show")

	$(e.currentTarget).toggle()
	$(e.currentTarget.parentElement)
	    .children('.options').toggle()
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

