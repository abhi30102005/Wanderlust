// maptilersdk.config.apiKey = mapKey;
// const map = new maptilersdk.Map({
//     container: 'map', // container's id or the HTML element in which the SDK will render the map
//     style: maptilersdk.MapStyle.STREETS,
//     center: listing.geometry.coordinates, // starting position [lng, lat]
//     zoom: 9 // starting zoom
// });

// console.log(listing.geometry.coordinates);


// new maptilersdk.Marker()
//     .setLngLat(listing.geometry.coordinates)
//     .setPopup(new Popup({ offset: 25 })
//     .setHTML('Construction on the Washington Monument began in 1848.'))
//     .addTo(map);

maptilersdk.config.apiKey = mapKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates,   // [lng, lat]
    zoom: 9
});

console.log(listing.geometry.coordinates);

// Popup + Marker
const popup = new maptilersdk.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.title}</h4>
              <p>${listing.location}, ${listing.country}</p>`);

new maptilersdk.Marker()
    .setLngLat(listing.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);