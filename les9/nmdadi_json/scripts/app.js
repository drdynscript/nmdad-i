/*
 JSON
 ============
 Datatypes
 ---------
 Number (floating point format - double precision)
 String (Always Double quoted "...")
 vb. "\"MMP is the pace to be\"" (backslash escaping)
 Boolean (true | false)
 null   (empty)
 Array (square brackets [...]
 values comma-seperated
 datatype of the values can be of another type)
 Object (unordered comma-seperated collection of key/value pairs, enclosed by curly braces {...}. Key/value seperated by double point :. The keys must be strings enclosed by double quotes)
 */
var STUDENTSDATAURL = "data/students.json";
var _students;

function loadStudents(){
    $.ajax({
        type:'GET',
        url: STUDENTSDATAURL,
        dataType: 'json',
        cache: false,
        contentType: 'application/json',
        success:function(data){
            _students = data.students;
            window.setTimeout(function(){
                vizuStudents();
            },2000);
        },
        error: function (xhr, status, error) {
            alert(xhr.status + ' ' + xhr.error + ' ' + xhr.responseText);
        }
    });
}

function vizuStudents(){
    var html = '<ul>';
    $.each(_students, function(key, student){
        html += ''
        + '<li>'
        + '<h2>' + student.firstname + '</h2>'
        + '</li>';
    });
    html += '</ul>';
    $('#students').html(html);
}

(function(){
    loadStudents();
})();