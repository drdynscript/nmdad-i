var _ecoplanData = null, _ecoplanLabels = null;//Variable - Global Scope

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
        + '<li data-labels="' + ecoplanItem.LABEL + '" class="ecoplanitem">'
        + '<h1>' + ecoplanItem.NAAM + '</h1>'
        + '<p>'
        + '<span class="home"></span>' + ((ecoplanItem.STRAAT !== '')?(ecoplanItem.STRAAT + ' ' + ecoplanItem.NUMMER + ' - '):'') + ecoplanItem.POSTCODE + ' ' + ecoplanItem.GEMEENTE
        + '<br /><span class="tag"></span>' + ecoplanItem.LABEL
        + '</p>'
        + '</li>';//+ Verbinden van strings --> Concat
    });
    content += '</ul>';
    $('#ecoplanitems').append(content);

    /* Create Markers for Ecoplan items */
    $.each(_ecoplanData, function(key,ecoplanItem){
        addEcoplanItemOnLeafletMaps(ecoplanItem);
    });
}

/*
Function: Filter Ecoplan By Label
=========================================================================
*/
function filterEcoplan(label){

    var htmlEcoplanItems = $('#ecoplanitems ul li');
    $.each(htmlEcoplanItems, function(key,ecoplanItem){
        
        var labels = $(ecoplanItem).data('labels').split(',');
        var labelsTrimmed = [];
        
        $.each(labels, function(i, label){
            labelsTrimmed.push(label.replace(' ',''));
        });//DataSet from Ghent contains many spaces!
        
        if(labelsTrimmed.indexOf(label) !== -1){
            $(ecoplanItem).removeClass('hidden');
        }else{
            $(ecoplanItem).addClass('hidden');
        }
        
    });
}

var _leafletMap,
    _geoIcon,
    _ecoplanItemIcon,
    _ecoplanItemsMarkers;

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
        iconUrl: 'content/images/doctor.png',
        iconRetinaUrl: 'content/images/doctor.png',
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
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(_leafletMap);
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
    _geoMarker = L.marker([position.coords.latitude, position.coords.longitude], {icon:_geoIcon}).addTo(_leafletMap)
        .bindPopup('My Current Position');

    /* Set center of leaflet map to my current position via GEO Location */
    _leafletMap.setView([position.coords.latitude, position.coords.longitude], 14);
}

function geoError(error){
    console.log(error);
}

function geoFallback(){

}

/*
Function: Views
=========================================================================
List or Map
*/
function showView(link, type){
    console.log(link);
    switch(type){
        case 'List':default:
            $('#ecoplanitems').removeClass('hidden');
            $('#map-canvas').addClass('hidden');
            break;
        case 'Map':
            $('#ecoplanitems').addClass('hidden');
            $('#map-canvas').removeClass('hidden');
            break;
    }
}

/*
Function: Nameless function
=========================================================================
Simulate document.ready but better
*/
(function(){
    /* CAll function: initLeafletMaps */
    initLeafletMaps();
    /* Call function: loadEcoplan */
    loadEcoplan();
})();