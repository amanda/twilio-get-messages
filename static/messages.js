$( document ).ready(function() {

    setInterval(function() {
        $('#prompt').addClass("dark");
        setTimeout(function() {
            $('#prompt').removeClass("dark");
        }, 500);
    }, 1000);

});
