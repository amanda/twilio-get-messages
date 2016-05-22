$( document ).ready(function() {

    setInterval(function() {
        $('#prompt').addClass("dark");
        setTimeout(function() {
            $('#prompt').removeClass("dark");
        }, 500);
    }, 1000);

    var interval = 1000; // 1 second
    function poll(start_time) {
        var now = (Date.now() / 1000);
        var url = "http://" + document.location.host + "/raw/" + start_time + "/" + now;

        $.ajax({
            url: url
        }).done(function(data) {
            if (data) {
                data += ". ";
                typeOut(0, data, now);
            } else {
                // wait an interval before re-polling
                setTimeout(function() {
                    poll(now);
                }, interval);
            }
        });
    };

    var text_container = $("#text");
    function typeOut(i, text, start_time) {
        if (i < text.length) {
            text_container.append(text[i]);

            // random delay but try to fit it into the length of an interval
            var delay = (Math.random() * (interval / text.length));
            setTimeout(function() {
                typeOut(i + 1, text, start_time)
            }, delay);
        } else {
            poll(start_time);
        }
    }

    poll(Date.now() / 1000);

});
