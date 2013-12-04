/*
    App: Mixed Clock Aka Smartwatch
    ===============================
    Version: 0.1.0
    Dev by Drdynscript
*/

/*
Function: initApp
=================
No arguments --> ()
 */
function initApp(){
    startClock('#clock1');
    startClock('#clock2');
    startClock('#clock3');
}

/*
 Function: startClock
 =================
 Arguments: containerId (id from the html element)
 */
function startClock(containerId){
    window.setTimeout(function(){
        startClock(containerId);
    }, 10);//10 ms

    var now = new Date();//Get the current time and date
    //Get the time parts from the current date
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var mseconds = now.getMilliseconds();

    //Calculate the degrees
    var hoursDegrees = 360*(hours+minutes/60)/12;
    var minutesDegrees = 360*(minutes+seconds/60)/60;
    var secondsDegrees = 360*(seconds+mseconds/1000)/60;

    //Make two digits for eacht time part
    var hStr = (hours < 10)?'0'+hours:hours.toString();
    var mStr = (minutes < 10)?'0'+minutes:minutes.toString();
    var sStr = (seconds < 10)?'0'+seconds:seconds.toString();

    //Assign parts to UI --> HTML Elements
    $(containerId + ' .clock-indicator-hours.led1').html(hStr.charAt(0));
    $(containerId + ' .clock-indicator-hours.led0').html(hStr.charAt(1));
    $(containerId + ' .clock-indicator-minutes.led1').html(mStr.charAt(0));
    $(containerId + ' .clock-indicator-minutes.led0').html(mStr.charAt(1));
    $(containerId + ' .clock-indicator-seconds.led1').html(sStr.charAt(0));
    $(containerId + ' .clock-indicator-seconds.led0').html(sStr.charAt(1));

    //$(containerId).css('transform','rotate(' + secondsDegrees + 'deg)');
    /*
     -webkit-transform:rotate(0deg);
     -moz-transform:rotate(0deg);
     -o-transform:rotate(0deg);
     -ms-transform:rotate(0deg);
     transform:rotate(0deg);
     */
    $(containerId + ' .clock-compass .clock-compass-indicator').css('-webkit-transform', 'rotate(' + secondsDegrees + 'deg)');
    $(containerId + ' .clock-compass .clock-compass-indicator').css('-moz-transform', 'rotate(' + secondsDegrees + 'deg)');
    $(containerId + ' .clock-compass .clock-compass-indicator').css('-o-transform', 'rotate(' + secondsDegrees + 'deg)');
    $(containerId + ' .clock-compass .clock-compass-indicator').css('-ms-transform', 'rotate(' + secondsDegrees + 'deg)');
    $(containerId + ' .clock-compass .clock-compass-indicator').css('transform', 'rotate(' + secondsDegrees + 'deg)');

    //$(containerId).css('-webkit-transform', 'scale(' + secondsDegrees/6 + ')');
}

//Self executing function
//Nameless function
//Equal to document.ready
(function(){
    initApp();//Initialize Application
})();