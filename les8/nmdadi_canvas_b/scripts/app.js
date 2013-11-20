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
        }
    }
}

/*
 Function: drawOnCanvas
 ========================
 * Draw some rectangles
 * Fill color, stroke color, ...
 */
function drawOnCanvas(){
    if(_canvasContext){
        /* Draw rectangle with fill color */
        _canvasContext.fillStyle = "#1ABC9C";
        _canvasContext.fillRect(100, 50, 400, 200);
        _canvasContext.fillStyle = "rgba(241,196,15,0.2)";
        _canvasContext.fillRect(50, 50, 80, 400);
        _canvasContext.fillStyle = "#9B59B6";
        _canvasContext.fillRect(200, 50, 60, 60);
        // Draw a color bar based on one color with different alpha values
        var rx = 5, ry = 5, rside = 50;
        for(var i=0;i<10;i++){
            _canvasContext.fillStyle = 'rgba(241,196,15,' + (1-i/10) + ')';
            _canvasContext.fillRect(rx, ry, rside, rside);
            rx += rside + 5;
        }
        //Draw color bars with the function: drawColorBar(...)
        drawColorBar(_canvasContext, 5, 300, 50, 255, 0, 0);
        drawColorBar(_canvasContext, 5, 355, 50, 0, 255, 0);
        drawColorBar(_canvasContext, 5, 410, 50, 0, 0, 255);
    }
}

/*
 Function: drawOnCanvas
 ========================
 * Draw some rectangles
 * Fill color, stroke color, ...
 */
function drawOnCanvas2(){
    if(_canvasContext){
        //_canvasContext.fillStyle = 'rgba(230,126,34,0.32)';
        //_canvasContext.strokeStyle = 'rgba(230,126,34,0.48)';
        var rx, ry, rw, rh, rc, gc, bc;
        for(var i=0;i<10000;i++){
            rc = Math.round(Math.random()*255);
            gc = Math.round(Math.random()*255);
            bc = Math.round(Math.random()*255);
            rx = Math.random()*_canvas.width;
            ry = Math.random()*_canvas.width;
            rw = 1+Math.random()*1;
            rh = 1+Math.random()*1;
            _canvasContext.fillStyle = 'rgba(' + rc + ',' + gc + ',' + bc + ',' + '0.32' + ')';
            _canvasContext.strokeStyle = 'rgba(' + rc + ',' + gc + ',' + bc + ',' + '0.48' + ')';
            _canvasContext.lineWidth = 2;
            _canvasContext.fillRect(rx, ry, rw, rh);
            _canvasContext.strokeRect(rx, ry, rw, rh);
        }
    }
}

/*
 Function: drawOnCanvas
 ========================
 * Draw some lines
 * Stroke color, ...
 */
function drawOnCanvas3(){
    if(_canvasContext){
        _canvasContext.beginPath();
        _canvasContext.strokeStyle = "#E74C3C";
        _canvasContext.lineWidth = 20;
        _canvasContext.moveTo(100,100);//Place a cursor to a new position
        _canvasContext.lineTo(100,300);
        _canvasContext.moveTo(100,200);
        _canvasContext.lineTo(150,100);
        _canvasContext.moveTo(100,200);
        _canvasContext.lineTo(150,300);
        _canvasContext.stroke();
        _canvasContext.closePath();

        //Call function drawManyKS
        drawManyKS(_canvasContext, 20000);
    }
}

function drawColorBar(context, rx, ry, rside, rc, gc, bc){
    if(context){
        for(var i=0;i<10;i++){
            context.fillStyle = 'rgba(' + rc + ', ' + gc + ', ' + bc + ', ' + (1-i/10) + ')';
            context.fillRect(rx, ry, rside, rside);
            rx += rside + 5;
        }
    }
}

function drawManyKS(context, amount){
    if(context){
        var rx, ry, rw, rh, rc, gc, bc;
        for(var i=0;i<amount;i++){
            rc = Math.round(Math.random()*255);
            gc = Math.round(Math.random()*255);
            bc = Math.round(Math.random()*255);
            rx = Math.random()*_canvas.width;
            ry = Math.random()*_canvas.width;
            rw = 10+Math.random()*10;
            rh = 10+Math.random()*10;
            context.beginPath();
            _canvasContext.strokeStyle = 'rgba(' + rc + ',' + gc + ',' + bc + ',' + '0.48' + ')';
            context.lineWidth = 1+Math.random()*4;
            //context.lineCap = "butt";//"round", "square"
            //context.lineJoin = "miter";//"round", "bevel"
            context.moveTo(rx,ry);//Place a cursor to a new position
            context.lineTo(rx,ry+rh);
            context.moveTo(rx,ry+rh/2);
            context.lineTo(rx+rw,ry);
            context.moveTo(rx,ry+rh/2);
            context.lineTo(rx+rw,ry+rh);
            context.stroke();
            context.closePath();
        }
    }
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

            drawOnCanvas3();//Draw again on canvas when window is resized
        }
        return false;
    });

    initCanvas();//Call the function: initCanvas()
    //drawOnCanvas();//Call the function: drawOnCanvas();
    drawOnCanvas3();
})();