
var app = app || {};

app.EdituserView = Backbone.View.extend({

    tagName: 'div',
    id: 'content',

    template: JST['users/edituser'],

    events : {
	'click input[type=submit]' : 'submit',
    },

    initialize: function(session) {
	console.log("[Edituser] initialize")
	this.current_user = null;
	this.session = session

	console.log("State: " + this.session.get("state") )

	switch (this.session.get("state") ) {
	    //logged in already
	    case app.Session.SessionState.LOGGEDIN :
	    this.set_current_user()
	    break;
	    
	    //mid-auth request (busy) || page was directly loaded (init)
	    case app.Session.SessionState.INIT:
	    case app.Session.SessionState.BUSY:
	    app.vent.once("Session:logged-in", this.set_current_user, this)
	    app.vent.once("Session:logged-out", this.redirect, this)
	    break;

	    //not authorized/ indeterminate state (finished/ error)
	    default:
	    this.redirect()
	}

	//View-specific Initializations
	_(this).bindAll('close')
	
	this.authenticity_token = $("meta[name=csrf-token]").attr("content")
    },

    set_current_user : function() {
	this.current_user = this.session.get("current_user")
    },

    redirect : function() {
	console.log("[EdituserView] redirect")
	Backbone.history.navigate("/", { trigger:true})
    },

    /*check if we have variables now, we can render,
     * otherwise, wait for login
     */
    render: function() {
	console.log("[EdituserView] render")
	if (this.current_user) {
	    return this._render()
	}
	app.vent.once("Session:logged-in", this._render, this)	    
	return this;
    },

    _render: function() {
	console.log("[EdituserView] __render")
	var self = this;
	console.log(self.current_user)
	this.$el.html(
	    this.template(
		{
		    authenticity_token : self.authenticity_token,
		    user: self.current_user
		}
	    ));
	return this;
    },

    show_error: function(jqXHR) {
    },
/*MULTIPLE SUBMIT*/
    submit : function(e) {
	e.preventDefault();
	console.log("Submit")


	var data = {
	    user : {
		email : $("input#user_email").val(),
		password : $("input#user_password").val()
	    },
	};
			 
    },

    close: function() {
	console.log("[EdituserView] close")
	this.remove()
	this.unbind()
    }


});
