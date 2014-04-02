/*
 * buildPage: builds the dashboard
 */

SB.Page = (function() {

	var _content =
	    '<div id = "sb-close">' +
	'<img src= "http://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5151/icon-close.png" width="12px"/>' +
	'</div>' +

    '<div id="sb-logo""> ' +
	'<img height="36" src= "http://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5151/assets/stereopaw-logo-main.png"/>' +
'</div>' + 
	    '<div id = "sb-title">' +

	'<img src= "http://ec2-54-220-193-184.eu-west-1.compute.amazonaws.com:5151/stereopaw-marklet-title.png"/>' +
	'</div>' + 

	    '<div id = "sb-track">' +        //info

	    '<div id = "sb-track-title-label" class = "sb-label">Title</div>' +
	    '<div id = "sb-track-title"></div>' +

	    '<div id = "sb-track-artist-label" class = "sb-label">Artist</div>' +
	    '<div id = "sb-track-artist"></div>' +

	    '<div id = "sb-track-time-label" class = "sb-label">Timestamp</div>' +
	    '<div id = "sb-time"></div>' +

//	    '<div id = "sb-track-service"></div>' +
	    '</div>' +                   //info


	    '<div id = "sb-player">' +     //player container


	    '<div id = "sb-display-bar">' + //graphic bar, seektime
	    '<div id = "sb-display-bar-elapsed"></div>' +
	    '<div id = "sb-display-seek"></div>' +
	    '</div>' + 


	    '</div>' + 


	    '<div id = "sb-submit">' +
	'<div id="sb-submit-button">Submit</div>' + 
	    '</div>' + //soundbyte-submit

	    '</div>'; //player,
	    
	var _style =
	'#sb-app { ' + 
	    'position: fixed; ' +
	    'top: 50px; ' +
	    'right: 0; ' +
	    'width: 300px;' +
	    'background-color: #fff;' +
	    'border: 1px solid #aaa;' +
	    'z-index: 99999999999999999;' +
	    'text-align:left;' +
	    'display:none' +
	    '}' +

    '#sb-title { padding: 10px; margin-top: 8px; border-bottom: 1px solid #000; margin-left: 10px; margin-right: 10px;} ' +

'#sb-track { margin-left: 10px; font-size: 14px; padding-top: 10px; margin-right: 10px; font: 12px/1.4 "Lucida Grande","Lucida Sans Unicode","Lucida Sans",Garuda,Verdana,Tahoma,sans-serif; }' +
	

	'#sb-close { ' +
	    'float:right;padding: 8px; padding-right: 6px; cursor: pointer;' +
	    '}' +

'#sb-logo { float:left; padding: 8px; padding-left: 10px; margin-right: 4px;} ' +

'#sb-time { font-size: 14px; }'+


	'#sb-display-bar { ' +
	    'width: 100%;' +
	    'cursor: pointer;' + 
	    'height: 10px;' + 
	    'background-color: #000;' +
	'display:none;' +
	    '}' +

	'#sb-display-bar-elapsed { ' +
	    'width: 0%;' +
	    'height: 8px;' +
	    'background-color: #aaa' +
	'}' +

'.sb-label { font-size: 12px; margin-top: 10px; color: #a2a2a2;}' +
'#sb-track-title { font-size: 18px;}' +
'#sb-track-artist { font-size: 14px; }' +
//'#sb-track-service { font-size: 12px; margin-top: 10px;}' +

	'#sb-display-seek { ' +
	    'position:relative;' +
	    'top: -8px;' +
	    'width: 2px;' +
	    'height: 10px;' +
	    'background-color: #eee111;' +
	    'display:none;' +	
	'}' +

'#sb-submit { width: 100%; margin-top: 20px;}' +

    '#sb-submit-button { background: #0066cc;  color:white; padding: 10px; margin: 10px; text-align: center; font-size: 14px; cursor:pointer;}';
    
    function build_element(element, content) {
	var e = document.createElement(element.type)
	e.setAttribute(element.attr, element.value)
	e.innerHTML = content
	document.body.appendChild(e)
    };

    var page = {

	insert_page : function() {

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
		_style
	    )

	}

    }

    return page;
}());
