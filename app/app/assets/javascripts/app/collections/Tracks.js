var app = app || {};

/*Track Collection */

app.Tracks  = Backbone.Collection.extend({

    url: '/tracks',
    model: app.Track,

})

