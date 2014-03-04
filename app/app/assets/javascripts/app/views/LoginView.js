
var app = app || {};

app.LoginView = Backbone.View.extend({

    tagName: 'div',
    id: 'content',

    template: JST['users/sign_in'],

    events : {
	'click input[type=submit]' : 'submit',
    },

    initialize: function() {
	console.log("[LoginView] initialize")

	_(this).bindAll('close')

	this.listenTo(app.vent, "LoginView:signin:error", this.show_error)
	this.authenticity_token = $("meta[name=csrf-token]").attr("content")
    },

    render: function() {
	this.$el.html(this.template({authenticity_token : this.authenticity_token}) );
	return this;
    },

    show_error: function(jqXHR) {
	console.log("[LoginView] showerror")
	var msg = jqXHR.responseJSON.error
	$('.errormessage').html(msg)
	$('.errormessage').show()
	$('.input-label-prefix > span').css("color", "orangered")
    },

    submit : function(e) {
	e.preventDefault();
	console.log("Submit")


	var data = {
	    user : {
		email : $("input#user_email").val(),
		password : $("input#user_password").val()
	    },
	};

	app.vent.trigger("Session:sign-in", data)
			 
    },

    close: function() {
	console.log("[LoginView] close")
	this.remove()
	this.unbind()
    }


});
