import React from 'react';
import { MapContainer, TileLayer, LayersControl, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const { BaseLayer, Overlay } = LayersControl;

const WeatherMap = ({ lat, lon, cityName }) => {
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Your API key

  // Ensure default values if lat and lon are not provided
  const center = [lat || 51.505, lon || -0.09];
  const zoom = 10;

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
      <LayersControl position="topright">
        {/* Base Layer */}
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </BaseLayer>

        {/* Weather Overlay Layers */}
        <Overlay checked name="Weather - Clouds">
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution='Weather data © <a href="https://openweathermap.org/">OpenWeatherMap</a>'
          />
        </Overlay>
        {/* Overlay layer for Temperature from OpenWeatherMap */}
        <Overlay name="Weather - Temperature">
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution='Weather data © <a href="https://openweathermap.org/">OpenWeatherMap</a>'
          />
        </Overlay>

        <Overlay name="Weather - Precipitation">
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution='Weather data © <a href="https://openweathermap.org/">OpenWeatherMap</a>'
          />
        </Overlay>
      </LayersControl>
      {lat && lon && (
        <Marker position={[lat, lon]} icon={L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          shadowSize: [41, 41],
        })}>
          <Popup>{cityName}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default WeatherMap;
