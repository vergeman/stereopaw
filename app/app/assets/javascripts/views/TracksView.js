var app = app || {}

app.TracksView = Backbone.View.extend({
    
    tagname: 'div',

    id: 'tracks',

    initialize: function(tracks_collection) {
	console.log("[TracksView] initialize")

	this._trackViews = [];

	this.collection = tracks_collection;

	_(this).bindAll('close') //garbage collection


	this.listenTo(this.collection, 'add', this.add_collection)
	this.listenTo(this.collection, 'remove', this.remove_collection)	
	this.listenTo(this.collection, 'render', this.render)

	this.collection.fetch
	(
	    {
		add:true, 
	
		success: function(collection, response, options) {
		    collection.trigger("render")
		}
	    }
	)

	var self = this;

    },
    /* creates TrackView model and adds 
     * to internal _trackViews collection
     */ 
    add_collection : function(model) {
	console.log("[TracksView] add")
	var tv = new app.TrackView({ model : model } ) 
	this._trackViews.push(tv)
    },

    remove_collection : function(model) {
	//not sure about this yet
	console.log("[TracksView] remove")
	var tv_remove = _(this._trackViews).select(function(tv) { return tv.model === model; })[0];
	this._trackViews = _(this._trackViews).without(tv_remove);
	console.log("tv_remove")
	console.log(tv_remove)
	tv_remove.close()
    },

    render: function() {
	console.log("[TracksView] render")

	_(this._trackViews).each(function(tv) {
	    //console.log(tv)
	    this.$el.append( tv.render().el )
	}, this);
    },


    close : function() {
	console.log("[TracksView] close")

	_(this._trackViews).each(function(tv) {
	    tv.close()
	});

	this._trackViews.length = 0
	this.collection.reset()

	this.remove()
	this.unbind()
    }

});
