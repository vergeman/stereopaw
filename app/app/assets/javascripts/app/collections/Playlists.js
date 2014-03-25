var app = app || {};

app.Playlists = Backbone.Collection.extend({

    url: '/playlists',
    model: app.Playlist,

    initialize : function(models, user) {
	this.url = "/users/" + user.user_id + "/playlists/"
    }

});
