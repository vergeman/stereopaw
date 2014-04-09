
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
	'click ul.navigation #playlist' : 'playlist',
	'click ul.navigation #submit' : 'submithow',
	'click #settings' : 'settings',
    },

    initialize : function(session) {
	if (DEBUG)
	    console.log("[NavigationView] initialize")
	this.session = session
	this.listenTo(app.vent, "Session:logged-in", this.render_loggedin)
	this.listenTo(app.vent, "Session:logged-out", this.render_loggedout)

	/*toggle active state of nav link*/
	this.listenTo(app.vent, "NavigationView:ActivateLink",
		      this.activate_link)


	/* Root Link: this is out of navbar scope 
	 * so we manually attach
	 */
	$('#home').click(function(e) {
	    if (DEBUG)
		console.log("[NavigationView] home")
	    e.preventDefault()
	    Backbone.history.navigate("/", {trigger:true})	    
	});
    },

    render_loggedin: function() {
	if (DEBUG)
	    console.log("[NavigationView] render_loggedin")

	this.$el.html(this.template({user: this.session.get("current_user").toJSON()} ))

	this.close_menu_listener()

    },

    render_loggedout : function() {
	if (DEBUG)
	    console.log("[NavigationView] render_loggedout")

	this.$el.html(this.template({user: null} ))

	this.close_menu_listener()
    },

    close_menu_listener : function(e) {
	$('ul.navigation li').click(function() {
	    $('.menu-icon').click()
	});
    },

    _clear_links : function() {
	if (DEBUG)
	    console.log("[NavigationView] clear_links")
	$('ul.navigation li').removeClass("route")
    },

    activate_link : function(div_name) {
	if (DEBUG)
	    console.log("[NavigationView] activate_link")

	/*clear all link*/
	this._clear_links()
	/*make active*/
	$('ul.navigation li#' + div_name).addClass("route")
    },

    home : function(e) {

    },

    logout: function(e) {
	if (DEBUG)
	    console.log("[NavigationView] logout")
	e.preventDefault();
	this.sign_out()
    },

    login: function(e) {
	if (DEBUG)
	    console.log("[NavigationView] login")
	e.preventDefault();
	Backbone.history.navigate("/login", {trigger:true})
    },

    settings: function(e) {
	if (DEBUG)
	    console.log("[NavigationView] settings")
	e.preventDefault();
	Backbone.history.navigate("/edituser", {trigger:true})	
    },

    playlist : function(e) {
	if (DEBUG)
	    console.log("[NavigationView] playlist")
	e.preventDefault();
	Backbone.history.navigate("/playlists", {trigger:true})
    },

    mytracks : function(e) {
	if (DEBUG)
	    console.log("[NavigationView] mytracks")
	e.preventDefault();
	Backbone.history.navigate("/tracks", {trigger:true})	
    },

    popular : function(e) {
	if (DEBUG)
	    console.log("[NavigationView] popular")
	e.preventDefault();
	Backbone.history.navigate("/popular", {trigger:true})	
    },

    new_tracks : function(e) {
	if (DEBUG)
	    console.log("[NavigationView] new_tracks")
	e.preventDefault();
	Backbone.history.navigate("/new", {trigger:true})	
    },

    submithow : function(e) {
	if (DEBUG)
	    console.log("[NavigationView] submithow")
	e.preventDefault();
	Backbone.history.navigate("submithow", {trigger:true})
    },

    sign_out: function() {
	if (DEBUG)
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
	if (DEBUG)
	    console.log("[NavigationView] close")
	this.$el.html("")
    }




});
