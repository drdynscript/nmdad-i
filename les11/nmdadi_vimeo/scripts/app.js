/*
App: Vimeo App
=========================================================================
Version: 0.1.0
Last updated: 11/12/2013
=========================================================================
*/


var _vimeoData = null;//Variable - Global Scope

var URLDATAVIMEOGROUP = 'http://vimeo.com/api/v2/group/{0}/videos.json?page={1}&callback=?';

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
function loadVimeoGroup(groupname, page){
    //Ansynchrone aanvraag tot data
    $.ajax({
        type:'GET',
        url:URLDATAVIMEOGROUP.format(groupname, page),
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
    $.each(_vimeoData, function(key,_vimeoDataItem){
       content += ''
        + '<li data-id="' + _vimeoDataItem.id + '" class="col col-sc1-12 col-sc2-6 col-sc3-4 col-sc4-4 col-sc5-3 vimeoitem">'
        + '<section class="content">' + '<h1>' + _vimeoDataItem.title + '</h1>' + '<p>' + _vimeoDataItem.description + '</p>' + '<p class="tags">' + _vimeoDataItem.tags + '</p>' + '</section>'
        + '<figure>' + '<img src="' + _vimeoDataItem.thumbnail_medium + '"/>' + '</figure>'
        + '<ul class="meta clearfix">'
        + '<li><a class="detail" href=""><i class="fa fa-link"></i>' + '</a></li>'
        + '<li><i class="fa fa-eye"></i>' + _vimeoDataItem.stats_number_of_plays + '</li>'
        + '<li><i class="fa fa-thumbs-up"></i>' + _vimeoDataItem.stats_number_of_likes + '</li>'
        + '<li><i class="fa fa-comments"></i>' + _vimeoDataItem.stats_number_of_comments + '</li>'
        + '</ul>'
        + '</li>';//+ Verbinden van strings --> Concat
    });
    $('#vimeoitems').html(content);

    //Events
    $('#vimeoitems li a.detail').click(function(ev){
        ev.preventDefault();

        var id = $(this).parent().parent().parent().data('id');
        showDetails(id);

        return false;
    });
}

/*
 Function: Show Details of selected video
 =========================================================================
 Show Details
 */
function showDetails(id){
    $('#videoplayer').attr('src', 'http://player.vimeo.com/video/' + id);
    $('#videodetail').toggleClass('showview');
    $('#main').toggleClass('showview');
}

/*
Function: Nameless function
=========================================================================
Simulate document.ready but better
*/
(function(){
    /* Call function: loadEcoplan */
    loadVimeoGroup(209646, 1);

    /* Pages */
    $('#pages li a').each(function(key, element){
        $(this).on('click',function(ev){
            ev.preventDefault();

            loadVimeoGroup(209646, parseInt($(this).attr('href')));

            return false;
        });
    });

    $('.backtolist').on('click',function(ev){
        ev.preventDefault();

        $('#videodetail').toggleClass('showview');
        $('#main').toggleClass('showview');

        return false;
    });
})();