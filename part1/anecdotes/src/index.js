import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// import './index.css';

const App = (props) => {
  const [selected, setSelected] = useState(0)

  // Array's length as quotes and filled with zeros
  const arr = new Array(anecdotes.length).fill(0)

  /** Another option to create a zeros' filled array created from length
  const arr = new Uint8Array(anecdotes.length) */

  const [points, setPoints] = useState(arr)
  const maxPoints = Math.max(...points)
  const bestQuoteIndex = [...points].indexOf(maxPoints)

  const getRandomQuote = () => {
    // Random between zero and total quotes
    const randomNumber = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomNumber)
  }

  const handleVote = () => {
    const copy = [...points]
    copy[selected]++
    setPoints(copy)
  }


  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <button onClick={handleVote}>
        vote
      </button>
      <button onClick={getRandomQuote}>
        random quote
      </button>
      <h1>Anecdote with most votes</h1>
      <p>{props.anecdotes[bestQuoteIndex]}</p>
      <p>has {maxPoints} votes</p>
    </div>

  )
}
const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
);
