var app = app || {};

app.AppView = Backbone.View.extend({
    
    el: '#main',

    template: HandlebarsTemplates['main'],
    player : null,

    initialize: function() {
	console.log("[AppView] initialize")
	this.tracksview = new app.TracksView();
	this.render()
    },

    render: function() {

	this.$el.html( this.template({title : 'TEST'}) )

    }

});

//app.vents = _.extend({}, Backbone.Events);

app.player = new app.Player();

