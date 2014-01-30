var app = app || {};

app.AppView = Backbone.View.extend({
    
    el: '#main',

    template: HandlebarsTemplates['main'],

    events : {
	'click .play' : 'play',
	'click .stop' : 'stop'
    },

    initialize: function() {
	console.log("[AppView] initialize")

	this.render() //render base layout

	this.playerview = new app.PlayerView();

	this.tracksview = new app.TracksView();


    },

    render: function() {

//	this.$el.append( this.template({title : 'TEST'}) )

	//fix fout styling with no content
	$('#content').css('min-height', 'none');

    },
    play: function(e) {
	this.playerview.play(e);
    },

    stop: function(e) {
	this.playerview.stop()
    },
});


