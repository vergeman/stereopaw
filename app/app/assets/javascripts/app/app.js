var app = app || {};

$(function() {

    app.appRouter = new app.AppRouter();

    Backbone.history.start();

});



$(document).ready(function() {

    /*
     *hamburger mobile dropdown
     * we bind here as it gets unbound
     * when login/logout occurs
     */
    $('.menu-icon').click(function(e) {
	e.preventDefault();
	$('ul.navigation').toggleClass('mobile');
    });

})
