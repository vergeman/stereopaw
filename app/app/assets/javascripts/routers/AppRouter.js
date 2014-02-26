var app = app || {};

app.AppRouter = Backbone.Router.extend({
    /* visit i.e. / or /#testpath */

    routes : 
    {
	'' : 'tracksindex',
	'testpath' : 'test'
    },
    initialize : function() {
	console.log("[AppRouter] initialize")
	this.trackscollection = new app.Tracks();
	this.playerview = new app.PlayerView(this.trackscollection);
	this.session = new app.Session()

	this.currentView;
    },

    test : function() {
	console.log("[AppRouter] test")

	this.loginView = new app.LoginView();
	$('#content-wrap').html(this.loginView.render().el)

	if (this.TracksIndexView) {
	    this.TracksIndexView.close()
	}
	this.navigate('/testpath')
    },

    tracksindex : function() {
	console.log("[AppRouter] tracksindex view")

	if (this.loginView) {
	    this.loginView.close()
	}

	/* pass manipulation of tracks collection
	   i.e. app.Tracks('popular') for type of view
	*/

	this.TracksIndexView = (new app.TracksIndexView(this.trackscollection) )

	console.log(this.trackscollection)
	$('#content-wrap').html(this.TracksIndexView.render().el)

	this.navigate("/")
    }


});
