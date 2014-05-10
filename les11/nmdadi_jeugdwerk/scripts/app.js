/*
App: Jeugdwerk Locaties App
=========================================================================
Version: 0.1.0
Last updated: 11/12/2013
=========================================================================
*/


var _jeugdwerkData = null;//Variable - Global Scope

var URLDATAJEUGDWERKLOCATIES = 'http://datatank.gent.be/Doelgroepen/JeugdwerkLocaties.json?callback=?';

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
Function: Load Jeugdwerk Data
=========================================================================
Load Jeugdwerk data from datasets Stad Gent
*/
function loadJeugdwerk(){
    //Ansynchrone aanvraag tot data
    $.ajax({
        type:'GET',
        url:URLDATAJEUGDWERKLOCATIES.format(),
        dataType:'jsonp',
        contentType:'application/json',
        cache:false,
        success:function(data){
            _jeugdwerkData = data.JeugdwerkLocaties;
            //Parse and Vizu Data
            parseAndVizuJeugdwerkData();
        }
    });
}

/*
Function: Parse en Visualize Jeugdwerk Data
=========================================================================
Show all Jeugdwerk data
*/
function parseAndVizuJeugdwerkData(){
    $('#jeugdwerken').html('');//Clear all data in element
    
    var content = '';
    $.each(_jeugdwerkData, function(key, data){
       content += ''
        + '<li data-id="' + data.objectid + '" class="col col-sc1-12 jeugdwerk">'
        + '<a class="details" href="">'
        + '<h1>' + data.organisati + '</h1>'
        + '</a>'
        + '</li>';//+ Verbinden van strings --> Concat
    });
    $('#jeugdwerken').append(content);

    //Events
    $('#jeugdwerken li a.details').click(function(ev){
        ev.preventDefault();

        var id = $(this).parent().data('id');
        showDetails(id);

        return false;
    });
}

var _leafletMap,
    _geoPosition,
    _geoIcon,
    _jeugdwerkIcon,
    _jeugdwerkMarker,
    _osmLayer,
    _kmlLayer;

/*
 Function: Initialize Leaflet Map
 =========================================================================
 */
function initLeafletMaps(){
    // Create custom Icons
    _geoIcon = L.icon({
        iconUrl: 'content/images/iamhere.png',
        iconRetinaUrl: 'content/images/iamhere.png',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -37],
        shadowUrl: 'content/images/iamhere.png',
        shadowRetinaUrl: 'content/images/iamhere.png',
        shadowSize: [64, 37],
        shadowAnchor: [12, 37]
    });
    _jeugdwerkIcon = L.icon({
        iconUrl: 'content/images/scoutgroup.png',
        iconRetinaUrl: 'content/images/scoutgroup.png',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -37],
        shadowUrl: 'content/images/shadow.png',
        shadowRetinaUrl: 'content/images/shadow.png',
        shadowSize: [64, 37],
        shadowAnchor: [12, 42]
    });
    // create a map in the "map" div, set the view to a given place and zoom
    _leafletMap = L.map('map-canvas');
    _leafletMap.on('load', function(ev){
        //getGEOLocation();// Get the GEO Location
        L.Util.requestAnimFrame(_leafletMap.invalidateSize,_leafletMap,false,_leafletMap._container);
    });
    _leafletMap.setView([51.054398, 3.725224], 14)

// add an OpenStreetMap tile layer
    _osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(_leafletMap);

    // Add KML Layer
    _kmlLayer = new L.KML('http://datatank.gent.be/Grondgebied/Wijken.kml', {async: true});
    _leafletMap.addLayer(_kmlLayer);

    _leafletMap.invalidateSize(false);
}

/*
 Function: Show Details of selected jeugdwerk
 =========================================================================
 Show Details
 */
function showDetails(id){
    //Find object in array by id
    var jeugdwerk = _.find(_jeugdwerkData, function(obj){
       return obj.objectid == id;
    });
    if(jeugdwerk){
        var content = ''
        + '<h1>' + jeugdwerk.organisati + '</h1>'
        + '<p>' + jeugdwerk.straat + ' ' + jeugdwerk.huisnr + '</p>'
        + '<p>' + jeugdwerk.postcode + ' ' + jeugdwerk.gemeente + '</p>'
        $('#jeugdwerkdetail-text').html(content);

        if(_leafletMap !== null){
            _jeugdwerkMarker = L.marker([jeugdwerk.lat, jeugdwerk.long], {icon:_jeugdwerkIcon}).addTo(_leafletMap);

            /* Set center of leaflet map to my current position via GEO Location */
            _leafletMap.setView([jeugdwerk.lat, jeugdwerk.long], 14);

            L.Util.requestAnimFrame(_leafletMap.invalidateSize,_leafletMap,false,_leafletMap._container);
        }

        doYoutubeSearch(jeugdwerk.organisati);//Do YouTube Search

        $('html, body').animate({scrollTop:0},600);

        $('#jeugdwerkdetail').toggleClass('showview');
        $('#main').toggleClass('showview');
    }
}

var URLDATAYOUTUBESEARCH = 'https://www.googleapis.com/youtube/v3/search?part=snippet\
    &q={0}\
    &type=video\
    \&part=snippet\
    &key=AIzaSyCPdaqjJCnDMDV70BnYQ1uTRyh_dB-7vDE\
    &callback=?';

/*
 Function: Do YouTube Search
 =========================================================================
 Do A Youtube search with certain keywords
 */
function doYoutubeSearch(q){
    //Ansynchrone aanvraag tot data
    $.ajax({
        type:'GET',
        url:URLDATAYOUTUBESEARCH.format(q),
        dataType:'jsonp',
        contentType:'application/json',
        cache:false,
        success:function(data){
            parseAndVizuYoutubeSearch(data);
        }
    });
}

/*
 Function: Parse en Visualize Jeugdwerk Data
 =========================================================================
 Show all Jeugdwerk data
 */
function parseAndVizuYoutubeSearch(data){
    $('#jeugdwerkdetail-videos').html('');//Clear all data in element

    var content = '';
    if(data.items.length > 0){
        console.log(data.items);
        $.each(data.items, function(key, video){
            content += ''
                + '<li data-id="' + video.id.videoId + '" class="col col-sc1-12 col-sc2-12 col-sc3-6 col-sc4-4 col-sc5-3 jeugdwerk-video">'
                + '<a href="https://www.youtube.com/watch?v=' + video.id.videoId + '" title="' +  video.snippet.description + '">'
                + '<figure>' + '<img src="' + video.snippet.thumbnails.medium.url + '"/>' + '</figure>'
                + '</a>'
                + '</li>';//+ Verbinden van strings --> Concat
        });
    }else{
        content += 'Deze jeugdwerklokatie heeft voorlopig geen video\'s!';
    }
    $('#jeugdwerkdetail-videos').append(content);
}


/*
Function: Nameless function
=========================================================================
Simulate document.ready but better
*/
(function(){
    /* Call function: initLeafletMaps */
    initLeafletMaps();

    /* Call function: loadJeugdwerk */
    loadJeugdwerk();

    $('.backtolist').on('click',function(ev){
        ev.preventDefault();

        $('html, body').animate({scrollTop:0},600);

        $('#jeugdwerkdetail').toggleClass('showview');
        $('#main').toggleClass('showview');

        return false;
    });
})();