var app = app || {};

$(function() {

    new app.AppRouter();

    Backbone.history.start();

});



$(document).ready( function() {

    $('.menu-icon').click(function(e) {
	e.preventDefault();
	$('ul').toggleClass('mobile');
    });

});
