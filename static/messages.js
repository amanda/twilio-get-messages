$( document ).ready(function() {

    setInterval(function() {
        $('#prompt').addClass("dark");
        setTimeout(function() {
            $('#prompt').removeClass("dark");
        }, 500);
    }, 1000);

    var interval = 1;
    var time = (Date.now() / 1000) - interval;
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

            setTimeout(function() {
                typeOut(i + 1, text)
            }, (Math.random() * ((interval * 1000) / text.length)));
        }
    }

});
