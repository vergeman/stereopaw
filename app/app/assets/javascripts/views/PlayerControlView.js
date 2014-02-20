var app = app || {}



app.PlayerControlView = Backbone.View.extend({

    events: function() {},

    initialize: function() {

	this.btn = $('.handle')
	this.meter = $('.meter')
	this.slider = $('.progress')
	this.handleWidth = this.btn.width()
	this.sliderWidth = this.slider.width() - this.handleWidth;

	this.posX_percent = 0;

	this.slider_busy = false; //mini lock to reduce slider jumps

	/*listeners*/

	//slider one-off seek click
	var self = this;
	this.slider.on('click touchstart', function(e) {
	    this.slider_busy = true;

	    self.moveHandler(e)
	    app.vent.trigger("Player:seek", self.posX_percent)

	    this.slider_busy = false;
	});

	//button drag seek
	this.btn.on('mousedown touchstart',
		    _.bind(this.btnmoveHandler, this));
		    

    },
    moveSlider : function(posX_percent) {
	/* calculate the handle offset 
	 * we handleWidth / 2 to prevent background bleed of meter
	 * ex: posX_percent -> 47.12323 
	 */
	var handlepos = (this.handleWidth /2) / this.sliderWidth * 100;
	var posX_handlepos = parseFloat(posX_percent + handlepos)
	
	//handlepos*2 to keep button on screen
	this.btn.css("left", Math.min(100-handlepos*2, posX_percent) + '%')
	this.meter.css("width", Math.min(100, posX_handlepos) + '%')

    },

    btnmoveHandler : function(e) {
	e.preventDefault(); 

	this.slider_busy = true;

	this.sliderWidth = this.slider.width() - this.handleWidth

	$(document).on('mousemove.player touchmove.player',
	     _.bind(this.moveHandler, this));

	$(document).on('mouseup.player touchend.player',
	     _.bind(this.stopHandler, this));

    },

    moveHandler : function(e) {
	//calc base slide
        var posX = e.pageX - this.handleWidth  ; //center to handle
        posX = Math.min(Math.max(0, posX), this.sliderWidth)
	this.posX_percent = parseFloat(posX / this.sliderWidth) * 100

	this.moveSlider(this.posX_percent)
    },

    stopHandler : function() {

	/* want to make seek call only once*/
	this.slider_busy = false;
	app.vent.trigger("Player:seek", this.posX_percent)

        $(document).off('mousemove.player touchmove.player')
	
        $(document).off('mouseup.player touchend.player')

    },

    render : function() {},
    is_busy : function() { return this.slider_busy }
});
