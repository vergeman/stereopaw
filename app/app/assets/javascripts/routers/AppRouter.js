var app = app || {};

app.AppRouter = Backbone.Router.extend({
    /* visit i.e. / or /#testpath */

    routes : 
    {
	'' : 'appview',
	'testpath' : 'test'
    },
    initialize : function() {
	console.log("[AppRouter] initialize")
	this.trackscollection = new app.Tracks();
	this.playerview = new app.PlayerView(this.trackscollection);
    },

    test : function() {
	console.log("[AppRouter] test")
	this.view.remove();
    },

    appview : function() {
	console.log("[AppRouter] appview")

	/* pass manipulation of tracks collection
	   i.e. app.Tracks('popular') for type of view
	*/

	this.view = (new app.AppView(this.trackscollection) )

	$('#content-wrap').append(this.view.render().el)

	this.navigate("/")
    }


});
