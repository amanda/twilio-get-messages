$( document ).ready(function() {

    setInterval(function() {
        $('#prompt').addClass("dark");
        setTimeout(function() {
            $('#prompt').removeClass("dark");
        }, 500);
    }, 1000);

    var interval = 1;
    var text_container = $("#text");
    // leaving a 30s grace period because the db can be laggy :(
    var time = (Date.now() / 1000) - (interval * 30);
    setInterval(function() {
        time += interval;
        var url = "http://" + document.location.host + "/raw/" + time + "/" + (time + interval);

        $.ajax({
            url: url
        }).done(function(data) {
            if (data) {
                data += ". ";
                if (data.length < 100) {
                    typeOut(0, data);
                } else {
                    // hundreds of element appends per second are apparently too much
                    text_container.append(data);
                }
            }
        });
    }, (interval * 1000));

    function typeOut(i, text) {
        if (i < text.length) {
            text_container.append(text[i]);

            // random delay but make sure all text can be typed within the interval
            var delay = (Math.random() * ((interval * 100) / text.length));
            setTimeout(function() {
                typeOut(i + 1, text)
            }, delay);
        }
    }

});
