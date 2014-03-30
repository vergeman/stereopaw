var app = app || {}

/*PlayerQueue
 *Maintains correct queueing prev/next track behavior
 *across changing trackscollections
 *
 * we can tell a trackcollection is different by checking if
 * our route we passed in during intiialization is different
 * from what is updated, and in that case, play from beginning.
 *
 * general behavior: we have two stacks, history_back, history_fwd
 * we give priroity to cycle between these (they are user actions)
 * then if no other tracks in stacks, we resort to sequentially
 * going through the collection
 */

app.PlayerQueue = Backbone.Model.extend({


    initialize : function(route, trackscollection) {
	console.log("[PlayerQueue] initialize")
	this.current_track = null

	this.queue = trackscollection
	this.history_back = new Array()
	this.history_fwd = new Array()
	this.route = route
	this.updated = false

	this.listenTo(app.vent, "PlayerQueue:update", this.update)
    },

    /* a new route, we flag the collection as updated
     * to adjust our track selection in next()
     */
    update : function(route, trackscollection) {
	console.log("[PlayerQueue] update")
	if (this.route != route) {
	    this.route = route
	    this.updated = true
	}
	this.queue = trackscollection
    },

    /* selects next track, updates history accordingly
     * preference to history_fwd, first of a new collection, 
     * then sequentially 
     */
    next : function() {
	console.log("[PlayerQueue] next")
	//populate history_back w/ current track
	this.history_back.push(this.current_track)

	/*check history_fwd first*/
	if (this.has_fwd()) {
	    console.log("[PlayerQueue] next:hasfwd")
	    this.current_track = this.history_fwd.pop()
	    return this.current_track
	}

	//if empty (empty playlist)
	if (this.queue.length == 0) {
	    return null
	}

	//check if new queue, return top
	if (this.updated) {
	    console.log("[PlayerQueue] next:updated")
	    this.updated = false
	    this.current_track = this.queue.at(0)
	    return this.current_track
	}

	//move sequentially
	console.log("[PlayerQueue] next:sequential")

	var current_index = this.queue.indexOf(this.current_track)
	var next_index = (current_index + 1) % this.queue.length
	this.current_track = this.queue.at(next_index)
	return this.current_track

    },

    has_fwd : function() {
	console.log("[PlayerQueue] has_fwd")
	return this.history_fwd.length > 0
    },

    /*take from history_stack, otherwise null - nothing previous*/
    prev : function() {
	console.log("[PlayerQueue] prev")

	if (this.has_prev()) {
	    console.log("[PlayerQueue] prev has_prev true")
	    this.history_fwd.push(this.current_track)
	    this.current_track = this.history_back.pop()
	    return this.current_track
	}

	return null
    },

    has_prev : function() {
	console.log("[PlayerQueue] has_prev")
	return this.history_back.length > 0;
    },


    /*a DOM user-selected track - 
      * make sure to mute updated flag if playing
      * somewhere from DOM
     */
    find : function(id) {
	console.log("[PlayerQueue] find")
	if (this.current_track != null) {
	    //add current_track to history_back
	    this.history_back.push(this.current_track)
	}
	//we DOM played from an updated collection
	if (this.updated) {
	    this.updated = false
	}

	this.current_track = this.queue.get(id)
	return this.current_track
    }

})
