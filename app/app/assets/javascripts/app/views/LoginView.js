
var app = app || {};

app.LoginView = Backbone.View.extend({

    tagname: 'div',
    id: 'login',

    template: JST['users/login'],

    events : {
	'click input[type=submit]' : 'submit',
	'click #logout' : 'logout'
    },

    initialize: function() {
	console.log("[LoginView] initialize")

	_(this).bindAll('close')

	this.authenticity_token = $("meta[name=csrf-token]").attr("content")
    },

    render: function() {
	this.$el.html(this.template({authenticity_token : this.authenticity_token, sidebar : ""}) );
	return this;
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

    logout: function(e) {
	e.preventDefault();
	app.vent.trigger("Session:sign-out")
    },

    close: function() {
	console.log("[LoginView] close")
	this.remove()
	this.unbind()
    }


});
