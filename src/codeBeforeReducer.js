import React, { useState, useEffect } from 'react';
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

// function App() {}
// of
// const App = () => {}

function App() {

  // get the todo's from local storage
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('myTodosInLocalStorage')) );
  const [task, setTask] = useState('');

  // use local storage to store my todo's
  useEffect(() => {
    localStorage.setItem('myTodosInLocalStorage', JSON.stringify(todos))
  }, [todos]
  )
  // console.log(todos)
  // console.log(JSON.stringify(todos))

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
      <ul>
        {todos.map(todo => (
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