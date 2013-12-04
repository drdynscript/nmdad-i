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
var _canvas, _canvasContext, _ballsArray, pId = 0;

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
            //Execute a unit test for particles
            //UnitTestParticles()
            //Create MassPong
            new MassPong(_canvasContext, 1000);
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

    //Clear the canvas
    _canvasContext.globalCompositeOperation = "source-over";
    _canvasContext.fillStyle = "rgba(0,0,0,1)";
    _canvasContext.fillRect(0,0,_canvas.width, _canvas.height);
    _canvasContext.globalCompositeOperation = "lighter";

    if(_ballsArray == null)
        _ballsArray = [];//Like new Array();
    //Loop through Balls Array
    var ball;
    for(var i=0;i<_ballsArray.length;i++){
        ball = _ballsArray[i];
        ball.update(new Date());
        ball.drawOnCanvasContext(_canvasContext);//Draw on 2d Context of canvas
    }

    //Do a new animation --> 1/60s
    requestAnimFrame(animateCanvas);
}

/*
 Function: Particle
 ========================
 * Simulation of a OOP class
 * Properties + Methods (functions)
 * Actions: Setup + Update + ReDraw
 */
function Ball(context, id, px, py, psize, speedX, speedY, cr, cg, cb){
    this.context = context;
    this.id = id;
    this.px = px;
    this.py = py;
    this.psize = psize;
    this.speedX = speedX;
    this.speedY = speedY;
    this.startTime = new Date();//Snapshot in time --> current time
    this.t = 0;//Time difference between current time and start time
    this.cr = cr;
    this.cg = cg;
    this.cb = cb;
    this.opacity = 1;
    this.hit = false;
    this.hitRadius = 6*this.psize;

    this.update = function(currentTime){
        //Time difference
        t = (currentTime.getTime()- this.startTime.getTime())/1000;

        //ALGORITHM 6
        if(this.px+this.speedX > this.psize/2 && this.px+this.speedX < this.context.canvas.width-this.psize/2){
            this.px += this.speedX;
        }else{
            this.hit = true;
            this.speedX *= -1;
        }
        if(this.py+this.speedY > this.psize/2 && this.py+this.speedY < this.context.canvas.height-this.psize/2){
            this.py += this.speedY;
        }else{
            this.hit = true;
            this.speedY *= -1;
        }
    }

    this.drawOnCanvasContext = function(){
        this.context.beginPath();
        this.context.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + this.opacity + ')';
        this.context.arc(this.px, this.py, this.psize, 0, Math.PI*2, true);
        this.context.fill();
        this.context.closePath();

        if(this.hit && this.hitRadius > this.psize){
            this.context.beginPath();
            this.context.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',0.62)';
            this.context.arc(this.px, this.py, this.hitRadius, 0, Math.PI*2, true);
            this.context.stroke();
            this.context.closePath();

            this.hitRadius*=0.99;
        }else{
            this.hit = false;
            this.hitRadius = 6*this.psize;
        }
    }
}

/*
 Function: MassPong
 ========================
 * Simulation of a OOP class
 * Properties + Methods (functions)
 */
function MassPong(context, amount){
    //Ignition point
    var fx = Math.random()*_canvas.width;
    var fy = Math.random()*_canvas.height;
    var cr = Math.round(Math.random()*255);
    var cg = Math.round(Math.random()*255);
    var cb = Math.round(Math.random()*255);

    if(_ballsArray == null)
        _ballsArray = [];//Like new Array();

    var ball, psize = 2, speedX, speedY;
    for(var i=0;i<amount;i++){
        speedX = Math.random()*8-4;
        speedY = Math.random()*8-4;
        ball = new Ball(context, pId, fx, fy, psize, speedX, speedY, cr, cg, cb);//Create a new Particle --> object

        _ballsArray.push(ball);//Add ball to existing array

        pId++;
    }

    $('#nballs span').html(pId + ' balls');
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