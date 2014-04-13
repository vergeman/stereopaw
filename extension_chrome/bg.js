/*
insert google analytics code
http://developer.chrome.com/extensions/tut_analytics.html
*/

//onclick action
//analytics track event
//alert & append code

/* marklet 1.0 w/ require & backbone
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, 
			    { code: "!document.getElementById('stereo paw') ? (function(){var e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('id','stereo paw');e.setAttribute('data-main', 'http://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5150/assets/stereo paw.js?r='+Math.random()*999999999);e.setAttribute('src','http://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5150/assets/require.js?r='+Math.random()*99999999);document.body.appendChild(e)})() : console.log('RUN')"
});
*/

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {

	if (request.URL) {

	    var service = request.service
	    var timestamp = request.time
	    var url = request.URL

	    chrome.tabs.create({'url': url});

	    var insert = function(args) {
		var _service = args[0]
		var _time = args[1]

		/*
		 * MIXCLOUD
		 */
		var mixcloud  = '(' + function(time) {
		    x = $('.player').scope()

		    if (!x.playerStarted && !x.playing) {
			$('.cloudcast-play').click()
		    }

		    var checkExist = setInterval(function() {
			x.volume = 0;

			if (x.playerStarted && 
			    x.playing && 
			    !x.loading) {

			    x.$apply(function() { 
				x.$emit("slider:stop", time / 1000)
				x.volume=1
			    })

			    clearInterval(checkExist);
			}

		    }, 100);

		} + ')(' + JSON.stringify(_time) + ')'

		/*
		 *Add Services..
		 */

		var script = document.createElement('script');

		if (_service == "mixcloud") {
		    script.textContent = mixcloud
		}

		if (_service == "another") {
		    script.textContent = "another"
		}


		(document.head||document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);

	    }


	    /*Insert Code*/
	    chrome.tabs.executeScript(null,
				      { 
					  code: "(" + insert + ")(" + JSON.stringify([service, timestamp]) + ");"
				      }
				     );
	    
	}
	
    }
);


chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, 
			    { code: "(function(){document.getElementById('sb-app') ? false : (function() {var e = document.createElement('script');e.setAttribute('id', 'sb-script');e.setAttribute('src','https://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5151/stereopaw-min.js?r='+Math.random()*99999999);document.body.appendChild(e)})() }())"
			    });

});
