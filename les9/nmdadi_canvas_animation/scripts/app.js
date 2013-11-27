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
            var particle, rx, ry;
            for(var i=0;i<1;i++){
                rx = Math.random()*canvas.width;
                ry = Math.random()*canvas.height;

                particle = new Particle(i, rx, ry, 10);

                if(_particlesArray == null)
                    _particlesArray = [];

                _particlesArray.push(particle);
            }
            requestAnimFrame(animateCanvas);
        }
    }else{

    }
}

var _particlesArray;

/*
 Function: animateCanvas
 ====================
 * Zonder argumenten
 * Animate de Canvas
 */
function animateCanvas(){
    if(_particlesArray == null){
        _particlesArray = [];//Create a new Array - better than the following method
        //_particlesArray = new Array();
    }

    //Loop through the Particles Array
    var particle;
    for(var i=0;i<_particlesArray.length;i++){
        particle = _particlesArray[i];
        particle.update();
        particle.drawOnCanvasContext(canvasContext);
    }


    //Start Animate again
    requestAnimFrame(animateCanvas);
}

/*
    Function --> Simulate a Particle class
    ======================================
    Properties, methods (functions)
 */
function Particle(id, x, y, size){
    this.id = id;
    this.x = x;
    this.y = y;
    this.size = size;

    this.update = function(){
        this.x += 5;
        this.y += 5;
    }

    this.drawOnCanvasContext = function(context){
        context.save();

        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "rgba(255,255,255,0.26";
        context.fillStyle = "#E74C3C"
        context.arc(this.x, this.y, this.size, 0, 2*Math.PI, true);
        context.fill();
        context.stroke();
        context.closePath();

        context.restore();
    }
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
