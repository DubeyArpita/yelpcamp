//const campground = <%- JSON.stringify(campground) %>;

if (!campground || !campground.geometry || !campground.geometry.coordinates) {
    console.error("Campground data is not available:", campground);
} else {
    const coord = [campground.geometry.coordinates[1], campground.geometry.coordinates[0]];

    // Initialize the map
    const showMap = L.map('map').setView(coord, 16);

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileLayer = L.tileLayer(tileUrl, { attribution });
    tileLayer.addTo(showMap);

    const marker = L.marker(coord).addTo(showMap)
        .bindPopup(`<h3>${campground.title}</h3><p>${campground.location}</p>`);
}
