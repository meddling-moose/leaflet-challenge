//Retrieve data from GeoJSON URL
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

d3.json(queryUrl).then(function (data) {
    //when the promise is fulfilled then we do something with it
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    //think about how I want to create each feature
};
