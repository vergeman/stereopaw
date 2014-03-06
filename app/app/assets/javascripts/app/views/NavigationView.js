
var app = app || {};

app.NavigationView = Backbone.View.extend({

    el: '#navigation-wrap',

    template: JST['users/navbar'],

    events : {
	'click #logout' : 'logout',
	'click #login_nav' : 'login',
	'click #settings' : 'settings'
    },

    initialize : function(session) {
	console.log("[NavigationView] initialize")
	this.session = session
	this.listenTo(app.vent, "Session:logged-in", this.render_loggedin)
	this.listenTo(app.vent, "Session:logged-out", this.render_loggedout)
	
	/*this is out of navbar scope*/
	$('#home').click(function(e) {
	    console.log("[NavigationView] home")
	    e.preventDefault()
	    Backbone.history.navigate("/", {trigger:true})	    
	});
    },

    render_loggedin: function() {
	console.log("[NavigationView] render_loggedin")
	this.$el.html(this.template({user: this.session.get("current_user").toJSON()} ))
//	$(document).foundation()
    },

    render_loggedout : function() {
	console.log("[NavigationView] render_loggedout")
	this.$el.html(this.template({user: null} ))
    },
    home : function(e) {

    },
    logout: function(e) {
	console.log("[NavigationView] logout")
	e.preventDefault();
	//app.vent.trigger("Session:sign-out")
	this.sign_out()
    },

    login: function(e) {
	console.log("[NavigationView] login")
	e.preventDefault();
	Backbone.history.navigate("/login", {trigger:true})
    },

    settings: function(e) {
	console.log("[NavigationView] settings")
	e.preventDefault();
	Backbone.history.navigate("/edituser", {trigger:true})	
    },

    sign_out: function() {
	console.log("[NavigationView] sign_out")
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
	console.log("[NavigationView] close")
	this.$el.html("")
    }




});
