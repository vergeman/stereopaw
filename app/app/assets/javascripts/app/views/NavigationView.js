
var app = app || {};

app.NavigationView = Backbone.View.extend({

    el: '#navigation-wrap',

    template: JST['users/navbar'],

    /*
     *for responsive top bar view we launch 
     *render from this View
     */
    templateTop: JST['users/navbar_top'],

    events : {
	'click #logout' : 'logout',
	'click #login_nav' : 'login',
	'click ul.navigation #new' : 'new_tracks',
	'click ul#search' : 'search',
	'click ul.navigation #popular' : 'popular',
	'click ul.navigation #mytracks' : 'mytracks',
	'click ul.navigation #playlist' : 'playlist',
	'click ul.navigation #submit' : 'submithow',
	'click #settings' : 'settings'
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

	this.render(this.session.get("current_user").toJSON())
    },

    render_loggedout : function() {
	if (DEBUG)
	    console.log("[NavigationView] render_loggedout")

	this.render(null)
    },

    render : function(user) {
	if (DEBUG)
	    console.log("[NavigationView] render")

	//sidebar
	this.$el.html(this.template({user: user} ))

	//top menu
	$('.navbar-top-wrap').html(
	    this.templateTop({user: user}))

	this.close_menu_listener()

	this.bind_search_bars()
	
    },


    bind_search_bars : function() {
	if (DEBUG)
	    console.log("[NavigationView] bind_search_bars")

	this._bind_search("#search-form",
			  "#search-query")

	this._bind_search("#mobile-search-form",
			  "#mobile-search-query")


	/*bind click to search icon*/
	$('#mobile-search-form i').click(function(e) {
	    $('#mobile-search-form').submit()
	})

	/*bind mobile search links*/
	$('#mobile-search-query').focus(function(e) {
	    $('#mobile-search-filters').show()
	    //there can be only one menu visible
	    $('ul.navigation').removeClass('mobile')
	})

	/*
	 *mobile search filter bindnings
	 *click and fadeout
	 */
	$('li.filter').click(function(e) {
	    var query = $('#mobile-search-query').val()
	    var route = "/search" + $(e.currentTarget).attr('route') + "/" + query

	    Backbone.history.navigate(route, {trigger:true})
	})

	$('#mobile-search-query').focusout(function(e) {
	    console.log(e)

	    window.setTimeout(function() {
 		$('#mobile-search-filters').hide()
	    }, 100);  

	})
    },


    _bind_search : function(form_div, query_div) {
	if (DEBUG)
	    console.log("[NavigationView] bind_search")

	$(document).on('submit', form_div, function(e) {
	    e.preventDefault()
	    //stop submit event on multiple forms (nav and search)
	    e.stopImmediatePropagation();

	    var query = $(query_div).val()
	    var route = "/search/" + query

	    /*update values in respective search boxes*/
	    $('nav input').val(query)
	    $('.navigation input').val("") //side
	    Backbone.history.navigate(route,
				      {trigger: true})

	    $(window).scrollTop(0);
	});

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

/*LINKS*/
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
		/*want to get rid of all 
		  js data with full refresh*/
		window.location.href = "/meow#popular"
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
