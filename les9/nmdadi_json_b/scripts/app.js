/*
    Make a new JSON file
    ====================

    DataTypes
    ---------
    1) Number
        double precision floating point value
        ex.: 16.54
    2) String
        double quoted --> "..."
        backslash escaping --> "\"...\""
    3) Boolean
        true | false
    4) Array
        ordered comma-separated sequence of values
        enclosed by square brackets --> [...]
        datatype of values can be different
    5) null
        empty
    6) Object
        unordered comma-separated collection of key/value pairs
        enclosed by curly braces --> {...}
        key is always a string without backslash escaping
        separation between key and value by double point --> :

    Validation
    ----------
    http://jsonlint.com/
*/

var URLPORTFOLIO = "data/portfolio.json";
var _portfolioitems;

function loadPortfolio(){
    $.ajax({
        type:'GET',
        url:URLPORTFOLIO,
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            _portfolioitems = data.portfolioitems;
            vizPortfolio();
        },
        error:function(xhr, status, error){
            console.log(xhr.responseText);

        }
    });
}

function vizPortfolio(){
    var html = ''
    $.each(_portfolioitems, function(key, item){
        html += ''
        + '<h3>' + item.title + '</h3>'
        + '<div>'
        + '<p>' + item.description + '</p>'
        + '<p>' + item.body + '</p>'
        + '</div>';
    });
    html += '</ul>';

    $('#portfolio').html(html);//Assign the value of html object to speciwfied html element --> #portfolio
    $('#portfolio').accordion();//Accordion Jquery UI

    $('#portfolioamount span').html(_portfolioitems.length);//show the length in a visual container
}

(function(){
  loadPortfolio();
})();