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
	console.log("[AppRouter] initialize")


	this.trackscollection = new app.Tracks()
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

	this.currentView = null;
    },


/*Devise Routes*/
    edituser : function() {
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

    },
    forgot : function() {
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

    },

    signup : function() {
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
	
    },

    login : function() {
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

    },

/*Playlist Routes*/
    playlists : function() {
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

    },

    playlist : function(playlist_id) {
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



    },
/*Track Routes*/
    my_tracks : function() {
	console.log("[AppRouter] my_tracks")

	var redirect = function() { 
	    Backbone.history.navigate("/login", {trigger:true})
	}

	if (this.checkauth(app.Session.SessionState.LOGGEDIN,
			   redirect))
	{
	    this.generate_trackview("/tracks", "tracks")
	}


    },

    edit_track : function(user_id, track_id) {
	console.log("[AppRouter] edit_track")

	var redirect = function() { 
	    Backbone.history.navigate("/login", {trigger:true})
	}

//	if (this.checkauth(app.Session.SessionState.LOGGEDIN,
//			   redirect))
	{
	    
	    this.view(new app.EditTrackView({track_id : track_id,
					     user_id : user_id,
					     session : this.session}),
		      "/edit/" + user_id + "/" + track_id)
	}


    },

    new_tracks : function() {
	console.log("[AppRouter] new_tracks")
	this.generate_trackview("/new", "new")
    },


    popular_tracks : function() {
	console.log("[AppRouter] popular")
	this.generate_trackview("/popular", "popular")
    },
    
    root : function() {
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
	}
    },

/*private*/
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

	this.navigate(updateroute)
    }
});
