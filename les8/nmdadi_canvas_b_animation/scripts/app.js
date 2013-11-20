/*
    Canvas Tutorial
    =================================================
    * Course: NMDAD-I
    * Programmed by: Philippe De Pauw - Waterschoot
    * Last updated: 20/11/2013
    * Version: v0.1.0
    =================================================
    * Setting up canvas
    * Drawing some cool shit
    * Such as: rectangle, lines, circles, k's
    * Animate like an artist
    =================================================
*/

/*
    Declare Global variables
    ========================
    * Extend the scope --> applicable with JS Files
*/
var _canvas, _canvasContext;

/*
    Declare My Own Nice Animation Frame
    ===================================
*/
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
          window.setTimeout(callback, 1000 / 60);
        };
})();

/*
 Function: initCanvas
 ========================
 * Initialize a canvas with his/here 2d context
 */
function initCanvas(){
    if(Modernizr.canvas){
        _canvas = document.getElementById('canvas');//Assign canvas html element to global variable _canvas
        if(_canvas && _canvas.getContext('2d')){
            _canvasContext = _canvas.getContext('2d');//Assign 2d context of current canvas to global variable _canvasContext
            //Solving the f* bug --> redimension the canvas
            _canvas.width = _canvas.clientWidth;
            _canvas.height = _canvas.clientHeight;
            //Call function: window.requestAnimFrame
            //Do a new animation --> 1/60s
            requestAnimFrame(animateCanvas);
        }
    }
}

/*
 Function: animateCanvas
 ========================
 * Draw some rectangles
 * Fill color, stroke color, ...
 */
function animateCanvas(){
    var rx, ry, radius;
    rx = Math.random()*_canvas.width;
    ry = Math.random()*_canvas.height;
    radius = 5+Math.random()*5;
    _canvasContext.beginPath();
    _canvasContext.fillStyle = "rgba(22,160,133,0.9)";
    _canvasContext.arc(rx, ry, radius, 0, Math.PI*2, true);
    _canvasContext.fill();
    _canvasContext.closePath();

    _canvasContext.beginPath();
    _canvasContext.strokeStyle = "rgba(255,255,255,0.32)";
    _canvasContext.moveTo(0, 0);
    _canvasContext.lineTo(rx, ry);
    _canvasContext.stroke();
    _canvasContext.closePath();

    //Do a new animation --> 1/60s
    requestAnimFrame(animateCanvas);
}

/*
 Function: EventHandler
 ========================
 * Listen to the event: if the document is ready for use
 * Event: ready
 */
(function(){
    //Resize event window
    $(window).resize(function(ev){
        ev.preventDefault();
        if(_canvas){
            _canvas.width = _canvas.clientWidth;
            _canvas.height = _canvas.clientHeight;
        }
        return false;
    });

    initCanvas();//Call the function: initCanvas()
})();