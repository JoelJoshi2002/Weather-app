import './App.css';
import axios from 'axios';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import WeatherMap from './Map/WeatherMap';
import 'leaflet/dist/leaflet.css';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState({});
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unitType] = useState('metric');
  const [selectedDay, setSelectedDay] = useState('');
  const [searchMade, setSearchMade] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lon: null });

  const unitTypeSymbol = {
    'imperial': '°F',
    'metric': '°C',
    '': 'K',
  };

  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const getWeatherData = async () => {
    try {
      setError(null);
      setCurrentWeather(null);
      setHourlyData([]);
      setDailyData({});
      setSearchMade(true);
      setLoading(true);
  
      const geoResp = await axios.get(`/geo?city=${encodeURIComponent(city)}`);
      if (geoResp.data.length === 0) {
        throw new Error('City not found');
      }
      const lat = geoResp.data[0].lat;
      const lon = geoResp.data[0].lon;
      setCoords({ lat, lon });
  
      const currentWeatherResp = await axios.get(`/weather?lat=${lat}&lon=${lon}`);
      setCurrentWeather(currentWeatherResp.data);
  
      const weatherResp = await axios.get(`/forecast?lat=${lat}&lon=${lon}`);
      const data = weatherResp.data;
  
      const hourlyForecast = data.list.slice(1, 4);
      setHourlyData(hourlyForecast);
  
      const dailyForecast = data.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
      }, {});
      setDailyData(dailyForecast);
  
    } catch (e) {
      console.error('Error fetching weather data:', e.response ? e.response.data : e.message);
      setError(e.response ? e.response.data.message : e.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  return (
    <div className="app-container">
      {loading ? (
        <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Container>
          <Row className="d-flex">
            <div className="text-center mt-5">
              <h1 className="mb-4">Weather Forecast App</h1>
              <input value={city} onChange={handleInputChange} />
              <Button className="ms-2" onClick={getWeatherData} variant="primary" disabled={loading}>
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Submit'}
              </Button>
              {error && <div className="text-danger mt-3">Can't find city: {error}</div>}
              {!error && city && <h3 className="mt-3">Weather in {city}</h3>}
            </div>

            {currentWeather && (
              <>
                <Col xs={12} className="mt-3">
                  <Card className="giant-card p-4 shadow border-0 mt-3 rounded">
                    <div className="d-flex justify-content-between">
                      <div>{new Date(currentWeather.dt * 1000).toLocaleString()}</div>
                      <div>Current: {currentWeather.main.temp} {unitTypeSymbol[unitType]}</div>
                    </div>
                    <div className="d-flex justify-content-center">
                      <img src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`} alt="weather icon" />
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>{currentWeather.weather[0].main}</div>
                      <div>Feels like {currentWeather.main.feels_like} {unitTypeSymbol[unitType]}</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} className="mt-3">
                  <WeatherMap lat={coords.lat} lon={coords.lon} cityName={city} />
                </Col>
              </>
            )}

            {hourlyData.length > 0 && (
              <Row className="mt-3">
                {hourlyData.map((data, index) => (
                  <Col sm={4} className="mt-3" key={index}>
                    <Card className="custom-card p-3 shadow border-0 mt-3 rounded">
                      <div className="d-flex justify-content-between">
                        <div>{new Date(data.dt * 1000).toLocaleTimeString()}</div>
                        <div>Temp: {data.main.temp} {unitTypeSymbol[unitType]}</div>
                      </div>
                      <div className="d-flex justify-content-center">
                        <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="weather icon" />
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>{data.weather[0].main}</div>
                        <div>Feels like {data.main.feels_like} {unitTypeSymbol[unitType]}</div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {Object.keys(dailyData).length > 0 && (
              <Col xs={12} className="mt-3">
                <h3>Weather of the Week</h3>
                <select value={selectedDay} onChange={handleDayChange}>
                  <option value="">Select a day</option>
                  {Object.keys(dailyData).map((day, index) => (
                    <option value={day} key={index}>{day}</option>
                  ))}
                </select>
              </Col>
            )}

            {selectedDay && dailyData[selectedDay] && (
              <Row className="mt-3">
                {dailyData[selectedDay].map((data, index) => (
                  <Col sm={4} className="mt-3" key={index}>
                    <Card className="custom-card p-3 shadow border-0 mt-3 rounded">
                      <div className="d-flex justify-content-between">
                        <div>{new Date(data.dt * 1000).toLocaleTimeString()}</div>
                        <div>Temp: {data.main.temp} {unitTypeSymbol[unitType]}</div>
                      </div>
                      <div className="d-flex justify-content-center">
                        <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="weather icon" />
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>{data.weather[0].main}</div>
                        <div>Feels like {data.main.feels_like} {unitTypeSymbol[unitType]}</div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Row>
        </Container>
      )}
    </div>
  );
}

export default App;
