/*
App: Ecoplan App
=========================================================================
Version: 0.1.0
Last updated: 11/12/2013
=========================================================================
*/


var _ecoplanData = null, _ecoplanLabels = null, _activeView;//Variable - Global Scope

var URLDATAECOPLAN = 'http://datatank.gent.be/MilieuEnNatuur/Ecoplan.json?callback=?';

/*
Function: Load Ecoplan Data
=========================================================================
Load Ecoplan data from Stad Gent Service
*/
function loadEcoplan(){
    //Ansynchrone aanvraag tot data
    $.ajax({
        type:'GET',
        url:URLDATAECOPLAN,
        dataType:'jsonp',
        contentType:'application/json',
        cache:false,
        success:function(data){
            _ecoplanData = data.Ecoplan;
            //Extract labels from Data and Vizu
            extractAndVizuEcoplanLabels();
            //Parse and Vizu Data
            parseAndVizuEcoplan();
        }
    });
}

/*
Function: Parse en Visualize Ecoplan Data
=========================================================================
Extract the unique labels
Show all ecoplan data
Filter with label or search
*/
function extractAndVizuEcoplanLabels(){
    if(_ecoplanLabels === null){
        _ecoplanLabels = [];
    }
    
    var labelsArray;
    
    $.each(_ecoplanData, function(i,ecoplanItem){
        //var t = ecoplanItem.LABEL.replace(/\s/g,'');
        labelsArray = ecoplanItem.LABEL.split(',');
        $.each(labelsArray, function(j,label){
            label = label.replace(' ','');
            if(label !== '' && _ecoplanLabels.indexOf(label) === -1){
                _ecoplanLabels.push(label);
            }
        });
    });
    
    $('#ecoplanlabels').html();//Clear all data in element
    
    var content = '';
    content += '<ul class="clearfix">';
    content += '<li data-label="all">Alles</li>';
    $.each(_ecoplanLabels, function(i,ecoplanLabel){
        content += '<li data-label="' + ecoplanLabel + '">'
        + ecoplanLabel
        + '</li>';
    });
    content += '</ul>';
    
    $('#ecoplanlabels').append(content);
    
    $('#ecoplanlabels ul li').click(function(ev){
        ev.preventDefault();
        
        var label = $(this).data('label');
        filterEcoplan(label);
        
        return false;
    });
}

/*
Function: Parse en Visualize Ecoplan Data
=========================================================================
Extract the unique labels
Show all ecoplan data
Filter with label or search
*/
function parseAndVizuEcoplan(){
    $('#ecoplanitems').html();//Clear all data in element
    
    var content = '';
    content += '<ul>';
    $.each(_ecoplanData, function(key,ecoplanItem){
       content += ''
        + '<li data-lat="' + ecoplanItem.LAT + '" data-lng="' + ecoplanItem.LONG + '" data-labels="' + ecoplanItem.LABEL + '" class="ecoplanitem">'
        + '<h1>' + ecoplanItem.NAAM + '</h1>'
        + '<p>'
        + '<span class="home"></span>' + ((ecoplanItem.STRAAT !== '')?(ecoplanItem.STRAAT + ' ' + ecoplanItem.NUMMER + ' - '):'') + ecoplanItem.POSTCODE + ' ' + ecoplanItem.GEMEENTE
        + '<br /><span class="tag"></span>' + ecoplanItem.LABEL
        + '</p>'
        + '<span class="badge distance">' + calculateDistance(ecoplanItem.LAT, ecoplanItem.LONG, _geoPosition.coords.latitude, _geoPosition.coords.longitude).toFixed(3) + ' km</span>'
        + '</li>';//+ Verbinden van strings --> Concat
    });
    content += '</ul>';
    $('#ecoplanitems').append(content);

    /* Create Markers for Ecoplan items */
    $.each(_ecoplanData, function(key,ecoplanItem){
        addEcoplanItemOnLeafletMaps(ecoplanItem);
    });

    var amount = $('#ecoplanitems ul li').length;
    $('#ecoplanfiteredamount').html('<span class="badge">' + amount + '</span> resultaten');
}

/*
Function: Filter Ecoplan By Label
=========================================================================
*/
function filterEcoplan(label){



    var htmlEcoplanItems = $('#ecoplanitems ul li');
    $.each(htmlEcoplanItems, function(key,ecoplanItem){

        if(label !== 'all'){
            var labels = $(ecoplanItem).data('labels').split(',');
            var labelsTrimmed = [];

            $.each(labels, function(i, label){
                labelsTrimmed.push(label.replace(' ',''));
            });//DataSet from Ghent contains many spaces!

            if(labelsTrimmed.indexOf(label) !== -1){
                $(ecoplanItem).removeClass('hidden');
                _ecoplanItemsMarkers[key].setOpacity(1);
            }else{
                $(ecoplanItem).addClass('hidden');
                _ecoplanItemsMarkers[key].setOpacity(0);
            }
        }else{
            $(ecoplanItem).removeClass('hidden');
            _ecoplanItemsMarkers[key].setOpacity(1);
        }
    });
    var amount = ($('#ecoplanitems ul li').length - $('#ecoplanitems ul li.hidden').length);
    $('#ecoplanfiteredamount').html('<span class="badge">' + amount + '</span> resultaten');

    if(_leafletMap !== null){
        L.Util.requestAnimFrame(_leafletMap.invalidateSize,_leafletMap,false,_leafletMap._container);
    }
}

