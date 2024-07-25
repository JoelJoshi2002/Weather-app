const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Ensure this line is included
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors()); // Add this line to enable CORS
app.use(express.json());

// Endpoint to get city coordinates
app.get('/geo', async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const { coord } = response.data;
    res.json([{ lat: coord.lat, lon: coord.lon }]);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Endpoint to get current weather
app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Endpoint to get weather forecast
app.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
