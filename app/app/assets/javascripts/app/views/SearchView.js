var app = app || {};

app.SearchView = Backbone.View.extend({

    tagName: 'div',

    id: 'content', 

    template: JST['search/index'],

    templatefooter : JST['tracks/footer'],

    events : 
    {	
	'click .all' : 'search_alltracks',
	'click .mytracks' : 'search_mytracks',
	'click .playlists' : 'search_playlists'
    },

    initialize : function(opts) {

	if (DEBUG)
	    console.log("[SearchView] initialize")

	this.collection = opts.collection
	this.session = opts.session
	this.query = opts.query

	/*need to fetch collection in this view*/
	if (opts.fetch) {
	    this.listenTo(this.collection, 'reset',
			  this.resetView)

	    this.collection.fetch( { reset : true } )
	}

	this.bind_search_form()

 	/*
	 * initial track fetch (search )
	 * called in trackscollection
	 */
	this.View = opts.View

	/*
	 * re-render search filter options login detect
	 */
	this.listenTo(app.vent, "Session:logged-in", this.render)

	_(this).bindAll('close')

	/*add footer post render*/
	this.listenToOnce(this.collection, 'render',
			  this.renderfooter)
    },

    render : function() {
	if (DEBUG)
	    console.log("[SearchView] render")

	this.$el.html(
	    this.template(
		{
		    query: this.query,
		    current_user: this.session.get("current_user")
		}
	    )
	)

	//this.$el.append(this.tracksView.el)
	this.$el.append(this.View.el)

	return this;
    },

    /*limited for playlists for now*/
    resetView : function() {
	if (DEBUG)
	    console.log("[SearchView] reload")

	this.View.reset(this.collection.models)
    },

    close : function() {
	if (DEBUG)
	    console.log("[SearchView] close")

	this.View.close()
	this.remove()
	this.unbind()
    },

/*button bindings*/
    bind_search_form : function() {
	if (DEBUG)
	    console.log("[SearchView] bind_search")

	$(document).one('submit', '#search-form-page', function(e) {
	    e.preventDefault()
	    var query = $('#search-box').val()
	    var route = "/search/" + query
	    Backbone.history.navigate(route, 
				      true)

	});

    },

    search_alltracks : function(e) {
	if (DEBUG)
	    console.log("[SearchView] search_alltracks")	

	e.preventDefault()
	var query = $('#search-box').val()
	var route = "/search/" + query

	Backbone.history.navigate(route, true)
    },

    search_mytracks : function(e) {
	if (DEBUG)
	    console.log("[SearchView] search_mytracks")

	e.preventDefault()
	var query = $('#search-box').val()
	var route = "/search/me/" + query

	Backbone.history.navigate(route, true)
	
    },

    search_playlists : function(e) {
	if (DEBUG)
	    console.log("[SearchView] search_playlists")

	e.preventDefault()
	var query = $('#search-box').val()
	var route = "/search/playlists/" + query

	Backbone.history.navigate(route, true)

    },


    renderfooter: function() {
	if (DEBUG)
	    console.log("[SearchView] renderfooter")

	/*
	 *footer to suggest add tracks
	 *triggered from View collection render
	 */

	this.$el.append(this.templatefooter() );
	$(document).foundation()

	return this;
    }
})
