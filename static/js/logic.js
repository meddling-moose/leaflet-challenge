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
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
                        <p>Time: ${Date(feature.properties.time)}</p>
                        <p>Magnitude: ${feature.properties.mag}</p>`);//convert this time into a readable timestamp
    }

    let earthquakes = L.geoJSON(eqData, {
        onEachFeature: onEachFeatureFunction,
        'pointToLayer': function(geoJsonPoint, latlng){ 
            var circleMarker=L.circle(latlng, {
                'radius': geoJsonPoint['properties']['mag']*5000,
                'fillColor': depthColor(geoJsonPoint['geometry']['coordinates'][2]),
                'color': '#000000',
                'opacity': 1,
                'fillOpacity': 1,
                'weight': 0.5
            });
            return circleMarker
        }
    });

    function depthColor(depth) {
        if (depth > 90) {
            return '#ff0000'; // red
        } else if (depth > 70) {
            return '#ff6e00'; // dark orange
        } else if (depth > 50) {
            return '#ffbd31'; // light orange
        } else if (depth > 30) {
            return '#fff200'; // yellow
        } else if (depth > 10) {
            return '#32cd32'; // lime green
        } else {
            return '#3cb043'; // green
        }
    }

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

    let legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        magnitudes = ['-10 - 10', '10 - 30', '30 - 50', '50 - 70', '70 - 90', '> 90'];
        magColors = ['#3cb043', '#32cd32', '#fff200', '#ffbd31', '#ff6e00', '#ff0000'];
        
        for (let i = 0; i < magnitudes.length; i++) {
            div.innerHTML += `<i style='background: ${magColors[i]}'></i> ${magnitudes[i]}<br>`;
        };

        return div;
    };

    legend.addTo(myMap)
}
