# Weather Forecast Application

## Overview

The Weather Forecast Application is a React-based web app that displays current weather conditions, hourly forecasts, and daily forecasts for a given city. It integrates with the OpenWeatherMap API to fetch weather data and presents it on a user-friendly interface. The application also includes a weather map feature using Leaflet to visually represent weather conditions.
Feature:
Live Weather
Weather map,Temprature map, cloud map
Weather Throughout the week

## File Structure

/project-root
│
├── /client
│ ├── /public
│ ├── /src
│ │ ├── /components
│ │ ├── /Map
│ │ ├── App.js
│ │ ├── index.js
│ │ └── ...
│ ├── .env
│ └── package.json
│
├── /server
│ ├── /node_modules
│ ├── .env
│ ├── server.js
│ ├── package.json
│ └── ...
│
└── README.md


## Installation

### Client-Side

1. **Navigate to the client directory:**

   cd client

2. **Install Dependencies**

    npm install

3. **Create a .env file in the client directory with the following content**

    REACT_APP_OPENWEATHER_API_KEY=your_openweathermap_api_key

4. **Start the client application**

   npm start
   This will run the React development server and open the application in your browser.

### Server-Side

1. **Navigate to the server directory::**

   cd server


2. **Install Dependencies**

    npm install

3. **Create a .env file in the server directory with the following content**

    OPENWEATHER_API_KEY=your_openweathermap_api_key


4. **Start the server application**

   npm start
   
   This will start the Express server on port 5000 (or another port specified by the PORT environment variable).

## Building Instructions

### Client-Side

To build the React application for production:

cd client
npm run build

This will create a build directory with the optimized production build. You can serve this build with a static server or integrate it with the server-side application.

### Server-Side

The server-side code does not require a build step. It can be run directly using Node.js.


## Functionality

- **City Search:** Enter the name of a city to get current weather conditions, hourly forecasts, and daily forecasts.
- **Current Weather:** Displays temperature, weather condition, and feels like temperature.
- **Hourly Forecast:** Shows weather details for the next few hours.
- **Daily Forecast:** Provides weather information for each day of the week.
- **Weather Map:** Visualizes weather conditions on a map with layers for clouds, temperature, and precipitation.

## Dependencies

### Client-Side
- **axios:** For making HTTP requests.
- **bootstrap:** For styling.
- **leaflet:** For map functionalities.
- **react-bootstrap:** For Bootstrap components.
- **react-leaflet:** For integrating Leaflet with React.
- **react-select:** For searchable dropdowns.

### Server-Side
- **express:** For handling HTTP requests.
- **axios:** For making HTTP requests.
- **dotenv:** For loading environment variables.
- **cors:** For enabling cross-origin requests.

## API Key Integration

Ensure you have obtained an API key from OpenWeatherMap. Replace `your_openweathermap_api_key` in the `.env` files for both the client and server with your actual API key.

