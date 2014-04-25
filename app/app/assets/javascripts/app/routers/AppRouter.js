var app = app || {};

app.AppRouter = Backbone.Router.extend({
    /* visit i.e. / or /#testpath */

    routes : 
    {
	'' : 'root',

	/*tracks*/
	'edit/:user_id/:track_id' : 'edit_track',
	'tracks' : 'my_tracks',
	'popular' : 'popular_tracks',
	'new' : 'new_tracks',

	/*search*/
	'search/genres/:query' : 'search_genres',
	'search/playlists/:query' : 'search_playlists',
	'search/me/:query' : 'search_me',
	'search/:query' : 'search_all',

	/*submit*/
	'submithow' : 'submithow',

	/*playlists*/
	'playlists' : 'playlists',
	'playlists/:playlist_id' : 'playlist',

	/*devise*/
	'login' : 'login',
	'forgot' : 'forgot',
	'signup' : 'signup',
	'edituser' : 'edituser',
    },


    initialize : function() {
	if (DEBUG)
	    console.log("[AppRouter] initialize")

	this.trackscollection = new app.Tracks()

	if (DEBUG)
	    console.log(this.trackscollection )

	this.player = new app.Player();

	this.playerqueue = new app.PlayerQueue("/tracks", this.trackscollection);

	this.playerview = new app.PlayerView(this.player,
					     this.playerqueue,
					     this.trackscollection);
	this.session = new app.Session()

	this.playlistsMgr = new app.PlaylistsMgr(this.session)

	this.playlistsmodal = new app.PlaylistsModalView(this.session)
	this.navigationview = new app.NavigationView(this.session)

	this.getextensionview = new app.GetExtensionView();

	this.currentView = null;
    },


/*Devise Routes*/
    edituser : function() {
	if (DEBUG)
	    console.log("[AppRouter] edituser")

	var redirect = function() { 
	    Backbone.history.navigate("/", {trigger:true})
	}

	if (this.checkauth(app.Session.SessionState.LOGGEDIN,
			   redirect))
	{
	    this.view(new app.EdituserView(this.session), 
		      "/edituser" )
	}

	app.vent.trigger("NavigationView:ActivateLink", "settings")

    },

    forgot : function() {
	if (DEBUG)
	    console.log("[AppRouter] forgot")

	var redirect = function() { 
	    Backbone.history.navigate("/", {trigger:true})
	}

	/*if not logged in, we render forgot view, otherwise
	 *redirect to root*/
	if (!this.checkauth(app.Session.SessionState.LOGGEDIN, 
			   function(){}))
	{
	    this.view(new app.ForgotpasswordView(this.session),
		      "/forgot" )
	}
	else {
	    redirect()
	}
	app.vent.trigger("NavigationView:ActivateLink", "login_nav")
    },

    signup : function() {
	if (DEBUG)
	    console.log("[AppRouter] signup")

	var redirect = function() { 
	    Backbone.history.navigate("/", {trigger:true})
	}

	/*if not logged in, we render signup view, otherwise
	 *redirect to root*/
	if (!this.checkauth(app.Session.SessionState.LOGGEDIN, 
			   function(){}))
	{
	    this.view(new app.SignupView(this.session),
		      "/signup" )
	}
	else {
	    redirect()
	}

	app.vent.trigger("NavigationView:ActivateLink", "login_nav")
    },

    login : function() {
	if (DEBUG)
	    console.log("[AppRouter] login")

	/*if not logged in, we render signin view, otherwise
	 *we're logged in so redirect to root*/

	if (!this.checkauth(app.Session.SessionState.LOGGEDIN,
			    function(){} ))
	{
	    this.view(new app.LoginView(this.session),
		      "/login" )
	}
	else {
	    Backbone.history.navigate("/", { trigger:true})
	}
	app.vent.trigger("NavigationView:ActivateLink", "login_nav")
    },

/*
 *Playlist Routes
 */

    /*Playlist Index*/
    playlists : function() {
	if (DEBUG)
	    console.log("[AppRouter] playlists")

	var self = this;
	var playlists = this.playlistsMgr.playlists
	var redirect = function() { 
	    Backbone.history.navigate("/login", {trigger:true})
	}

	if (this.checkauth(app.Session.SessionState.LOGGEDIN,
			   redirect))
	{

	    this.view(new app.PlaylistsIndexView(playlists), '/playlists' )
	}

	app.vent.trigger("NavigationView:ActivateLink", "playlist")
    },

    /*Playlist View individual*/
    playlist : function(playlist_id) {
	if (DEBUG)
	    console.log("[AppRouter] playlist")

	var self = this;
	var playlist = this.playlistsMgr.playlists.get(playlist_id)

	var redirect = function() { 
	    Backbone.history.navigate("/login", {trigger:true})
	}

	if (this.checkauth(app.Session.SessionState.LOGGEDIN,
			   redirect))
	{
	    var routename = "/playlists/" + playlist.get("id")
	    this.view(
		new app.PlaylistTracksView(
		    [], 
		    {
			playlist: playlist,
		    }),
		routename)
	}

	app.vent.trigger("NavigationView:ActivateLink", "playlist")

    },


/*Track Routes*/
    my_tracks : function() {
	if (DEBUG)
	    console.log("[AppRouter] my_tracks")

	var redirect = function() { 
	    Backbone.history.navigate("/login", {trigger:true})
	}

	if (this.checkauth(app.Session.SessionState.LOGGEDIN,
			   redirect))
	{
	    this.generate_trackview("/tracks", "tracks")
	}

	app.vent.trigger("NavigationView:ActivateLink", "mytracks")
    },

    edit_track : function(user_id, track_id) {
	if (DEBUG)
	    console.log("[AppRouter] edit_track")

	var redirect = function() { 
	    Backbone.history.navigate("/login", {trigger:true})
	}

	if (this.checkauth(app.Session.SessionState.LOGGEDIN,
			   redirect))
	{
	    
	    this.view(new app.EditTrackView({track_id : track_id,
					     user_id : user_id,
					     session : this.session}),
		      "/edit/" + user_id + "/" + track_id)
	}

	app.vent.trigger("NavigationView:ActivateLink", "mytracks")
    },

    new_tracks : function() {
	if (DEBUG)
	    console.log("[AppRouter] new_tracks")

	this.generate_trackview("/new", "new")
	app.vent.trigger("NavigationView:ActivateLink", "new")
    },


    popular_tracks : function() {
	if (DEBUG)
	    console.log("[AppRouter] popular")

	this.generate_trackview("/popular", "popular")
	app.vent.trigger("NavigationView:ActivateLink", "popular")
    },
    
    submithow : function() {
	if (DEBUG)
	    console.log("[AppRouter] submit")

	this.view(new app.SubmitView(), "/submithow")
	$(document).foundation()

	app.vent.trigger("NavigationView:ActivateLink", "submit")
    },

/*search routes*/
    search_all : function(query) {
	if (DEBUG)
	    console.log("[AppRouter] search_all")

	var route = "/search/" + query
	this.trackscollection.url = "/search?q=" + query
	this._searchTracks(route, query, "all")
    },

    search_me : function(query) {
	if (DEBUG)
	    console.log("[AppRouter] search_me")

	var route = "/search/me/" + query
	this.trackscollection.url = "/search/me?q=" + query
	this._searchTracks(route, query, "mytracks")


    },

    search_genres : function(query) {
	if (DEBUG)
	    console.log("[AppRouter] search_genres")

	var route = "/search/genres/" + query
	this.trackscollection.url = "/search/genres?q=" + query
	this._searchTracks(route, query, "genres")

    },

    search_playlists : function(query) {
	if (DEBUG)
	    console.log("[AppRouter] search_playlists")

	var route = "/search/playlists/" + query
	var search_playlist = new app.Playlists()
	search_playlist.set_url("/search/playlists?q=" + query)

	this.view(
	    new app.SearchView(
		{
		    collection: search_playlist,
		    View : new app.PlaylistsView(search_playlist),
		    session: this.session,
		    query : query,
		    fetch : true,
		    link: "playlists"
		}
	    ), route)

	//activate/hightlight linky?
	app.vent.trigger("NavigationView:ActivateLink", "search")
    },

/*ROOT*/
    root : function() {
	if (DEBUG)
	    console.log("[AppRouter] root")

	/*default view logged in -> /tracks
	 *otherwise -> /popular
	 */
	var redirect = function() { 
	    Backbone.history.navigate("/popular", {trigger:true})
	}

	if (this.checkauth(
		app.Session.SessionState.LOGGEDIN,
		redirect) )
	{
	    this.generate_trackview("/tracks", "tracks")
	    app.vent.trigger("NavigationView:ActivateLink", 
			     "mytracks")
	}
    },

/*private*/
    _searchTracks : function(route, query, link) {

	this.trackscollection.session = this.session
	this.playerqueue.update(route, this.trackscollection)

	this.view(
	    new app.SearchView(
		{
		    collection: this.trackscollection,
		    View : new app.TracksView(this.trackscollection),
		    session: this.session,
		    query : query,
		    fetch : false,
		    link: link
		}
	    ), route)

	//activate/hightlight linky?
	app.vent.trigger("NavigationView:ActivateLink", "search")
    },

    generate_trackview : function(route, displayroute) {

	this.trackscollection.url = route
	this.trackscollection.session = this.session
	this.playerqueue.update(route, this.trackscollection)
	this.view(new app.TracksIndexView
		  (this.trackscollection, displayroute), displayroute )

    },

    /*true if session state matches given state, executes
     *'otherwise' callback and returns false
     * we structure it with a callback because we want to
     * control our Backbone.history.navigate calls when
     * checking against the session state. It may be the
     * case the otherwise is a no-op.
     */
    checkauth : function(state, otherwise) {
	if (this.session.get("state") == state) {
	    return true
	}
	otherwise()
	return false
    },

    /*render and garbage collect discarded views*/
    view : function(view, updateroute) {

	if (this.currentView) {
	    this.currentView.close()
	}

	this.currentView = view	
	$('#content-wrap').html(this.currentView.render().el)

	/*add playlists modal*/
	$('#content-wrap').append(this.playlistsmodal.el)

	/*add getextension modal*/
	$('#content-wrap').append(this.getextensionview.render().el)

	this.navigate(updateroute)
    }
});
