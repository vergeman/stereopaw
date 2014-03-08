
var app = app || {};

app.NavigationView = Backbone.View.extend({

    el: '#navigation-wrap',

    template: JST['users/navbar'],

    events : {
	'click #logout' : 'logout',
	'click #login_nav' : 'login',
	'click ul.navigation #new' : 'new_tracks',
	'click ul.navigation #popular' : 'popular',
	'click ul.navigation #mytracks' : 'mytracks',
	'click #settings' : 'settings',
    },

    initialize : function(session) {
	console.log("[NavigationView] initialize")
	this.session = session
	this.listenTo(app.vent, "Session:logged-in", this.render_loggedin)
	this.listenTo(app.vent, "Session:logged-out", this.render_loggedout)
	
	/* Root Link: this is out of navbar scope 
	 * so we manually attach
	 */
	$('#home').click(function(e) {
	    console.log("[NavigationView] home")
	    e.preventDefault()
	    Backbone.history.navigate("/", {trigger:true})	    
	});
    },

    render_loggedin: function() {
	console.log("[NavigationView] render_loggedin")

	this.$el.html(this.template({user: this.session.get("current_user").toJSON()} ))

	this.close_menu_listener()

    },

    render_loggedout : function() {
	console.log("[NavigationView] render_loggedout")

	this.$el.html(this.template({user: null} ))

	this.close_menu_listener()
    },

    close_menu_listener : function(e) {
	$('ul.navigation li').click(function() {
	    $('.menu-icon').click()
	});
    },

    home : function(e) {

    },

    logout: function(e) {
	console.log("[NavigationView] logout")
	e.preventDefault();
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


    mytracks : function(e) {
	console.log("[NavigationView] mytracks")
	e.preventDefault();
	Backbone.history.navigate("/tracks", {trigger:true})	
    },

    popular : function(e) {
	console.log("[NavigationView] popular")
	e.preventDefault();
	Backbone.history.navigate("/popular", {trigger:true})	
    },

    new_tracks : function(e) {
	console.log("[NavigationView] new_tracks")
	e.preventDefault();
	Backbone.history.navigate("/new", {trigger:true})	
    },

    sign_out: function() {
	console.log("[NavigationView] sign_out")
	this.session.request(
	    'DELETE',
	    '/users/sign_out.json', 
	    null,
	    function(data) { 
		app.vent.trigger("Session:logged-out", data)
		Backbone.history.navigate("/", {trigger:true})
	    },
	    function(jqXHR, textStatus, errorThrown) {}
	)
    },

    close : function() {
	console.log("[NavigationView] close")
	this.$el.html("")
    }




});
