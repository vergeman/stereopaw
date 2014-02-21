var app = app || {};

app.AppRouter = Backbone.Router.extend({
    /* visit i.e. / or /#testpath */

    routes : 
    {
	'' : 'appview',
	'testpath' : 'test'
    },

    test : function() {
	console.log("[AppRouter] test")
    },

    appview : function() {
	console.log("[AppRouter] appview")
	new app.AppView();
	this.navigate("/hello")
    }


});
