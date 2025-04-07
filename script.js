var map = L.map('map').setView([0, 0], 13); // Default view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// User's location detection (Automatically sets starting point)
navigator.geolocation.getCurrentPosition(function(position) {
    var userLat = position.coords.latitude;
    var userLon = position.coords.longitude;
    L.marker([userLat, userLon]).addTo(map).bindPopup("You are here!").openPopup();
    map.setView([userLat, userLon], 13);
    
    // Store user's coordinates for navigation
    localStorage.setItem("userLat", userLat);
    localStorage.setItem("userLon", userLon);
});

function findRoute() {
    var userLat = localStorage.getItem("userLat");
    var userLon = localStorage.getItem("userLon");

    // Destination coordinates (Replace with dynamic input if needed)
    var destLat = 1.3141; // Example: Westlands, Nairobi
    var destLon = 36.7895;

    if (!userLat || !userLon) {
        alert("Location not detected! Please allow GPS access.");
        return;
    }

    // Fetch Route Data from OSRM API
    fetch(`https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${destLon},${destLat}?overview=full&geometries=geojson`)
    .then(response => response.json())
    .then(data => {
        var route = L.geoJSON(data.routes[0].geometry).addTo(map);
        map.fitBounds(route.getBounds());
    })
    .catch(error => console.error("Error fetching route:", error));

    // Fetch Real-Time Traffic Data (Example using TomTom API)
    fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${userLat},${userLon}&key=wsBRpACsyDEypH2czrAmwoW2QcBRBqja`)
    .then(response => response.json())
    .then(data => {
        console.log("Traffic Data:", data);
    })
    .catch(error => console.error("Error fetching traffic data:", error));
}