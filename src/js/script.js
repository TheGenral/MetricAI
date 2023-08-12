AOS.init();

new Typewriter('#keep', {
    strings: ['ey', 'eep', 'eep', 'eep', 'eep'],
    autoStart: true,
    loop: true,
    pauseFor: 2000

});
new Typewriter('#people', {
    strings: ['erformance', 'eople', 'eople', 'eople', 'eople'],
    autoStart: true,
    loop: true,
    pauseFor: 1500

});
new Typewriter('#informed', {
    strings: ['ndicator', 'nformed', 'nvolved', 'nterested', 'nspired'],
    autoStart: true,
    loop: true,
    pauseFor: 1000

});

$(document).ready(function () {
    $(".sec").click(function () {
        $(this).next(".collapsable").slideToggle();
        $(this).toggleClass("selectedsec")
        $(this).children(".section").text("Section 1");
        $(this).children(".fa").toggleClass("fa-plus");
        $(this).children(".fa").toggleClass("fa-minus");

    });
    $('input').focus(function () {
        $(this).parents('.form-group').addClass('focused');
    });

    $('input').blur(function () {
        var inputValue = $(this).val();
        if (inputValue == "") {
            $(this).removeClass('filled');
            $(this).parents('.form-group').removeClass('focused');
        } else {
            $(this).addClass('filled');
        }
    })
})

