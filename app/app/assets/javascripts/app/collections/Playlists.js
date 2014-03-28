var app = app || {};

app.Playlists = Backbone.Collection.extend({

    url: '/playlists',
    model: app.Playlist,

    initialize: function(models, session) {},

    set_url: function(url) {
	this.url = url
    }

});
