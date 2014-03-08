var app = app || {};

app.AppRouter = Backbone.Router.extend({
    /* visit i.e. / or /#testpath */

    routes : 
    {
	'' : 'root',
	'tracks' : 'my_tracks',
	'popular' : 'popular_tracks',
	'new' : 'new_tracks',

	/*devise*/
	'login' : 'login',
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

	this.navigationview = new app.NavigationView(this.session)

	this.currentView = null;
    },

/*Devise Routes*/
    edituser : function() {
	console.log("[AppRouter] edituser")

	if (this.checkauth(
	    app.Session.SessionState.LOGGEDOUT, 
	    "/"))
	{
	    this.view(new app.EdituserView(this.session), 
		      "/edituser" )
	}

    },

    signup : function() {
	console.log("[AppRouter] signup")

	if (this.checkauth(
	    app.Session.SessionState.LOGGEDIN, 
	    "/") ) 
	{
	    this.view(new app.SignupView(this.session),
		      "/signup" )
	}
    },

    login : function() {
	console.log("[AppRouter] login")

	if (this.checkauth(
		app.Session.SessionState.LOGGEDIN,
		"/") )
	{
	    this.view(new app.LoginView(this.session),
		      "/login" )
	}

    },

/*Track Routes*/
    my_tracks : function() {
	console.log("[AppRouter] my_tracks")
	if (this.checkauth(
		app.Session.SessionState.LOGGEDOUT,
		"/login") )
	{
	    this.generate_trackview("/tracks", "tracks")
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
	if (this.checkauth(
		app.Session.SessionState.LOGGEDOUT,
		"/login") )
	{
	    this.generate_trackview("/tracks", "tracks")
	}
	else {
	    this.generate_trackview("/popular", "/")
	}

    },

/*private*/
    generate_trackview : function(route, displayroute) {

	this.trackscollection.url = route
	this.playerqueue.update(route, this.trackscollection)
	this.view(new app.TracksIndexView
		  (this.trackscollection), displayroute )

    },

    /*true if session state matches given state, false otherwise*/
    checkauth : function(state, redirect_path) {
	if (this.session.get("state") == state) {
	    Backbone.history.navigate(redirect_path, {trigger:true})
	    return false
	}
	return true
    },

    /*render and garbage collect discarded views*/
    view : function(view, updateroute) {

	if (this.currentView) {
	    this.currentView.close()
	}

	this.currentView = view	
	$('#content-wrap').html(this.currentView.render().el)

	this.navigate(updateroute)
    }
});
