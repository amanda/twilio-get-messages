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
        console.log("Getting new msgs for timestamp " + time);
        $.ajax({
            url: "http://" + document.location.host + "/raw/" + time + "/" + (time + interval)
        }).done(function(data) {
            console.log(data);
            if (data) {
                $("#text").append(data + ". ");
            }
        });
    }, (interval * 1000));

});
