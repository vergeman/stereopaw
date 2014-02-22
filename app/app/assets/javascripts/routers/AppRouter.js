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
    },

    test : function() {
	console.log("[AppRouter] test")
	this.view.remove();
    },

    tracksindex : function() {
	console.log("[AppRouter] tracksindex view")

	/* pass manipulation of tracks collection
	   i.e. app.Tracks('popular') for type of view
	*/

	this.view = (new app.TracksIndexView(this.trackscollection) )

	$('#content-wrap').html(this.view.render().el)

	this.navigate("/")
    }


});
