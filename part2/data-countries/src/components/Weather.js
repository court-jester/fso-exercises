import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [ weather, setWeather ] = useState([])
  const API_KEY = process.env.REACT_APP_API_KEY
  const weatherUrl = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${capital}`

  const hook = () => {
    axios
      .get(weatherUrl)
      .then(response => {
        setWeather([response.data.current])
      })
  }
  useEffect(hook, [])

  if (weather.length !== 0) {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <div><strong>tempeture:</strong> {weather[0].temperature} Celsius</div>
        <img
          src={weather[0].weather_icons}
          alt={`${capital}'s current weather icon`}
          height='50'
          width='50'
        />
        <div><strong>wind:</strong> {weather[0].wind_speed} km/h direction {weather[0].wind_dir}</div>
      </div>
    )
  }
  
  return null

}

export default Weather


