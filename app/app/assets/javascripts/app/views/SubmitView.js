var app = app || {}

app.SubmitView = Backbone.View.extend({

    tagName: "div",
    
    id: 'content',

    template : JST['submit/index'],

    initialize: function() {
	console.log("[SubmitView] initialize")
    },

    events : {}, 

    render: function() {
	console.log("[SubmitView] render")
	this.$el.html(this.template() )
	return this
    },

    close: function() {
	console.log("[SubmitView] close")
	this.remove()
	this.unbind()
    }

})
