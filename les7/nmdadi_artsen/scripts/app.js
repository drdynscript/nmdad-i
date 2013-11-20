var _huisartsenData;//Variable - Global Scope

function loadHuisartsen(){
    //Ansynchrone aanvraag tot data
    $.ajax({
        type:"GET",
        url:"http://data.appsforghent.be/poi/huisartsen.json",
        dataType:"jsonp",
        contentType:"application/json",
        cache:false,
        success:function(data){
            _huisartsenData = data.huisartsen;
            //Parse and Vizu Data
            parseAndVizuHuisartsen();
        }
    });
}

/*
 adres: "Bloemstraat 1 / 001"
 distance: 0
 fid: "0"
 gemeente: "Gentbrugge"
 geslacht: "vrouw"
 id: "kml_1"
 idnr09: "0"
 lat: "51.0193880172327"
 long: "3.7640569885589"
 naam: "Kwembeke"
 postcode: "9050"
 praktijk: "Solo"
 voornaam: "Julie"
 __proto__: Object
 */

function parseAndVizuHuisartsen(){
    $('#artsen').html();//Clear all data in element
    var content = '';
    $.each(_huisartsenData, function(key,huisarts){
       content += ''
        + '<article data-fid="' + huisarts.fid + '" class="doctor">'
        + '<h1>' + huisarts.voornaam + ' ' + huisarts.naam + '</h1>'
        + '<ul class="info clearfix">'
        + '<li class="address">' + huisarts.adres + ', ' + huisarts.postcode + ' ' + huisarts.gemeente + '</li>'
        + '<li class="geo">' + huisarts.lat + ', ' + huisarts.long + '</li>'
        + '<li class="practice">' + huisarts.praktijk + '</li>'
        + '</ul>'
        + '</article>';//+ Verbinden van strings --> Concat
    });
    $('#artsen').append(content);

    /* Click on article -> do something */
    $('.doctor').click(function(ev){
        var fid = $(this).data('fid');
        var i = 0, l = _huisartsenData.length, match = false, doctor;
        while(!match && i < l){
            doctor = _huisartsenData[i];
            if(doctor.fid == fid)
                match = true;
            else
                i++;
        }
        _leafletMap.setView([doctor.lat, doctor.long], 18);
        $('html, body').animate({scrollTop:0},600);
    });

    /* Create Markers for doctors */
    $.each(_huisartsenData, function(key,huisarts){
        addDoctorOnLeafletMaps(huisarts);
    });
}

var _leafletMap,
    _geoIcon,
    _doctorIcon,
    _doctorMarkers;

/*
Function: Initialize Leaflet
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
    _doctorIcon = L.icon({
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
        /* Get the GEO Location */
        getGEOLocation();
    });
    _leafletMap.setView([51.054398, 3.725224], 14)

// add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(_leafletMap);
}


function addDoctorOnLeafletMaps(doctor){
    if(_leafletMap !== null){
        var marker = L.marker([doctor.lat, doctor.long],{icon:_doctorIcon}).addTo(_leafletMap)
            .bindPopup(doctor.voornaam + ' ' + doctor.naam);

        if(_doctorMarkers == null)
            _doctorMarkers = [];

        _doctorMarkers.push(marker);
    }
}

/* Function: Get GEO Location
 * From current position
 * */
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

(function(){
    /* CAll function: initLeafletMaps */
    initLeafletMaps();
    /* Call function: loadHuisartsen */
    loadHuisartsen();
})();