var app = app || {};

app.ProfileView = Backbone.View.extend({

    el: '#profile',

    template: HandlebarsTemplates['users/profile'],

    events : {},

    initialize : function() {
	console.log("[ProfileView] initialize")

	this.listenTo(app.vent, "Session:logged-in", this.render)
	this.listenTo(app.vent, "Session:logged-in", this.render)
    },

    render: function() {
	console.log("[ProfileView] initialize")
	
	this.$el.html(this.template({current_user: app.Session.current_user}))
    }




});
