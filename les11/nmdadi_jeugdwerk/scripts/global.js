//NAMELESS FUNCTION - AUTO EXECUTED WHEN DOCUMENT IS LOADED
(function(){
    //alert("Mega template ^_^ in HTML5 & CSS3");//ALERT BOX IN WINDOW
    console.log("Mega template ^_^ in HTML5 & CSS3");//LOG IN CONSOLE TAB DEVTOOLS

    $('.menu-toggle').click(function(ev){
        ev.preventDefault();
        $('#main-navigation ul').slideToggle(600, 'linear');
        return false;
    });

    //SCROLL TO TOP
    $('.scrolltotop').click(function(ev){
        ev.preventDefault();
        $('html, body').animate({scrollTop:0},600);
        return false;
    });

    //FADE IN AND OUT SCROLLTOTOP
    $(window).scroll(function(ev){
        if($(this).scrollTop() > 60)
            $('.scrolltotop').fadeIn();
        else
            $('.scrolltotop').fadeOut();
    });

    //SCROLL TO TOP
    $(window).resize(function(ev){
        ev.preventDefault();
        if($(this).width() > 480)
            $('#main-navigation ul').css('display', 'block');
        else
            $('#main-navigation ul').css('display', 'none');
        return false;
    });
})();