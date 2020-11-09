import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import {
  setNotification,
  unsetNotification,
} from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </li>
  );
};
const AnecdoteList = () => {
  // Descending order
  const anecdotes = useSelector(({ anecdotes }) =>
    anecdotes.sort((a, b) => b.votes - a.votes)
  );
  const dispatch = useDispatch();

  const anecdoteStyle = {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  };

  const vote = (anecdote) => {
    const { id, content } = anecdote;

    dispatch(voteAnecdote(id));
    dispatch(setNotification(`You voted ${content}`));

    setTimeout(() => {
      dispatch(unsetNotification());
    }, 5000);
  };

  return (
    <ul style={anecdoteStyle}>
      {anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      ))}
    </ul>
  );
};

export default AnecdoteList;
