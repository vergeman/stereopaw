/*
 * buildPage: builds the dashboard
 */

SB.Page = (function() {

    var HOME = "/* @echo HOST */";

    var _header = [
	'<div id = "sb-close">',
	[
	    '<img src= ' + HOME + "/icon-close.png" + ' width="12px"/>',
	].join('\n'),
	'</div>',

	'<div id="sb-logo">',
	[
	    '<img width="26" src= ' + HOME + "/stereopaw-logo-main.png>",
	].join('\n'),
	'</div>',

	'<div id = "sb-title">',
	[
	    '<img src= ' + HOME + "/stereopaw-marklet-title.png>"
	].join('\n'),
	'</div>',
    ].join('\n');

    var _content = [

	_header,

	'<div id = "sb-track">',
	[
	    '<div id = "sb-track-title-label" class = "sb-label">Title</div>',
	    '<div id = "sb-track-title"></div>',
	    '<div id = "sb-track-artist-label" class = "sb-label">Artist</div>',
	    '<div id = "sb-track-artist"></div>',
	    '<div id = "sb-track-time-label" class = "sb-label">Timestamp</div>',
	    '<div id = "sb-time"></div>',
	    //'<div id = "sb-track-service"></div>',
	].join('\n'),
	'</div>',                   //info

	'<div id = "sb-player">',     //player container
	[

	    '<div id = "sb-display-bar">', //graphic bar, seektime
	    [
		'<div id = "sb-display-bar-elapsed"></div>',
		'<div id = "sb-display-seek"></div>',
	    ].join('\n'),
	    '</div>',

	].join('\n'),
	'</div>',

	'<div id = "sb-submit">',
	[
	    '<div id="sb-submit-button">Submit</div>',
	].join('\n'),

	'</div>',

    ].join('\n')

    var _error = [
	_header, 

	'<div id = "sb-error">',
	[
	    '<div class="sb-service"> This website is not yet supported </div>',
	    '<div class="sb-service"> Sorry! </div>'
	].join('\n'),
	'</div>'

    ].join('\n')
	    

    var _styles = {	
	'#sb-app' : {
	    'position' : "fixed !important",
	    'top' : "50px !important",
	    'right' : "0 !important",
	    'width' : "300px",
	    'background-color' : "#fff",
	    'border' : "1px solid #aaa",
	    'z-index': "99999999999999999",
	    'text-align' : "left",
	    'display' : "none"
	},

	'#sb-error' : {
	    'margin' : '10px 0px'
	},
	'.sb-service' : {
	    'padding': '10px'
	},

	'#sb-title' : { 
	    'padding': "10px",
	    'margin-top': "8px",
	    'border-bottom' : "1px solid #000",
	    'margin-left' : "10px",
	    'margin-right': "10px"
	},

	'#sb-track' : { 
	    'margin-left' : "10px",
	    'font-size' : "14px",
	    'padding-top': "10px",
	    'margin-right' : "10px",
	    'font': '12px/1.4 "Lucida Grande","Lucida Sans Unicode","Lucida Sans",Garuda,Verdana,Tahoma,sans-serif;'
	},

	'#sb-close' : {
	    'float' : "right",
	    'padding': "8px",
	    'padding-right' : "6px",
	    'cursor': "pointer"
	},

	'#sb-logo' : { 
	    'float' : "left",
	    'padding' : "8px",
	    'padding-left' : "10px",
	    'margin-right' : "4px"
	},
	
	'#sb-time' : { 
	    'font-size' : "14px"
	},

	'#sb-display-bar' : { 
	    'width' : "100%",
	    'cursor' : "pointer", 
	    'height' : "10px",
	    'background-color' : "#000",
	    'display' : "none"
	},

	'#sb-display-bar-elapsed' : {
	    'width' : "0%", 
	    'height' : "8px",
	    'background-color' : "#aaa"
	},

	'.sb-label' : { 
	    'font-size' : "12px",
	    'margin-top' : "10px", 
	    'color': "#a2a2a2"
	},

	'#sb-track-title' : { 'font-size' : "18px" },
	'#sb-track-artist' : { 'font-size' : "14px" },
	//'#sb-track-service { font-size: 12px; margin-top: 10px;}

	'#sb-display-seek' : {
	    'position' : "relative",
	    'top' : "-8px",
	    'width' : "2px", 
	    'height' : "10px",
	    'background-color' : "#eee111",
	    'display' : "none"
	},

	'#sb-submit' : { 
	    'width' : "100%;",
	    'margin-top' : "20px"
	},

	'#sb-submit-button' : { 
	    'background': "#0066cc",
	    'color' : "white",
	    'padding': "10px",
	    'margin': "10px",
	    'text-align' : "center",
	    'font-size': "14px",
	    'cursor' : "pointer"
	}

    };


    function parseCSSObj(obj) {
	css = ""
	for (key in obj) {
	    if (obj.hasOwnProperty(key) && typeof obj[key] == "object") {
		css += key + "{" + parseCSSObj(obj[key]) + "}"
	    }
	    if (obj.hasOwnProperty(key) && typeof obj[key] == "string") {
		css += key + ":" + obj[key] + ";"
	    }
	}
	return css
    };

    function build_element(element, content) {
	var e = document.createElement(element.type)
	e.setAttribute(element.attr, element.value)
	e.innerHTML = content
	document.body.appendChild(e)
    };

    var page = {

	insert_page : function() {
	    //@ifdef DEBUG
	    console.log("[stereopaw] Page.insert_page()")
	    //@endif

	    build_element(
		{ 
		    type : "div",
		    attr : "id",
		    value : "sb-app"
		},
		_content
	    )
	    build_element(
		{ 
		    type : "style",
		    attr : "id",
		    value : "sb-style"
		},
		parseCSSObj(_styles)
	    )

	},

	insert_error_page : function() {
	    //@ifdef DEBUG
	    console.log("[stereopaw] Page.insert_error_page()")
	    //@endif

	    build_element(
		{ 
		    type : "div",
		    attr : "id",
		    value : "sb-app"
		},
		_error
	    )
	    build_element(
		{ 
		    type : "style",
		    attr : "id",
		    value : "sb-style"
		},
		parseCSSObj(_styles)
	    )

	}
    }

    return page;
}());
