/*
    CANVAS TUTORIAL
    ==============================================
    * Programmed by Philippe De Pauw - Waterschoot
    * Copyright 2003-13 Arteveldehogeschool
    * Last modified on: 20/11/2013
    * Version 0.1.0
    ==============================================
    * Canvas heeft altijd JavaScript nodig!
    * Canvas wordt gebruikt om 2D graphics, text en bitmaps te tekenen en te manipuleren
    * Canvas Animation
*/

/*
Global Vars
=================
 */
var canvas, canvasContext;

/*
Best way to simulate the framerate like in flash
fps (frames per seconds) --> 60 fps
--> HTML5 Property: requestAnimationFrame
 */
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000/60);
        };
})();

/*
Function: initCanvas
====================
* Zonder argumenten
* Initialiseren (init) van de Canvas
 */
function initCanvas(){
    if(Modernizr.canvas){
        canvas = document.getElementById('canvas');//Get the canvas and assign to variable canvas
        if(canvas && canvas.getContext('2d')){
            //Fix the dimension of the canvas
            canvas.width = $(window).width();
            canvas.height = $(window).height();
            canvasContext = canvas.getContext('2d');//Get the 2d Context from the canvas object and assign to variable canvasContext
            //Start Animate the canvas via requestAnimFrame method (custom)
            requestAnimFrame(animateCanvas);
        }
    }else{

    }
}

/*
 Function: animateCanvas
 ====================
 * Zonder argumenten
 * Animate de Canvas
 */
function animateCanvas(){
    var rx = Math.random()*canvas.width;
    var ry = Math.random()*canvas.height;

    canvasContext.beginPath();
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "rgba(255,255,255,0.26";
    canvasContext.moveTo(0,0);
    canvasContext.lineTo(rx, ry);
    canvasContext.stroke();
    canvasContext.closePath();

    canvasContext.beginPath();
    canvasContext.fillStyle = "#E74C3C"
    canvasContext.arc(rx, ry, 10, 0, 2*Math.PI, true);
    canvasContext.fill();
    canvasContext.closePath();

    //Start Animate again
    requestAnimFrame(animateCanvas);
}

/*
    Function --> Event Handler
    ==========================
    React on the event: ready
    Desc: Als het document klaar is voor gebruik voer dan de instructies uit
    */
(function(){
    //Listen to resize event --> window
    $(window).on('resize', function(ev){
        if(canvas){
            canvas.width = $(window).width();
            canvas.height = $(window).height();
        }
    });

    initCanvas();
})();
