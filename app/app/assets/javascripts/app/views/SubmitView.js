var app = app || {}

app.SubmitView = Backbone.View.extend({

    tagName: "div",
    
    id: 'content',

    template : JST['submit/index'],

    initialize: function() {
	if (DEBUG)
	    console.log("[SubmitView] initialize")
    },

    events : {}, 

    render: function() {
	if (DEBUG)
	    console.log("[SubmitView] render")
	this.$el.html(this.template() )
	return this
    },

    close: function() {
	if (DEBUG)
	    console.log("[SubmitView] close")
	this.remove()
	this.unbind()
    }

})
