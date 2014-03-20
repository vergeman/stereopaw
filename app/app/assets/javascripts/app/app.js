var app = app || {};

$(function() {

    app.appRouter = new app.AppRouter();

    Backbone.history.start();

});



$(document).ready( function() {

    $('.menu-icon').click(function(e) {
	e.preventDefault();
	$('ul').toggleClass('mobile');
    });


});
