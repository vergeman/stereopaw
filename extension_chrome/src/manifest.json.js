{
    "browser_action": {
	"default_icon": "icon-toolbar.png",
	"default_title": "stereo paw",
        "default_popup": "popup.html"
    },
    "background": {
	"persistence": false,
	"scripts": [ "bg.js" ]
    },
    "externally_connectable": {
	"matches": [
	    //@ifdef DEBUG
	    "*://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com/*",
	    //@endif
		    "*://*.stereopaw.com/*",
		    "*://*.soundcloud.com/*",
		    "*://*.youtube.com/*",
		    "*://*.mixcloud.com/*",
		    "*://*.spotify.com/*"
		   ]
    },
    "content_scripts": [
	{
	    "matches": [
		"*://*.stereopaw.com/*"
		//@ifdef DEBUG
		,
		"*://*.compute.amazonaws.com/*"
		//@endif
	    ],
	    "js": ["content.js"]
	} 
    ],
    "manifest_version": 2,
    "name": "stereo paw",
    "description": "stereo paw for Chrome",
    "homepage_url": "https://www.stereopaw.com",
    "version": "0.5",
    "permissions": [ "tabs", "*://*/*", "activeTab" ],
    "icons": {
	"16": "icon-16.png",
	"48": "icon-48.png",
	"128": "icon-128.png"
    }
}
