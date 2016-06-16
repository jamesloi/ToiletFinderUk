var overPassApi = "https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:60];node({slat},{slng},{nlat},{nlng})[amenity~toilets];out;";

var mymap = L.map('mapid').setView([51.507448,-0.127776], 16);

var toiletIcon = L.icon({
                      iconUrl: 'js/images/toiletmarkerred.png',
                      iconSize: [32, 37],
                      iconAnchor: [16, 37],
                      popupAnchor: [0, -28]
                  });

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    id: 'mapbox.streets'
}).addTo(mymap);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
}).addTo(mymap);

mymap.on('click', function (e) {
    var bounds = mymap.getBounds();
    var boundsArray = bounds.toBBoxString();
    var bbox = boundsArray.split(',');
    var api = overPassApi.replace('{slat}',bbox[1]).replace('{slng}',bbox[0]).replace('{nlat}',bbox[3]).replace('{nlng}',bbox[2]);
    console.log(api);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", api, false );
    xmlHttp.send( null );
    console.log(xmlHttp.responseText);
    var jsonResult = xmlHttp.responseText;
  L.geoJson(jsonResult, {
      pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: toiletIcon});
      },
      onEachFeature: onEachFeature
  }).addTo(mymap);
});

//Android.getLastLocation();

function getLocation(longitude, latitude)
{
    mymap.panTo(new L.LatLng(latitude, longitude));
    L.marker([latitude, longitude]).addTo(mymap).bindPopup("<b>You are here!</b>").openPopup();
    mymap.setView([latitude,longitude], 16);
}

function onEachFeature(feature, layer) {
    var popupContent = "<h2>Toilet</h2>";
    if (feature.properties) {
        for (var key in feature.properties) {
          if (feature.properties.hasOwnProperty(key) && key !== "@id") {
            popupContent += "<p><strong>" + key + ":</strong> " + feature.properties[key] + "</p>";
          }
        }
    }
    layer.bindPopup(popupContent);
}