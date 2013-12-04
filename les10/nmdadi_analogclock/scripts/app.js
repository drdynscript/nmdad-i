/*
Function: initApp
No arguments
Desc: Just Initalize the App
 */
function initApp(){
    startClock('#clock1');
    startClock('#clock2');
    startClock('#clock3');
}

/*
 Function: startClock
 Arguments: id of a clock
 Desc: Clock is running
 */
function startClock(id){
    window.setTimeout(function(){
        startClock(id);
    }, 10);//Timing function --> 10ms

    var now = new Date();//Get the date and time
    //Get time parts of the date (now)
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var mseconds = now.getMilliseconds();
    //Get the degrees for each pointer
    var hoursDegrees = 360*(hours+minutes/60)/12;
    var minutesDegrees = 360*(minutes+seconds/60)/60;
    var secondsDegrees = 360*(seconds+mseconds/1000)/60;
    //CSS3 transform --> rotate
    $(id + ' .clock-pointer-hours').css('-webkit-transform','rotate(' + hoursDegrees + 'deg)');
    $(id + ' .clock-pointer-hours').css('-moz-transform','rotate(' + hoursDegrees + 'deg)');
    $(id + ' .clock-pointer-hours').css('-o-transform','rotate(' + hoursDegrees + 'deg)');
    $(id + ' .clock-pointer-hours').css('-ms-transform','rotate(' + hoursDegrees + 'deg)');
    $(id + ' .clock-pointer-hours').css('transform','rotate(' + hoursDegrees + 'deg)');

    $(id + ' .clock-pointer-minutes').css('-webkit-transform','rotate(' + minutesDegrees + 'deg)');
    $(id + ' .clock-pointer-minutes').css('-moz-transform','rotate(' + minutesDegrees + 'deg)');
    $(id + ' .clock-pointer-minutes').css('-o-transform','rotate(' + minutesDegrees + 'deg)');
    $(id + ' .clock-pointer-minutes').css('-ms-transform','rotate(' + minutesDegrees + 'deg)');
    $(id + ' .clock-pointer-minutes').css('transform','rotate(' + minutesDegrees + 'deg)');

    $(id + ' .clock-pointer-seconds').css('-webkit-transform','rotate(' + secondsDegrees + 'deg)');
    $(id + ' .clock-pointer-seconds').css('-moz-transform','rotate(' + secondsDegrees + 'deg)');
    $(id + ' .clock-pointer-seconds').css('-o-transform','rotate(' + secondsDegrees + 'deg)');
    $(id + ' .clock-pointer-seconds').css('-ms-transform','rotate(' + secondsDegrees + 'deg)');
    $(id + ' .clock-pointer-seconds').css('transform','rotate(' + secondsDegrees + 'deg)');

    $(id).css('-webkit-transform','rotate(' + secondsDegrees + 'deg)');
}

//Self executing function
//alternative for document.ready
(function(){
    initApp();
})();