var app = app || {};

app.SearchView = Backbone.View.extend({

    tagName: 'div',

    id: 'content', 

    template: JST['search/index'],

    templateEmpty: JST['search/noresults'],

    templatefooter : JST['tracks/footer'],

    events : 
    {	
	'click .all' : 'search_alltracks',
	'click .mytracks' : 'search_mytracks',
	'click .genres' : 'search_genres',
	'click .playlists' : 'search_playlists',
	'click #search-form-page i' : 'search_submit'
    },

    initialize : function(opts) {

	if (DEBUG)
	    console.log("[SearchView] initialize")

	this.collection = opts.collection
	this.session = opts.session
	this.query = opts.query
	this.link = opts.link

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

	/*listen for render, if empty, render empty*/
	this.listenToOnce(this.collection, 'render',
			  this.renderEmpty)

	//listen to reset needed for playlist
	this.listenToOnce(this.collection, 'reset',
			  this.renderEmpty)

	/*add footer post render*/
	this.listenToOnce(this.collection, 'render',
			  this.renderfooter)

	//listen to reset needed for playlist
	this.listenToOnce(this.collection, 'reset',
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

	this.activate_link(this.link)

	this.$el.append(this.View.el)

	return this;
    },

    /*limited for playlists for now*/
    resetView : function() {
	if (DEBUG)
	    console.log("[SearchView] resetView")

	this.View.reset(this.collection.models)
    },

    close : function() {
	if (DEBUG)
	    console.log("[SearchView] close")

	//$(document).off('submit', '#search-form-page')

	this.View.close()
	this.remove()
	this.unbind()
    },

    activate_link : function(link) {
	if (DEBUG)
	    console.log("[SearchView] activate_link: " + link)

	this.$el.find(".filter." + link).addClass('active')
    },

    renderEmpty : function() {
	/* no search results */
	if (this.collection.length == 0) {
	    $('.playlist-wrap').remove()
	    this.$el.append(this.templateEmpty())
	}
    },

/*button bindings*/
    bind_search_form : function() {
	if (DEBUG)
	    console.log("[SearchView] bind_search")

	$(document).on('submit', '#search-form-page', function(e) {
	    e.preventDefault()
	    var query = $('#search-box').val()
	    var route = "/search/" + query
	    Backbone.history.navigate(route, 
				      true)
	});

    },

    search_submit : function() {
	$('#search-form-page').submit()
    },

/*filters*/
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

    search_genres : function(e) {
	if (DEBUG)
	    console.log("[SearchView] search_mytracks")

	e.preventDefault()
	var query = $('#search-box').val()
	var route = "/search/genres/" + query

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
