/*
App: Vimeo App
=========================================================================
Version: 0.1.0
Last updated: 11/12/2013
=========================================================================
*/


var _vimeoData = null;//Variable - Global Scope

var URLDATAVIMEOGROUP = 'http://vimeo.com/api/v2/group/{0}/videos.json?callback=?';

/*
 Utilities
 =========================================================================
 */
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

/*
Function: Load Vimeo Group Data
=========================================================================
Load Vimeo Videos from a certain group
*/
function loadVimeoGroup(groupname){
    //Ansynchrone aanvraag tot data
    $.ajax({
        type:'GET',
        url:URLDATAVIMEOGROUP.format(groupname),
        dataType:'jsonp',
        contentType:'application/json',
        cache:false,
        success:function(data){
            _vimeoData = data;
            //Parse and Vizu Data
            parseAndVizuVimeoData();
        }
    });
}

/*
Function: Parse en Visualize Vimeo Data
=========================================================================
Show all Vimeo data
*/
function parseAndVizuVimeoData(){
    $('#vimeoitems').html();//Clear all data in element
    
    var content = '';
    content += '<ul>';
    $.each(_vimeoData, function(key,_vimeoDataItem){
       content += ''
        + '<li data-id="' + _vimeoDataItem.id + '" class="vimeoitem">'
        + '<h1>' + _vimeoDataItem.title + '</h1>'
        + '<p>'
        + _vimeoDataItem.description
        + '</p>'
        + '<img src="' + _vimeoDataItem.user_portrait_medium + '"/>'
        + '</li>';//+ Verbinden van strings --> Concat
    });
    content += '</ul>';
    $('#vimeoitems').append(content);
}

/*
Function: Nameless function
=========================================================================
Simulate document.ready but better
*/
(function(){
    /* Call function: loadEcoplan */
    loadVimeoGroup(209646);
})();