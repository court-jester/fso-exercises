import React, { useState, useEffect } from 'react'
import Finder from './components/Finder'
import Countries from './components/Countries'
import CountryDetail from './components/CountryDetail'
import axios from 'axios'

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ finder, setFinder ] = useState('')
  const [ country, setCountry ] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFinder = (event) => {
    setFinder(event.target.value)
  }

  const handleShow = (country) => {
    setCountry(country)
  }

  // Start showing countries only after user input
  const countriesToShow = finder.length === 0
  ? false
  : countries.filter(country => country.name.toLowerCase().includes(finder.toLowerCase()))

  // CountryDetail for clicked countries to show
  return (
    <div>
      <Finder onChange={handleFinder} />
      <Countries countries={countriesToShow} handleShow={handleShow} />
      <CountryDetail country={country} />
    </div>
  )
}

export default App;
