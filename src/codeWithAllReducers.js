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

// todoReducer to manage the todo items
const todoReducer = (state, action) => {
  switch (action.type) {
    // If an action of this kind passes the reducer, 
    // the action comes with an additional payload, the todo item’s id, 
    // to identify the todo item that should be changed to complete status.
    case 'DO_TODO':
      return state.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, complete: true }
        } else {
          return todo
        }
      });
    case 'UNDO_TODO':
      return state.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, complete: false }
        } else {
          return todo
        }
      });
    // If an action of this kind passes the reducer, 
    // the action comes with an additional payload, the new todo item’s task, 
    // to concat the new todo item to the current todo items in the state. 
    case 'ADD_TODO':
      return state.concat({
        task: action.task,
        id: action.id,
        complete: false
      });
    default:
      throw new Error();      
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
  // const [todos, setTodos] = useState(initialTodos);
  const [task, setTask] = useState('');

 

  // Instead of the useState hook with setTodos from before, 
  // we can manage our todos with this new reducer and the initially given todo items
  const [todos, dispatchTodos] = useReducer( 
    todoReducer, JSON.parse(localStorage.getItem('myTodosInLocalStorage'))
    )

   // use local storage to store my todo's
   useEffect(() => {
    localStorage.setItem('myTodosInLocalStorage', JSON.stringify(todos))
  }, [todos]
  )  

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
 

  // // we need the id of the todo item, we get it from the input onChange
  // const handleChangeCheckbox = id => {
  //   // we change the complete flag of this todo item and return the others as before
  //   setTodos(
  //     todos.map(todo => {
  //       if (todo.id === id) {
  //         return { ...todo, complete: !todo.complete }
  //       } else {
  //         return todo
  //       }
  //     })
  //   )
  // }

  // we need the todo item as a param, we get it from the input onChange 
  const handleChangeCheckbox = todo => {
    dispatchTodos({
      type: todo.complete ? 'UNDO_TODO' : 'DO_TODO',
      id: todo.id
    })
  }  

  const handleChangeInput = event => {
    setTask(event.target.value)
  };

  // const handleSubmit = event => {
  //   if (task) {
  //     // add new todo item
  //     // 'shorthand property name' is used to allocate (toewijzen) the task property in the object 
  //     setTodos(todos.concat({ id: uuid(), task, complete: false }))
  //   }
  //   // empty inputfield
  //   setTask('');
  //   event.preventDefault();
  // }

  // If someone submits a new todo item with the button, 
  // this handler is used but to dispatch an action 
  // with the correct action type and the name of the todo item (task) 
  // and its identifier (id) as payload
  const handleSubmit = event => {
    if (task) {
      dispatchTodos({
        type: 'ADD_TODO',
        task,
        id: uuid()
      })
    }
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
                // onChange={() => handleChangeCheckbox(todo.id)} 
                // with dispatch we have to pass the todo
                onChange={() => handleChangeCheckbox(todo)}
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
