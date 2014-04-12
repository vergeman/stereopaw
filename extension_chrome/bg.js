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

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, 
			    { code: "(function(){document.getElementById('sb-app') ? false : (function() {var e = document.createElement('script');e.setAttribute('id', 'sb-script');e.setAttribute('src','https://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5151/stereopaw-min.js?r='+Math.random()*99999999);document.body.appendChild(e)})() }())"
});


/*
  chrome.tabs.executeScript({

//      code: 'document.body.style.backgroundColor="red"; alert("stereo paw says hello");'
//      code: 'alert("stereo paw says hello");'
  });
    //should inject 
*/
});
