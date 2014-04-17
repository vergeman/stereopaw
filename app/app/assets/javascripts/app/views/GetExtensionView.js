var app = app || {};

app.GetExtensionView = Backbone.View.extend({

    tagName: 'div',

    id: 'getExtensionModal',

    template: JST['submit/getextension_modal'],

    initialize: function() {
	if (DEBUG)
	    console.log("[GetExtensionView] initialize")

	this.opened = false;
	this.listenTo(app.vent,
		      "GetExtensionView:openModal",
		      this.open_modal)
    },

    render: function() {
	if (DEBUG)
	    console.log("[GetExtensionView] render")

	this.$el.html(this.template())
	return this;
    },

    open_modal : function(url) {
	if (DEBUG)
	    console.log("[GetExtensionView] open_modal")

	/*
	 *modal open logic
	 *don't want to annoy if already modal'd, just go ahead
	 */
	if (this.seen) {
	    window.open(url, "_blank")
	    return
	}

	$(document).foundation()

	/*
	 *function to bind listeners & action
	 *to buttons inside modal
	 */
	var bindExtensionModal =  function () {
	    var modal = $(this);
	    $('#ExtensionModal #external').one('click', function(e) {
		e.preventDefault()
		window.open(url, "_blank")
		modal.foundation('reveal', 'close')
	    })

	    $('#ExtensionModal #install').one('click', function(e) {
		e.preventDefault()
		alert("EXTENSION INSTALL")
		modal.foundation('reveal', 'close')
	    });
	}

	/*open sesame, close modal*/
	$(document).on('open', '[data-reveal]', bindExtensionModal);

	$("#ExtensionModal").foundation('reveal', 'open')

	$(document).off('open', '[data-reveal]', bindExtensionModal);

	this.seen = true
    },

    close: function() {
	if (DEBUG)
	    console.log("[GetExtensionView] close")
    }

})
