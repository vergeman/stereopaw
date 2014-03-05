
var app = app || {};

app.ProfileView = Backbone.View.extend({

    el: '#profile',

    template: JST['users/profile'],

    events : {
	'click #logout' : 'logout'
    },

    initialize : function(session) {
	console.log("[ProfileView] initialize")
	this.session = session
	this.listenTo(app.vent, "Session:logged-in", this.render)
	this.listenTo(app.vent, "Session:logged-out", this.close)
    },

    render: function() {
	console.log("[ProfileView] initialize")
	console.log(this.session)
	console.log(this.session.get("current_user").toJSON() )

	this.$el.html(this.template({user: this.session.get("current_user").toJSON()} ))
    },

    logout: function(e) {
	e.preventDefault();
	//app.vent.trigger("Session:sign-out")
	this.sign_out()
    },

    sign_out: function() {
	console.log("[LoginView] sign_out")
	this.session.request(
	    'DELETE',
	    '/users/sign_out.json', 
	    null,
	    function(data) { 
		app.vent.trigger("Session:logged-out", data) 
	    },
	    function(jqXHR, textStatus, errorThrown) {}
	)
    },

    close : function() {
	console.log("[ProfileView] close")
	this.$el.html("")
    }




});
