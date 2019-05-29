import React, { useState, useEffect, useReducer } from 'react';
import uuid from 'uuid/v4';

// initial todo's
const initialTodos = [
  {
    id: uuid(),
    task: 'Learn React',
    complete: true,
  },
  {
    id: uuid(),
    task: 'Learn GraphQL',
    complete: false,
  },
  {
    id: uuid(),
    task: 'Learn HTML-CSS',
    complete: true,
  }
];

// A reducer function always receives the current state and an action as arguments. 
// Depending on the mandatory type of the action, 
// it decides what task to perform in the switch case statement, 
// and returns a new state based on the implementation details.

// filterReducer om alleen die todo's te laten zien die we willen zien (allemaal, alleen al gedaan, alleen nog te doen)
const filterReducer = (state, action) => {
  switch (action.type) {
    // in case of action type  SHOW_ALL, return string 'ALL' as state
    case 'SHOW_ALL':
      return 'ALL';
    // in case of action type  SHOW_COMPLETE, return string 'COMPLETE' as state
    case 'SHOW_COMPLETE':
      return 'COMPLETE';
    // in case of action type  SHOW_INCOMPLETE, return string 'INCOMPLETE' as state    
    case 'SHOW_INCOMPLETE':
      return 'INCOMPLETE';
    default:
      throw new Error()
  }
}

// function App() {}
// of
// const App = () => {}

function App() {
  // use the reducer function in a useReducer hook. 
  // It takes the reducer function (filterReducer) and an initial state ('ALL') as params 
  // and returns the filter state and the dispatch function to change it [filter, dispatchFilter].
  const [filter, dispatchFilter] = useReducer(filterReducer, 'ALL')

  // get the todo's from local storage
  // const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('myTodosInLocalStorage')) );
  const [todos, setTodos] = useState(initialTodos);
  const [task, setTask] = useState('');

  // use local storage to store my todo's
  // useEffect(() => {
  //   localStorage.setItem('myTodosInLocalStorage', JSON.stringify(todos))
  // }, [todos]
  // )

  const handleShowAll = () => {
    dispatchFilter({ type: 'SHOW_ALL' })
  }
  const handleShowComplete = () => {
    dispatchFilter({ type: 'SHOW_COMPLETE' })    
  }
  const handleShowIncomplete = () => {
    dispatchFilter({ type: 'SHOW_INCOMPLETE' })    
    
  }
  
  // use the filter state to show only the matching todo's
  const filteredTodos = todos.filter(todo => {
    if (filter === 'ALL') {
      return true;
    }
    if (filter === 'COMPLETE' && todo.complete) {
      return true;
    }
    if (filter === 'INCOMPLETE' && !todo.complete) {
      return true;
    }
    return false;
  })
 

  // we need the id of the todo item, we get it from the input onChange
  const handleChangeCheckbox = id => {
    // we change the complet flag of this todo item and return the others as before
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, complete: !todo.complete }
        } else {
          return todo
        }
      })
    )
  }

  const handleChangeInput = event => {
    setTask(event.target.value)
  };

  const handleSubmit = event => {
    if (task) {
      // add new todo item
      // 'shorthand property name' is used to allocate (toewijzen) the task property in the object 
      setTodos(todos.concat({ id: uuid(), task, complete: false }))
    }
    // empty inputfield
    setTask('');
    event.preventDefault();
  }

  return (
    <div>
      <div>
        <button type="button" onClick={handleShowAll}>
          Show All
        </button>
        <button type="button" onClick={handleShowComplete}>
          Show Complete
        </button>
        <button type="button" onClick={handleShowIncomplete}>
          Show Incomplete
        </button>
      </div>
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.complete}
                // we need the id so we use a wrapping arrow function to pass it to the handler
                onChange={() => handleChangeCheckbox(todo.id)} 
              />
              {todo.task}
            </label>
          </li>
        ))}
      </ul>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={task}
          onChange={handleChangeInput}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default App;