import './App.css';
import axios from 'axios';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import WeatherMap from './Map/WeatherMap'; // Ensure path is correct
import 'leaflet/dist/leaflet.css';

function App() {
  const [weatherData, setWeatherData] = useState(null); // Store current weather data
  const [hourlyData, setHourlyData] = useState([]); // Store hourly forecast data
  const [dailyData, setDailyData] = useState({}); // Store daily forecast data
  const [city, setCity] = useState(''); // Store the city name entered by the user
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Store error messages
  const [unitType] = useState('metric'); // Store unit type ('metric' or 'imperial')
  const [selectedDay, setSelectedDay] = useState(''); // Store selected day for daily forecast
  const [searchMade, setSearchMade] = useState(false); // Track if search has been made
  const [coords, setCoords] = useState({ lat: null, lon: null }); // Store latitude and longitude


  const unitTypeSymbol = {
    'imperial': '°F',
    'metric': '°C',
    '': 'K',
  };

  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const getWeatherData = async () => {
    try {
      setError(null);
      setWeatherData(null);
      setHourlyData([]);
      setDailyData({});
      setSearchMade(true);
      setLoading(true);

      // Get longitude and latitude based on city that user inputs
      const geoResp = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`);
      if (geoResp.data.length === 0) {
        throw new Error('City not found');
      }
      const lat = geoResp.data[0].lat;
      const lon = geoResp.data[0].lon;
      setCoords({ lat, lon });

      // Make 5-day forecast API call using axios
      const weatherResp = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unitType}`);
      const data = weatherResp.data;

      // Get current weather data
      const currentWeather = data.list[0];
      setWeatherData(currentWeather);

      // Process hourly and daily forecast data
      const hourlyForecast = data.list.slice(1, 4);
      setHourlyData(hourlyForecast);

      const dailyForecast = data.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000);
        const day = date.toISOString().split('T')[0];
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
      }, {});
      setDailyData(dailyForecast);

    } catch (e) {
      setError(e.message);
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

  const getDaysOfWeek = () => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        label: date.toLocaleDateString('en-US', { weekday: 'long' }),
        value: date.toISOString().split('T')[0],
      };
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
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

            {weatherData && (
              <>
                <Col xs={12} className="mt-3">
                  <Card className="giant-card p-4 shadow border-0 mt-3 rounded">
                    <div className="d-flex justify-content-between">
                      <div>{formatDate(weatherData.dt)}</div>
                      <div>Current: {weatherData.main.temp} {unitTypeSymbol[unitType]}</div>
                    </div>
                    <div className="d-flex justify-content-center">
                      <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="weather icon" />
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>{weatherData.weather[0].main}</div>
                      <div>Feels like {weatherData.main.feels_like} {unitTypeSymbol[unitType]}</div>
                    </div>
                  </Card>
                </Col>
                {/*Weather map*/}
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
                        <div>Current: {data.main.temp} {unitTypeSymbol[unitType]}</div>
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

            {searchMade && (
              <div className="mt-5">
                <h3>Select a Day for Forecast</h3>
                <select className="form-select" onChange={handleDayChange} value={selectedDay}>
                  <option value="">Select a day</option>
                  {Object.keys(dailyData).map((day, index) => (
                    <option key={index} value={day}>
                      {new Date(day).toLocaleDateString('en-US', { weekday: 'long' })}
                    </option>
                  ))}
                </select>

                {selectedDay && (
                  dailyData[selectedDay] && dailyData[selectedDay].length > 0 ? (
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
                  ) : (
                    <Card className="text-center mt-3 p-3 shadow border-0 rounded">
                      <Card.Body>No Information Yet</Card.Body> {/* Error card for date selection */}
                    </Card>
                  )
                )}
              </div>
            )}
          </Row>
        </Container>
      )}
    </div>
  );
}

export default App;
