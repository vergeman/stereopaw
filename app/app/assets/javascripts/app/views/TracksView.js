var app = app || {}

app.TracksView = Backbone.View.extend({
    
    tagname: 'div',

    id: 'tracks',

    initialize: function(tracks_collection) {
	console.log("[TracksView] initialize")

	this._trackViews = [];

	this.collection = tracks_collection;

	_(this).bindAll('close') //garbage collection


	this.listenTo(this.collection, 'add', this.add_collection)
	this.listenTo(this.collection, 'remove', this.remove_collection)	
	/* render triggered after each fetch*/
	this.listenTo(this.collection, 'render', this.render)
	this.listenTo(this.collection, 'render', this.lastTrackPageHandler)

	/*fetch initial batch*/
	this.page = 0
	this.fetch_next_page()

	var self = this;
    },

    /*fetches the next page (set of tracks)
     *and increments page counter
     */
    fetch_next_page : function() {
	console.log("[TracksView] fetch_next_page: " + this.page)
	var self = this;

	var success =  function(collection, response, options) {

	    /*initial render as we need to trigger
	     * footer render
	     */
	    collection.trigger("render")

	    /*we want to stop rendering on empty's, messes up
	     *some bound events i.e. PlaylistDropDownView
	     */
	    if (response.length != 0) {
		self.page += 1
	    }
	}

	this.collection.fetch
	(
	    {
		data : {page: this.page},
		add: true,
		remove: false,
		success: success
	    }
	)
    },

    /*lastTrackPageHandler: on fresh render event, handler
     *identifies the last track, and if in view
     *fetches the next set (page) of tracks
     */
    lastTrackPageHandler: function() {
	console.log("TracksView] lastTrackPageHandler")
	var self = this;
	$last = $('.track').last()

	/* we trigger only once, as "last" element
	 * will change  */
	$last.one('inview', function(e, isInView) {
	    if(isInView) {
		self.fetch_next_page()
	    }
	});
    },
    
    /*helper to generate url links for editable tracks*/
    _editable_url : function(model) {
	if (!this.collection.session.get("current_user") ) {
	    return false;
	}
	var id = this.collection.session.get("current_user").id

	if (model.get("user_id") != id) {
	    return false
	}

	//so it matches we can edit
	return "/meow#edit/" + id + "/" + model.get("id")
    },

    is_playlistable : function() {
	if (!this.collection.session.get("current_user") ) {
	    return false;
	}
	return true
    },
    /* creates TrackView model and adds 
     * to internal _trackViews collection
     */ 
    add_collection : function(model) {
	console.log("[TracksView] add")
	var _editable = this._editable_url(model)
	var tv = new app.TrackView(
	    { 
		model : model ,
		editable : _editable,
		playlistable: this.is_playlistable()
	    } 
	) 
	this._trackViews.push(tv)
    },

    remove_collection : function(model) {
	console.log("[TracksView] remove")
	var tv_remove = _(this._trackViews).select(function(tv) { return tv.model === model; })[0];
	this._trackViews = _(this._trackViews).without(tv_remove);
	tv_remove.close()
    },

    render: function() {
	console.log("[TracksView] render")

	_(this._trackViews).each(function(tv) {
	    this.$el.append( tv.render().el )
	}, this);
    },

    close : function() {
	console.log("[TracksView] close")

	_(this._trackViews).each(function(tv) {
	    tv.close()
	});

	this._trackViews.length = 0
	this.collection.reset()

	this.remove()
	this.unbind()
    }

});
