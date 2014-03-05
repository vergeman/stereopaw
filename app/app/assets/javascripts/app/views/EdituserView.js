
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
	var self = this;
	this.session = session

//	app.vent.once("Session:logged-in", this.set_current_user, this)
	app.vent.once("Session:logged-out", this.redirect, this)

	//View-specific Initializations
	_(this).bindAll('close')
	
	this.authenticity_token = $("meta[name=csrf-token]").attr("content")
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
	if (this.session.get("state") == app.Session.SessionState.LOGGEDIN) {
	    return this._render()
	}
	app.vent.once("Session:logged-in", this._render, this)	    
	return this;
    },

    _render: function() {
	console.log("[EdituserView] __render")
	var self = this;

	this.$el.html(
	    this.template(
		{
		    authenticity_token : self.authenticity_token,
		    user: self.session.get("current_user")
		}
	    ));
	return this;
    },

    show_error: function(jqXHR) {},

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
