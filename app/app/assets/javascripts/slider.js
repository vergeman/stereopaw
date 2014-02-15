$(function(){


    var btn = $('.handle')
    var meter = $('.meter')
    var slider = $('.progress')
    var handleWidth = btn.width()
    var percentage;
    var startOffset, sliderWidth;

    //need to add handlewidth offset (ex: a drag to same place)

    startOffset = btn.offset().left;
    sliderWidth = slider.width() - handleWidth;

    slider.on('click touchstart', moveHandler);

    btn.on('mousedown touchstart', function(e) {
	e.preventDefault(); 
        startOffset = btn.offset().left;
        sliderWidth = slider.width() - handleWidth

        $(document).on('mousemove touchmove', moveHandler);
        $(document).on('mouseup touchend', stopHandler);                
    });




    function moveHandler(e) {
        var posX = e.pageX - (handleWidth / 2); //center to handle
        posX = Math.min(Math.max(0, posX), sliderWidth)

	/* on resize, we are at pixels..prob want %*/
        btn.css({
            left: posX
        });

	meter.css("width", (posX + (handleWidth / 2)));

	percentage = posX / sliderWidth;

	//trigger update
    }

    function stopHandler() {
        $(document).off('mousemove touchmove', moveHandler);
        $(document).off('mouseup touchend', stopHandler);
    }

});
