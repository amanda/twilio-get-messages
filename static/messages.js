$( document ).ready(function() {

    setInterval(function() {
        $('#prompt').addClass("dark");
        setTimeout(function() {
            $('#prompt').removeClass("dark");
        }, 500);
    }, 1000);

    var interval = 1;
    // leaving a 30s grace period because the db can be laggy :(
    var time = (Date.now() / 1000) - (interval * 30);
    setInterval(function() {
        time += interval;
        $.ajax({
            url: "http://" + document.location.host + "/raw/" + time + "/" + (time + interval)
        }).done(function(data) {
            if (data) {
                typeOut(0, data + ". ");
            }
        });
    }, (interval * 1000));

    var text_container = $("#text");
    function typeOut(i, text) {
        if (i < text.length) {
            text_container.append(text[i]);

            // random delay but make sure all text can be typed within the interval
            var delay = (Math.random() * ((interval * 1000) / text.length));
            setTimeout(function() {
                typeOut(i + 1, text)
            }, delay);
        }
    }

});
