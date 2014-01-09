/*
 * buildPage: builds the dashboard
 */

SB.Page = (function() {

	var _content =
	    '<div id = "sb-close">x</div>' +
	    '<h1 id = "sb-title">SoundByte</h1>' + 
	    '<div id = "sb-track">' +        //info
	    '<div id = "sb-track-title"></div>' +
	    '<div id = "sb-track-artist"></div>' +
	    '<div id = "sb-track-service"></div>' +
	    '</div>' +                   //info


	    '<div id = "sb-player">' +     //player container

	    '<div id = "sb-time"></div>' +

	    '<div id = "sb-display-bar">' + //graphic bar, seektime
	    '<div id = "sb-display-bar-elapsed"></div>' +
	    '<div id = "sb-display-seek"></div>' +
	    '</div>' + 

	    '<div id = "sb-player-play">></div>' +

	    '</div>' + 


	    '<div id = "sb-submit">' +
	    '     <button id = "sb-submit-button">Submit</button>' +
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
	    'display:none' +
	    '}' +
	    
	'#sb-close { ' +
	    'float:right;' + 
	    '}' +

	'#sb-display-bar { ' +
	    'width: 100%;' +
	    'cursor: pointer;' + 
	    'height: 10px;' + 
	    'background-color: #000;' +
	    '}' +

	'#sb-display-bar-elapsed { ' +
	    'width: 0%;' +
	    'height: 8px;' +
	    'background-color: #aaa' +
	'}' +

	'#sb-display-seek { ' +
	    'position:relative;' +
	    'top: -8px;' +
	    'width: 2px;' +
	    'height: 10px;' +
	    'background-color: #eee111;' +
	    'display:none;' +	
	'}';

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
