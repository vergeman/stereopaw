var app = app || {};

app.ProfileView = Backbone.View.extend({

    el: '#profile',

    template: HandlebarsTemplates['users/profile'],

    events : {},

    initialize : function(session) {
	console.log("[ProfileView] initialize")
	this.session = session
	this.listenTo(app.vent, "Session:logged-in", this.render)
	this.listenTo(app.vent, "Session:logged-out", this.close)
    },

    render: function() {
	console.log("[ProfileView] initialize")
	console.log(this.session)
	console.log(this.session.get("current_user").toJSON() )

	this.$el.html(this.template(this.session.get("current_user").toJSON() ))
    },

    close : function() {
	console.log("[ProfileView] close")
	this.$el.html("")
    }




});
