//Retrieve data from GeoJSON URL
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

d3.json(queryUrl).then(function (data) {
    //when the promise is fulfilled then we do something with it
    createFeatures(data.features);
});

function createFeatures(eqData) {
    //think about how I want to create each feature
    function onEachFeatureFunction(feature, layer) {
        //code to be executed per feature
        //Pop up to show the information of each earthquake
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${feature.properties.time}</p>`);//convert this time into a readable timestamp
    }

    let earthquakes = L.geoJSON(eqData, {
        onEachFeature: onEachFeatureFunction
    });

    let earthquakes = L.geoJSON(earthquakeData, {
        'pointToLayer': function(geoJsonPoint, latlng){ 
            var circleMarker=L.circle(latlng, {
                'radius': geoJsonPoint['properties']['mag']*100000 // maybe features.geometry.coordinates[2]?
            });
            return circleMarker
        }
    });

    createMap(earthquakes);
}

function createMap(eqs) {
    //layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topography =  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    //create base maps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topography
    };

    let overlayMaps = {

        Earthquakes: eqs
    };

    //create map itself
    let myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, eqs]
    });

    //create layer control
    L.control.layers(baseMaps, overlayMaps, {
        colapsed: false
    }).addTo(myMap);
}
