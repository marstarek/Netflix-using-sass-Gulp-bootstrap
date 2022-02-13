$(document).ready(function() {
    $(window).on("scroll", function() {
        if ($(this).scrollTop() > 200) {
            $(".navbar").addClass("bg-black-transparent");
            console.log("dfdf");
        } else {
            $(".navbar").removeClass("bg-black-transparent");
        }
    });
});