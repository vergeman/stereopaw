var app = app || {};

/* 
 * TracksIndexView:
 * Container for TracksView
 * header and planned options for that area
 */

app.TracksIndexView = Backbone.View.extend({
    
    tagName: 'div',

    id: 'content',

    className: 'main',

    template: JST['tracks/index'],

    initialize: function(trackscollection, displayroute) {
	console.log("[TracksIndexView] initialize")

	this.tracksView = new app.TracksView(trackscollection);

	this.displayroute = displayroute.charAt(0).toUpperCase() + displayroute.slice(1)

	_(this).bindAll('close')
    },

    close : function() {

	this.tracksView.close()
	this.remove()
	this.unbind()

    },

    render: function() {
	console.log("[TracksIndexView] render")
	//header
	this.$el.append(this.template({header: this.displayroute}) );

	//tracksView

	this.$el.append(this.tracksView.el)

	return this;
    },

});


