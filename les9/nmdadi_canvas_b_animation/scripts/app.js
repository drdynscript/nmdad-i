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
var _canvas, _canvasContext, _particlesArray;

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
            //Create new Firework
            new Firework();
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

    //Loop through Particles Array
    var l = _particlesArray.length, particle;
    for(var i=0;i<l;i++){
        particle = _particlesArray[i];
        particle.update(new Date());
        particle.drawOnCanvasContext(_canvasContext);//Draw on 2d Context of canvas
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
function Particle(px, py, psize, velX, velY, cr, cg, cb){
    this.px = px;
    this.py = py;
    this.psize = psize;
    this.velX = velX;
    this.velY = velY;
    this.startTime = new Date();//Snapshot in time --> current time
    this.t = 0;//Time difference between current time and start time
    this.cr = cr;
    this.cg = cg;
    this.cb = cb;

    this.update = function(currentTime){
        //Time difference
        t = (currentTime.getTime()- this.startTime.getTime())/1000;

        //ALGORITHM 1
        /*this.px += 5*this.velX;
        this.py += 5*this.velY;*/

        //ALGORITHM 2 SNOW STORM
        /*this.px += 5+this.velX;
        this.py += 5+this.velY;*/

        //ALGORITHM 3
        /*this.px += this.velX;
        this.py += Math.pow(t, this.velY);*/

        //ALGORITHM 4
        /*this.px += this.velX*-1*t;
         this.py += this.velY;*/

        //ALGORITHM 5
        /*this.px += (this.velX/this.velY)/t;
        this.py += this.velY*this.velX*t;*/

        //ALGORITHM 6
        this.px += this.velX;
        this.py += this.velY+9.81*t*0.6;
    }

    this.drawOnCanvasContext = function(context){
        context.beginPath();
        context.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',0.26)';
        context.arc(this.px, this.py, this.psize, 0, Math.PI*2, true);
        context.fill();
        //Doing some weird stuff
        context.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',0.26)';
        context.moveTo(0,0);
        context.lineTo(this.px,this.py);
        context.arc(this.px, this.py, this.psize*this.psize, 0, Math.PI*2, true);
        context.stroke();
        context.closePath();
    }
}

/*
 Function: Firework
 ========================
 * Simulation of a OOP class
 * Properties + Methods (functions)
 */
function Firework(){
    //Ignition point
    var fx = Math.random()*_canvas.width;
    var fy = Math.random()*_canvas.height;
    var cr = Math.round(Math.random()*255);
    var cg = Math.round(Math.random()*255);
    var cb = Math.round(Math.random()*255);

    if(_particlesArray == null)
        _particlesArray = [];//Like new Array();

    var particle, psize = 4, velX, velY;
    for(var i=0;i<50+Math.random()*450;i++){
        velX = Math.random()*8-4;
        velY = Math.random()*8-4;
        particle = new Particle(fx, fy, psize, velX, velY, cr, cg, cb);//Create a new Particle --> object

        _particlesArray.push(particle);//Add particle to existing array
    }
}


/*
 Function: UnitTestParticles
 ========================
 * Test the Particles
 */
function UnitTestParticles(){

    if(_particlesArray == null)
        _particlesArray = [];//Like new Array();

    var particle, px, py, psize = 4, velX, velY;
    for(var i=0;i<1000;i++){
        px = Math.random()*_canvas.width;
        py = Math.random()*_canvas.height;
        velX = Math.random()*8-4;
        velY = Math.random()*8-4;
        particle = new Particle(px, py, psize, velX, velY);//Create a new Particle --> object

        _particlesArray.push(particle);//Add particle to existing array
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
        }
        return false;
    });

    initCanvas();//Call the function: initCanvas()
})();