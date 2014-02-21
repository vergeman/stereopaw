var app = app || {};

app.AppView = Backbone.View.extend({
    
    el: '#content',

    template: HandlebarsTemplates['main'],

    initialize: function() {
	console.log("[AppView] initialize")

	this.render() //render base layout

	this.trackscollection = new app.Tracks();

	console.log(this.trackscollection)

	this.playerview = new app.PlayerView(this.trackscollection);

	this.tracksview = new app.TracksView(this.trackscollection);

    },

    render: function() {},

});


