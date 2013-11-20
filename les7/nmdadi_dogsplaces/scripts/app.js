function loadHondenToiletten(){
    //Ansynchrone aanvraag tot data
    $.ajax({
        type:"GET",
        url:"http://data.appsforghent.be/poi/hondentoiletten.json",
        dataType:"jsonp",
        contentType:"application/json",
        cache:false,
        success:function(data){
            console.log(data);
            //Parse and Vizu Data
            parseAndVizuHondenToiletten(data);
        }
    });
}

var _hondenToiletten;
function parseAndVizuHondenToiletten(data){
    /* Store hondentoiletten in variable */
    _hondenToiletten = data.hondentoiletten;
    /* NAV: main navigation and filtering */
    $('#hondentoiletten-nav').html();//Clear all data in element
    var navContent = ''
    + '<ul class="clearfix">'
    + '<li class="hondentoiletten-amount">' + _hondenToiletten.length + '</li>'
    + '</ul>';
    $('#hondentoiletten-nav').html(navContent);
    /* LIST: hondentoiletten */
    $('#dogsplaces').html();//Clear all data in element
    var content = '';
    $.each(_hondenToiletten, function(key,hondentoilet){
       content += ''
            + '<article data-fid="' + hondentoilet.fid + '" data-code="' + hondentoilet.code + '" class="hondentoilet">'
            + '<h1>' + hondentoilet.plaats + '</h1>'
            + '<ul class="info clearfix">'
            + '<li class="district">' + hondentoilet.wijk_ronde + '</li>'
            + '<li class="lat">' + parseFloat(hondentoilet.lat).toFixed(8) + '</li>'
            + '<li class="lng">' + parseFloat(hondentoilet.long).toFixed(8) + '</li>'
            + '<li class="type">' + hondentoilet.soort + '</li>'
            + '<li class="year">' + hondentoilet.jaar + '</li>'
            + '</ul>'
            + '</article>';
    });
    $('#dogsplaces').append(content);

    /* ADD Click EventListeners to each article aka hondentoilet */
    $('.hondentoilet').click(function(ev){
        ev.preventDefault();
        var fid = $(this).data('fid');
        var i = 0, l = _hondenToiletten.length, match = false, hondenToilet;
        while(!match && i < l){
            hondenToilet = _hondenToiletten[i];
            if(hondenToilet.fid == fid)
                match = true;
            else
                i++;
        }
        if(_leafletMap != null){
            _leafletMap.setView([hondenToilet.lat, hondenToilet.long], 18);
            $('html, body').animate({scrollTop:0},600);
            return false;
        }
    });

    /* Create HondenToiletten on Leaflet Maps */
    $.each(_hondenToiletten, function(key, hondenToilet){
        addHondenToiletToLeafletMaps(hondenToilet);
    });

}

var _leafletMap, _hondenToiletMarkers, _geoIcon, _hondenToiletIcon;
function initLeafletMaps(){
    /* Create Custom Icons for Markers */
    _geoIcon = L.icon({
        iconUrl: 'content/images/home.png',
        iconRetinaUrl: 'content/images/home.png',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -37],
        shadowUrl: 'content/images/homeshadow.fw.png',
        shadowRetinaUrl: 'content/images/homeshadow.fw.png',
        shadowSize: [64, 37],
        shadowAnchor: [12, 37]
    });
    /* Create Custom Icons for Markers */
    _hondenToiletIcon = L.icon({
        iconUrl: 'content/images/dog.png',
        iconRetinaUrl: 'content/images/dog.png',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -37],
        shadowUrl: 'content/images/homeshadow.fw.png',
        shadowRetinaUrl: 'content/images/homeshadow.fw.png',
        shadowSize: [64, 37],
        shadowAnchor: [12, 37]
    });
    _leafletMap = L.map('map-canvas');
    _leafletMap.on('load', function(ev){
        /* Get the GEO Location */
        getGEOLocation();
    });
    _leafletMap.setView([51.053319, 3.730274], 14);
    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(_leafletMap);
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

function addHondenToiletToLeafletMaps(hondenToilet){
    if(_leafletMap != null){
        var marker = L.marker([hondenToilet.lat, hondenToilet.long],{icon:_hondenToiletIcon}).addTo(_leafletMap)
            .bindPopup(hondenToilet.plaats);

        if(_hondenToiletMarkers == null)
            _hondenToiletMarkers = [];

        _hondenToiletMarkers.push(marker);
    }
}

(function(){
    /* INIT Leaflet Maps */
    initLeafletMaps();
    /* Load Dogs PLaces */
    loadHondenToiletten();
})();