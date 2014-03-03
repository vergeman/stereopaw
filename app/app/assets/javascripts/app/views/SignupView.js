var app = app || {};

app.SignupView = Backbone.View.extend({

    tagName: 'div',
    id: 'content',

    template: JST['users/sign_up'],

    events : {
	'click input[type=submit]' : 'submit',
    },

    initialize: function() {
	console.log("[SignupView] initialize")

	_(this).bindAll('close')

	this.authenticity_token = $("meta[name=csrf-token]").attr("content")
    },

    render: function() {
	this.$el.html(this.template({authenticity_token : this.authenticity_token}) );
	return this;
    },

    submit : function(e) {
	e.preventDefault();
	console.log("Submit")

	var data = {
	    user : {
		email : $("input#user_email").val(),
		password : $("input#user_password").val(),
		password_confirmation : $("input#user_password_confirmation").val()
	    }
	};

	/*WORKING HERE
	  * Need to handle redirects on creating user
	  * liekly need to inherit registartions contoller
	  * and pass a json response to either redirect
	  * or render errors
	  */

	//request: function(type, url, post_data, cb, cberror)
	app.vent.trigger("Request",
			 "POST",
			 "/users",
			 data,
			 function(data, textStatus, jqXHR) {
			     console.log(data)
			     console.log(textStatus)
			     console.log(jqXHR)
			 },
			 function() {}
			)
			 
    },

    close: function() {
	console.log("[SignupView] close")
	this.remove()
	this.unbind()
    }


});
