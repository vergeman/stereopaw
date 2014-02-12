var app = app || {};

$(function() {

    new app.AppView();

});



$(document).ready( function() {

    $('.menu-icon').click(function(e) {
	e.preventDefault();
	$('ul').toggleClass('mobile');
    });

});
