var app = app || {};

app.AppView = Backbone.View.extend({
    
    el: '#main',

    template: HandlebarsTemplates['main'],
    player : null,

    initialize: function() {
	console.log("[AppView] initialize")

	this.render() //render base layout

	this.tracksview = new app.TracksView();
    },

    render: function() {

	//this.$el.append( this.template({title : 'TEST'}) )

    }

});

app.player = new app.Player();
