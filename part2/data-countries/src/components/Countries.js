import React from 'react'

const Countries = ({ countries }) => {
  if (!countries)
    return null

  if (countries.length === 1)
    return (
      <div>
        <h1>{countries[0].name}</h1>
        <div>capital {countries[0].capital}</div>
        <div>population {countries[0].population}</div>
        
        <h2>languages</h2>
          <ul>
            {countries[0].languages.map(language =>
              <li key={language.name}>{language.name}</li>
            )}
          </ul>
        <img
          src={countries[0].flag} 
          alt={`${countries[0].name}'s flag`} 
          height='150'
          width='150'
        />
      </div>
    )

  if (countries.length > 10)
    return <div>Too many matches, specify another filter</div>


  return (
    countries.map(country =>
      <div key={country.name}>{country.name}</div>
    )
  )
}

export default Countries