/*
 Function: Get Amount For a certain Label
 =========================================================================
 */
function getAmountForLabel(label){
    var amount = 0;

    var htmlEcoplanItems = $('#ecoplanitems ul li');
    $.each(htmlEcoplanItems, function(key,ecoplanItem){
        if($(ecoplanItem).data('labels').indexOf(label) !== -1){
            amount++;
        }
    });//Simple search for a label within an html attribute

    return amount;
}



var _leafletMap,
    _geoPosition,
    _geoIcon,
    _ecoplanItemIcon,
    _ecoplanItemsMarkers,
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
        shadowUrl: 'content/images/shadow.png',
        shadowRetinaUrl: 'content/images/shadow.png',
        shadowSize: [64, 37],
        shadowAnchor: [12, 37]
    });
    _ecoplanItemIcon = L.icon({
        iconUrl: 'content/images/eco.png',
        iconRetinaUrl: 'content/images/eco.png',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, - 37],
        shadowUrl: 'content/images/shadow.png',
        shadowRetinaUrl: 'content/images/shadow.png',
        shadowSize: [64, 37],
        shadowAnchor: [12, 42]
    });
    // create a map in the "map" div, set the view to a given place and zoom
    _leafletMap = L.map('map-canvas');
    _leafletMap.on('load', function(ev){        
        getGEOLocation();// Get the GEO Location
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
Function: Add a certain Ecoplan Item as a marker on the leaflet map
=========================================================================
*/
function addEcoplanItemOnLeafletMaps(ecoplanItem){
    if(_leafletMap !== null){
        var marker = L.marker([ecoplanItem.LAT, ecoplanItem.LONG],{icon:_ecoplanItemIcon}).addTo(_leafletMap)
            .bindPopup(ecoplanItem.NAAM + '<p>' + ecoplanItem.LABEL + '</p>');

        if(_ecoplanItemsMarkers == null)
            _ecoplanItemsMarkers = [];

        _ecoplanItemsMarkers.push(marker);
    }
}

/*
Function: Get the GEO location from the user aka visitor
=========================================================================
Simulate document.ready but better
*/
function getGEOLocation(){
    if(Modernizr.geolocation)
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {timeout:10000,enableHighAccuracy:true});
    else
        geoFallback();
}

function geoSuccess(position){
    _geoPosition = position;

    _geoMarker = L.marker([position.coords.latitude, position.coords.longitude], {icon:_geoIcon}).addTo(_leafletMap)
        .bindPopup('My Current Position');

    /* Set center of leaflet map to my current position via GEO Location */
    _leafletMap.setView([position.coords.latitude, position.coords.longitude], 14);
}

function geoError(error){
    switch(error){
        //Timeout
        case 3:
            getGEOLocation();
            break;
        //POSITION UNAVAILABLE
        case 2:
            getGEOLocation();
            break;
        //PERMISSION DENIED --> FALLBACK
        case 1:
            geoFallback();
            break;
        default:
            getGEOLocation();
            break;
    }
}

function geoFallback(){

}

/*
 Function: Get the distance between two points
 =========================================================================
 Calculate the distance between two coordinates on earth
 */
function calculateDistance(lat1, lng1, lat2, lng2){
    var R = 6371; // km
    var dLat = (lat2-lat1);
    var dLng = (lng2-lng1);

    var a = Math.sin((dLat/2)*Math.PI/180) * Math.sin((dLat/2)*Math.PI/180) +
        Math.sin((dLng/2)*Math.PI/180) * Math.sin((dLng/2)*Math.PI/180) * Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

/*
Function: Views
=========================================================================
List or Map
*/
function showView(link, type){
    if(_activeView !== null){
        $(_activeView).removeClass('active');
    }
    switch(type){
        case 'List':default:
            $('#ecoplanitems').removeClass('hidden');
            $('#map-canvas').addClass('hidden');
            break;
        case 'Map':
            $('#ecoplanitems').addClass('hidden');
            $('#map-canvas').removeClass('hidden');
            if(_leafletMap !== null){
                L.Util.requestAnimFrame(_leafletMap.invalidateSize,_leafletMap,false,_leafletMap._container);
            }
            break;
        case 'Chart':
            $('#ecoplanitems').addClass('hidden');
            $('#map-canvas').addClass('hidden');
            break;
    }
    _activeView = link;
    $(_activeView).addClass('active');
}

/*
Function: Nameless function
=========================================================================
Simulate document.ready but better
*/
(function(){
    /* Set Active View */
    _activeView = $('#btn-views .active');
    /* CAll function: initLeafletMaps */
    initLeafletMaps();
    /* Call function: loadEcoplan */
    loadEcoplan();
})();