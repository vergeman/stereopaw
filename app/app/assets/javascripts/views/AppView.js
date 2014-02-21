var app = app || {};

app.AppView = Backbone.View.extend({
    
    el: '#content',

    template: HandlebarsTemplates['main'],

    events : {
	'click .play' : 'play',
	'click .stop' : 'stop'
    },

    initialize: function() {
	console.log("[AppView] initialize")

	this.render() //render base layout

	this.trackscollection = new app.Tracks();

	console.log(this.trackscollection)

	this.playerview = new app.PlayerView(this.trackscollection);

	this.tracksview = new app.TracksView(this.trackscollection);

    },

    render: function() {},

    play: function(e) {
	console.log("[AppView] Play");
	var time = $(e.currentTarget).attr('timestamp');

	this.playerview.play($(e.currentTarget).parents('.track-meta'),
			     time);
    },

    stop: function(e) {
	console.log("[AppView] Stop");
	this.playerview.stop()
    },
});


