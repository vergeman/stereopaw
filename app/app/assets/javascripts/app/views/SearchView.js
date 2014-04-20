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

    initialize : function(models, opts) {
	if (DEBUG)
	    console.log("[SearchView] initialize")

	this.trackscollection = opts.trackscollection
	this.query = opts.query

	this.bind_search_form()

 	/*initial track search*/
	this.tracksView = new app.TracksView(this.trackscollection)

	/*
	 *re-render upon login detect for 'mytracks' 
	 * filter option*/
	this.listenTo(app.vent, "Session:logged-in", this.render)

	_(this).bindAll('close')

	/*add footer post render*/
	this.listenToOnce(this.trackscollection, 'render', this.renderfooter)

    },

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

    search_playlists : function() {
	if (DEBUG)
	    console.log("[SearchView] search_playlists")

    },

    render : function() {
	if (DEBUG)
	    console.log("[SearchView] render")

	this.$el.html(
	    this.template(
		{
		    query: this.query,
		    current_user: this.trackscollection.session.get("current_user")
		}
	    )
	)

	this.$el.append(this.tracksView.el)

	return this;
    },

    renderfooter: function() {
	if (DEBUG)
	    console.log("[SearchView] renderfooter")

	/*footer add tracks
	 *triggered from TracksView collection render
	 */

	this.$el.append(this.templatefooter() );
	$(document).foundation()

	return this;
    },

    close : function() {
	if (DEBUG)
	    console.log("[SearchView] close")

	this.tracksView.close()
	this.remove()
	this.unbind()
    }

})
