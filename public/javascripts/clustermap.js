const myMap = L.map('cluster-map').setView([22.9074872, 79.07306671], 4);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Coded by Arpita with ❤️';
const tileLayer = L.tileLayer(tileUrl, { attribution });
tileLayer.addTo(myMap);

fetch('/campgrounds', {
    headers: {
        'Accept': 'application/json'  // This will ensure the server returns JSON
    }
})
    .then(response => response.json())  // Parse JSON response
    .then(campgrounds => {
        campgrounds.forEach(campground => {
            const coord = campground.geometry.coordinates;  // Access coordinates for each campground
            const marker = L.marker([coord[1], coord[0]])  // Add marker to map
                .addTo(myMap)
                .bindPopup(
                    `<h3>${campground.title}</h3><p>${campground.location}</p>`
                );
        });
    })
    .catch(error => console.error('Error fetching campgrounds:', error));  // Handle errors

//const marker = L.marker([28.704060,77.102493]).addTo(myMap);