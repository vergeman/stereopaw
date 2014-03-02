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

    initialize: function(trackscollection) {
	console.log("[TracksIndexView] initialize")

	this.tracksView = new app.TracksView(trackscollection);

    },
    close : function() {

	this.tracksView.close()
	this.remove()
	this.unbind()

    },
    render: function() {
	
	//header
	this.$el.append(this.template() );

	//tracksView
	this.$el.append(this.tracksView.el)

	return this;
    },

});


