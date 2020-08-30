import React, { useState, useEffect } from 'react'
import Finder from './components/Finder'
import Countries from './components/Countries'
import axios from 'axios'

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ finder, setFinder ] = useState('')

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

  // Start showing countries only after user input
  const countriesToShow = finder.length === 0
  ? false
  : countries.filter(country => country.name.toLowerCase().includes(finder.toLowerCase()))

  return (
    <div>
      <Finder onChange={handleFinder} />
      <Countries countries={countriesToShow} />
    </div>
  )
}

export default App;
