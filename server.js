const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9000;

app.use(express.json());

// Route to fetch nearby hospitals
app.get("/nearby-hospitals", async (req, res) => {
  try {
    // Get latitude and longitude from query parameters
    const { lat, lon, radius } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    // Default radius to 5000 meters (5 km) if not provided
    const searchRadius = radius || 5000;

    // Overpass API Query
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=hospital](around:${searchRadius},${lat},${lon});out;`;

    // Fetch data from Overpass API
    const response = await axios.get(overpassUrl);

    // Extract relevant hospital data
    const hospitals = response.data.elements.map((hospital) => ({
      name: hospital.tags.name || "Unknown Hospital",
      latitude: hospital.lat,
      longitude: hospital.lon,
      address: hospital.tags["addr:full"] || "Address not available",
    }));

    res.json({ hospitals });
  } catch (error) {
    console.error("Error fetching hospitals:", error.message);
    res.status(500).json({ error: "Failed to fetch hospital data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






















