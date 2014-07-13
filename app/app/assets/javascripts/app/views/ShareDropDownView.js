var app = app || {};

app.ShareDropDownView = Backbone.View.extend({

    tagName: 'div',

    className: 'share-dropdown',

    template: JST['tracks/sharedropdown'],

    events : {
	'click .link' : 'share_link',
	'click .facebook' : 'share_facebook',
	'click .twitter' : 'share_twitter'
    },

    initialize: function(opts) {
	if (DEBUG)
	    console.log("[ShareDropDownView] initialize")

	this.track = opts.track

    },

    timestamp_url : function() {

	if (this.track.service == "youtube") {
	    var time = this.track.timeformat.split(":")
	    return "#t=" + (time[0] + "m" + time[1] + "s")
	}

	if (this.track.service == "soundcloud")
	{
	    var time = this.track.timeformat
	    return "#t=" + time
	}
	
	/*TODO: timestamped links
	 *or uri link in the case of spotify
	 */
	if (this.track.service == "spotify") {
	    var time = this.track.timeformat
	    //return "%23" + time
	    return ""
	}

	if (this.track.service == "mixcloud") {
	    var time = this.track.timeformat
	    return ""
	}

	return ""
    },

    link_url : function() {
	return "https:" + this.track.page_url + this.timestamp_url()
    },

    share_link : function(e) {
	if (DEBUG)
	    console.log("[ShareDropDownView] share_link")

	e.preventDefault();

	var div = "#linkModal-"+this.track.id

	app.vent.trigger("Modal:reset",
			 "#linkModal-"+this.track.id)

	//add content to modal
	$("#linkModal-"+ this.track.id + " #link-modal-content").val(this.link_url())

	$('#link-modal-content').one('click', function() {
	    this.setSelectionRange(0, this.value.length)
	})

	//open & bind click
	$(div).foundation('reveal', 'open')

    },

    share_facebook : function(e) {
	if (DEBUG)
	    console.log("[ShareDropDownView] share_facebook")

	e.preventDefault();
	var link = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.link_url())

	window.open(link, 'stereopaw', 'top=0,left=0,width=600, height=375')

    },

    share_twitter : function(e) {
	if (DEBUG)
	    console.log("[ShareDropDownView] share_twitter")

	e.preventDefault();

	var link = "https://twitter.com/intent/tweet"
	var text = "?text=" + encodeURIComponent(this.track.title + " | " + this.track.artist)

	if (this.track.service == "mixcloud") {
	    text +=  encodeURIComponent(" - " + this.track.timeformat)
	}

	var url = "&url=" + encodeURIComponent(this.link_url())
	var via = "&via=" + "stereopaw"


	window.open(link + text + url + via, 'stereopaw', 'top=0,left=0,width=600, height=375')

    },

    render: function() {
	this.$el.html(
	    this.template(
		{
		    track : this.track
		}
	    )
	);

	return this;
    },

    close : function() {
	if (DEBUG)
	    console.log("[ShareDropDownView] close")

	this.remove()
	this.unbind()
    }

});
