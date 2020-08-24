import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const Statistic = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}
const Statistics = ({stats}) => {
  const {good, neutral, bad } = stats
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good / total) * 100 + ' %'

  if (total === 0) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <table>
        <tbody>
          <Statistic text='good' value={good} />
          <Statistic text='neutral' value={neutral} />
          <Statistic text='bad' value={bad} />
          <Statistic text='all' value={total} />
          <Statistic text='average' value={average} />
          <Statistic text='positive' value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const stats = {
    good: good,
    neutral: neutral,
    bad: bad
  }

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={increaseGood} text='good'/>
      <Button handleClick={increaseNeutral} text='neutral'/>
      <Button handleClick={increaseBad} text='bad'/>
      <h1>statistics</h1>
      <Statistics stats={stats} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));

