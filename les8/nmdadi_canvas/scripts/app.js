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
*/

/*
Global Vars
=================
 */
var canvas, canvasContext;

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
        }
    }else{

    }
}

/*
 Function: drawOnCanvas
 ======================
 * Zonder argumenten
 * Desc: Drawing 2D Graphics, text and/or bitmaps on the 2D Context of this canvas
 */
function drawOnCanvas(){
    if(canvasContext){
        /* Draw a Rectangle */
        canvasContext.fillStyle = '#0066ff';
        canvasContext.fillRect(0, 50, 200, 50);
        canvasContext.fillStyle = 'rgb(255,0,0)';
        canvasContext.fillRect(200, 150, 20, 50);
        canvasContext.fillStyle = 'rgba(255,0,0,0.6)';
        canvasContext.fillRect(50, 50, 20, 500);
        /* Draw a serie rectangles */
        var rx = 5, ry = 5, rsize = 50;
        for(var i=0;i<10;i++){
            canvasContext.fillStyle = 'rgba(0,255,0,' + (1-i/10) + ')';
            canvasContext.fillRect(rx, ry, rsize, rsize);
            rx += rsize + 5;
        }
        /* Draw a serie again */
        rx = 5;ry = 5;
        for(var i=10;i>0;i--){
            canvasContext.fillStyle = 'rgba(0,255,255,' + (1-i/10) + ')';
            canvasContext.fillRect(rx, ry, rsize, rsize);
            rx += rsize + 5;
            ry += rsize + 5;
        }
        /* Draw a color bar via function */
        drawColorBarOnCanvas(canvasContext, 5, 200, 25, 255, 255, 0);
        drawColorBarOnCanvas(canvasContext, 50, 300, 10, 33, 66, 99);

        drawColorBarOnCanvas(canvasContext, 50, 350, 50, 255, 0, 0);
        drawColorBarOnCanvas(canvasContext, 50, 405, 50, 0, 255, 0);
        drawColorBarOnCanvas(canvasContext, 50, 460, 50, 0, 0, 255);
    }
}

function drawOnCanvas2(){
    if(canvasContext){
        /*
        Tekenen van rechthoeken met een bepaalde border
         */
        canvasContext.strokeStyle = "#1ABC9C";
        canvasContext.fillStyle = "rgba(22,160,133,0.086)";
        var rx, ry, rw, rh;
        for(var i=0;i<1000;i++){
            rx = Math.random()*canvas.width;
            ry = Math.random()*canvas.height;
            rw = Math.random()*200;
            rh = Math.random()*200;
            canvasContext.fillStyle = 'rgba(' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255)+ ',' + Math.round(Math.random()*255) + ', 0.086';
            canvasContext.fillRect(rx, ry, rw, rh);
            canvasContext.strokeRect(rx, ry, rw, rh);
        }
    }
}

function drawOnCanvas3(){
    if(canvasContext){
        /* Tekenen van lijnen */
        canvasContext.beginPath();
        canvasContext.strokeStyle = "#9B59B6";
        canvasContext.lineWidth = 5;//Breedte van een lijn
        canvasContext.moveTo(100,50);//Verplaats de ingebeelde cursor naar een bepaalde positie
        canvasContext.lineTo(200, 250);
        canvasContext.stroke();//Assign stroke style to the path --> lijn
        canvasContext.closePath();

        /* Tekenen van een W */
        canvasContext.beginPath();
        canvasContext.fillStyle = "#3498DB";
        canvasContext.strokeStyle = "#E67E22";
        canvasContext.lineWidth = 50;
        canvasContext.lineJoin = "round";//bevel, round, miter
        canvasContext.moveTo(100,50);
        canvasContext.lineTo(200, 250);
        canvasContext.lineTo(300, 50);
        canvasContext.lineTo(400, 250);
        canvasContext.lineTo(500, 50);
        canvasContext.fill();
        canvasContext.stroke();
        canvasContext.closePath();

        /* Tekenen van linen met specifieke linecap */
        canvasContext.beginPath();
        canvasContext.strokeStyle = "#E67E22";
        canvasContext.lineWidth = 20;
        canvasContext.lineCap = "butt";
        canvasContext.moveTo(100,350);
        canvasContext.lineTo(250,350);
        canvasContext.stroke();
        canvasContext.closePath();

        canvasContext.beginPath();
        canvasContext.strokeStyle = "#E67E22";
        canvasContext.lineWidth = 20;
        canvasContext.lineCap = "round";
        canvasContext.moveTo(100,450);
        canvasContext.lineTo(250,450);
        canvasContext.stroke();
        canvasContext.closePath();

        canvasContext.beginPath();
        canvasContext.strokeStyle = "#E67E22";
        canvasContext.lineWidth = 20;
        canvasContext.lineCap = "square";
        canvasContext.moveTo(100,550);
        canvasContext.lineTo(250,550);
        canvasContext.stroke();
        canvasContext.closePath();

        /* Tekenen van many WS */
        drawManyWS(canvasContext, 100);
    }
}
function drawOnCanvas4(){
    if(canvasContext){
        /* Tekenen van bogen */
        var startAngle = 45*Math.PI/180;//Radialen
        var endAngle = 135*Math.PI/180;//Radialen
        var radius = 60;
        canvasContext.beginPath();
        canvasContext.strokeStyle = "#E67E22";
        canvasContext.arc(300, 300, radius, startAngle, endAngle, true);
        canvasContext.stroke();
        canvasContext.closePath();

        /* Draw a circle */
        var rx, ry, radius;
        for(var i=0;i<1000;i++){
            rx = Math.random()*canvas.width;
            ry = Math.random()*canvas.width;
            radius = 2+Math.random()*18;
            drawCircle(canvasContext, rx, ry, radius);
        }

    }
}


function drawColorBarOnCanvas(context, rx, ry, rsize, cr, cg, cb){
    if(context){
        for(var i=0;i<10;i++){
            canvasContext.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (1-i/10) + ')';
            canvasContext.fillRect(rx, ry, rsize, rsize);
            rx += rsize + 5;
        }
    }
}

function drawManyWS(context, amount){
    if(context){
        var rx, ry, rw, rh;
        for(var i=0;i<amount;i++){
            rx = Math.random()*canvas.width;
            ry = Math.random()*canvas.width;
            rh = 100+Math.random()*50;
            rw = 1+Math.random()*5;
            /* Tekenen van een W */
            context.beginPath();
            context.strokeStyle = 'rgba(' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255)+ ',' + Math.round(Math.random()*255) + ', 1';
            context.lineWidth = 1;
            context.moveTo(rx,ry);
            context.lineTo(rx+rw, ry+rh);
            context.lineTo(rx+2*rw, ry);
            context.lineTo(rx+3*rw, ry+rh);
            context.lineTo(rx+4*rw, ry);
            context.stroke();
            context.closePath();
        }
    }
}

function drawCircle(context, rx, ry, radius){
    if(context){
        context.beginPath();
        canvasContext.fillStyle = 'rgba(' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255)+ ',' + Math.round(Math.random()*255) + ', 0.2';
        context.strokeStyle = 'rgba(' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255)+ ',' + Math.round(Math.random()*255) + ', 1';
        context.lineWidth = 1;
        context.arc(rx, ry, radius, 0, 2*Math.PI);
        context.fill();
        context.stroke();
        context.closePath();
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
            drawOnCanvas4();
        }
    });

    initCanvas();//Call the function initCanvas()
    //drawOnCanvas();//Call the function drawOnCanvas();
    //drawOnCanvas2();
    //drawOnCanvas3();
    drawOnCanvas4();
})();
