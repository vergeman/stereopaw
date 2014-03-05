var app = app || {};

app.AppRouter = Backbone.Router.extend({
    /* visit i.e. / or /#testpath */

    routes : 
    {
	'' : 'tracksindex',
	'login' : 'login',
	'signup' : 'signup',
	'edituser' : 'edituser'
    },

    initialize : function() {
	console.log("[AppRouter] initialize")

	this.trackscollection = new app.Tracks();
	this.playerview = new app.PlayerView(this.trackscollection);
	this.session = new app.Session()

	this.profileview = new app.ProfileView(this.session)

	this.currentView = null;

    },

    edituser : function() {
	console.log("[AppRouter] edituser")

	//if we haven't checked login, wait?
	//if we're not logged in, goto #login
	if (this.session.get("state") != app.Session.SessionState.LOGGEDIN) {
	    Backbone.history.navigate("/#", {trigger:true})
	    return;
	}

	if (this.currentView) {
	    this.currentView.close()
	}

	this.edituserView = new app.EdituserView(this.session);
	this.currentView = this.edituserView

	$('#content-wrap').html(this.edituserView.render().el)
	this.navigate('/edituser')


    },

    signup : function() {
	console.log("[AppRouter] login")

	if (this.session.get("state") == app.Session.SessionState.LOGGEDIN) {
	    Backbone.history.navigate("/", {trigger:true})
	    return
	}

	if (this.currentView) {
	    this.currentView.close()
	}

	this.signupView = new app.SignupView(this.session);
	this.currentView = this.signupView

	$('#content-wrap').html(this.signupView.render().el)

	this.navigate('/signup')

    },

    login : function() {
	console.log("[AppRouter] login")


	if (this.session.get("state") == app.Session.SessionState.LOGGEDIN) {
	    Backbone.history.navigate("/", {trigger:true})
	    return
	}


	if (this.currentView) {
	    this.currentView.close()
	}

	this.loginView = new app.LoginView(this.session);
	this.currentView = this.loginView

	$('#content-wrap').html(this.loginView.render().el)

	this.navigate('/login')
    },
    
    tracksindex : function() {
	console.log("[AppRouter] tracksindex view")

	if (this.currentView) {
	    this.currentView.close()
	}

	/* pass manipulation of tracks collection
	   i.e. app.Tracks('popular') for type of view
	*/
	this.TracksIndexView = (new app.TracksIndexView(this.trackscollection) )
	this.currentView = this.TracksIndexView;

	console.log(this.trackscollection)
	$('#content-wrap').html(this.TracksIndexView.render().el)

	this.navigate("/")

    }


});
