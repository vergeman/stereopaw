var app = app || {}

app.VolumeSliderView = Backbone.View.extend({

    el: '#volume',

    events : {
	'click i.fi-volume' : 'show_volume'
    },

    initialize: function() {
	if (DEBUG)
	    console.log("[VolumeSliderView] initialize")

	/*
	 *volume: take from cookie, ( default to 100)
	 */
	this.volume = $.cookie("volume") || 100	

	/*set volume on interface & player*/
	$('#volume-slider').css('width', this.volume + "%")

	/*bind behavior*/
	this.bind_show_hide()
	this.bind_slider_on_click()
	this.bind_slider_on_drag()	

    },

    show_volume : function() {
	if (DEBUG)
	    console.log("[VolumeSliderView] volume")

	this.show_slider()

	//set css and set volume
	$('#volume-meter').on('mouseup', function(e) {
	    $('#volume-meter').off('mousemove')	    
	})

    },

    show_slider : function() {
	if (DEBUG)
	    console.log("[VolumeSliderView] show_slider")

	$('i.fi-volume').hide()
	$('#volume').addClass('active')
	$('#player-track-meta').addClass('track-meta-volumed')
	$('#volume-meter').show()
    },

    hide_slider : function() {
	if (DEBUG)
	    console.log("[VolumeSliderView] hide_slider")

	$('#volume-meter').hide()
	$('#player-track-meta').removeClass('track-meta-volumed')
	$('#volume').removeClass('active')
	$('i.fi-volume').show()
    },


    bind_show_hide : function() {
	if (DEBUG)
	    console.log("[VolumeSliderView] bind_show_hide")

	$('#volume').on('mouseenter', this.show_slider)

	$('#player').on('mouseleave', this.hide_slider)

    },

    bind_slider_on_drag : function() {
	if (DEBUG)
	    console.log("[VolumeSliderView] bind_slider_on_drag")

	var self = this

	$('#volume-meter').on('mousedown', function(e) {

	    $(document).on('mousemove.volume touchmove.volume',
			   self.moveHandler)

	    $(document).on('mouseup.volume touchend.volume',
			   self.stopHandler)
	})
    },

    bind_slider_on_click : function() {
	var self = this;
	//on click / mousedown of volume meter
	$('#volume-meter').on('click touchstart', function(e) {
	    self.moveHandler(e)

	    app.vent.trigger("Player:set_volume", self.volume)
	})

    },

    moveHandler : function(e) {
	var offset = $('#volume-meter').offset().left
	var width =  $('#volume-meter').width()
	var pos = e.pageX

	var vol_percent = Math.max(0, Math.min( (pos - offset) / width, 1))
	var vol_percent_str = (vol_percent * 100) + "%"

	if (DEBUG)
	    console.log(vol_percent)

	$('#volume-slider').css('width', vol_percent_str)

	this.volume = Math.round(vol_percent * 100)

	$.cookie("volume", this.volume)
    },

    stopHandler : function() {

	$(document).off('mousemove.volume touchmove.volume')

	$(document).off('mouseup.volume touchend.volume')

	app.vent.trigger("Player:set_volume", this.volume)
    },


    render : function() {},

    close: function() {}
    


});
