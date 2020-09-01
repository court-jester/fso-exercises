import React from 'react'
import CountryDetail from './CountryDetail'

const Countries = ({ countries, handleShow }) => {
  
  if (!countries)
    return null

  if (countries.length === 1)
    return <CountryDetail country={countries[0]} />

  if (countries.length > 10)
    return <div>Too many matches, specify another filter</div>

  return (
    countries.map(country => {
      return (
        <div key={country.name}>
          {country.name} 
          <button onClick={() => handleShow(country)}>
            show
          </button>
        </div>
      )
    })
  )
}
export default Countries

