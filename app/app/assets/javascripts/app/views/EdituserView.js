
var app = app || {};

app.EdituserView = Backbone.View.extend({

    tagName: 'div',
    id: 'content',

    template: JST['users/edituser'],

    events : {
	'click input[type=submit]#edit-user-button' : 'submit_edit_user'
    },

    initialize: function(session) {
	console.log("[Edituser] initialize")
	var self = this;
	this.session = session


	//Signup:siginup:error - display form errors
	self.listenTo(app.vent,
		      "EdituserView:signup:error",
		      self.show_error)

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

    show_error: function(errors) {
	console.log("[EdituserView] show_error")
	//clear all errors
	$('small').removeClass('error')
	$('small').html('')
	$('.input-label-prefix > span').css("color", "#333333")

	//add any errors
	_.each(errors, function(val, key) {

	    $('.error_' + key).html(val)
	    $('.error_' + key).addClass('error')
	    $('.error_' + key).parent().prev().children().css("color", "orangered")
	    $('.error_' + key).show()
	});
    },

    submit_edit_user : function(e) {
	console.log("[EdituserView] submit_edit_user")
	e.preventDefault();
	var self = this;

	var data = {
	    user : {
		email : $("input#user_email").val(),
		password : $("input#user_password").val(),
		password_confirmation : $("input#user_password_confirmation").val(),
		current_password : $("input#user_current_password").val()		
	    },
	};


	app.vent.trigger("Request",
			 "PUT",
			 "/users",
			 data,
			 function(data, textStatus, jqXHR) {
			     console.log("[SignupView] Request")
			     /*Signup Errors are a 200 
			      *'successful ajaxresponse
			      */

			     console.log(data)
			     console.log(textStatus)
			     console.log(jqXHR)

			     if ('errors' in data) {
				 app.vent.trigger("EdituserView:signup:error", data.errors)
			     }

			     //by default we are logged in
			     self.session.set("state", 
					      app.Session.SessionState.LOGGEDIN);
			 },
			 function(jqXHR, textStatus, errorThrown) {}
			)

			 
    },

    close: function() {
	console.log("[EdituserView] close")
	this.remove()
	this.unbind()
    }


});
