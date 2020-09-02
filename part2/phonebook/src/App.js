import React, { useState, useEffect } from 'react';
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

function App() {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personExists = persons.some(person => person.name === newName)

    if (personExists) {
      alert(`${newName} is already added to the phonebook`)
    } else {
      // Change id initialization, because of potential key/id conflict after deletions and additions at rendering Person component
      const personsId = persons.map(person => person.id)
      const max = Math.max(...personsId)
      const personObject = {
        id: max + 1,
        name: newName,
        number: newNumber
      }
      // Register the person in the server
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

    // NB: the person object could be passed as parameter through Person's props instead of just the id
  const removePerson = id => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
        personService
          .remove(id)
          .then(() => { // axios.delete does not return any data
            setPersons(persons.filter(person => person.id !== id))
          })
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  // Filter persons by name (case insensitive)
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))


  return (
    <div>
      <h2>Phonebook</h2>
       <Filter onChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm onSubmit={addPerson} name={newName} number={newNumber} onChangeName={handleNameChange} onChangeNumber={handleNumberChange} />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App;
