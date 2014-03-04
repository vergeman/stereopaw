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

	this.listenTo(app.vent, "SignupView:signup:error", this.show_error)

	this.authenticity_token = $("meta[name=csrf-token]").attr("content")
    },

    render: function() {
	this.$el.html(this.template({authenticity_token : this.authenticity_token}) );
	return this;
    },

    show_error: function(errors) {
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
			     console.log("[SignupView] Request")
			     if ('errors' in data) {
				 app.vent.trigger("SignupView:signup:error", data.errors)
			     }

			     console.log(data)
			     console.log(textStatus)
			     console.log(jqXHR)
			 },
			 function(jqXHR, textStatus, errorThrown) {}
			)
			 
    },

    close: function() {
	console.log("[SignupView] close")
	this.remove()
	this.unbind()
    }


});
