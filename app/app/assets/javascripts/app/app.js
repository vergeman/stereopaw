var app = app || {};

$(function() {

    app.appRouter = new app.AppRouter();

    Backbone.history.start();

});
