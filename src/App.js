import React, { useState, useEffect, useReducer, createContext, useContext } from 'react';
import uuid from 'uuid/v4';

// create context, voorlopig leeg
const TodoContext = createContext(null)

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
  
  const [filter, dispatchFilter] = useReducer(filterReducer, 'ALL')

  const [todos, dispatchTodos] = useReducer( 
    todoReducer, JSON.parse(localStorage.getItem('myTodosInLocalStorage'))
    )

   // use local storage to store my todo's
   useEffect(() => {
    localStorage.setItem('myTodosInLocalStorage', JSON.stringify(todos))
  }, [todos]
  )  
  
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
 
  return (
    <TodoContext.Provider value={dispatchTodos}>
      <Filter dispatch={dispatchFilter} />
      {/* with context you don't need to pass them as props*/}
      <TodoList todos={filteredTodos} />
      <AddTodo />
    </TodoContext.Provider>
  );
}

// Filter component with its buttons and handlers
// krijgt dispatchFilter mee via de props onder de naam {dispatch}
const Filter = ({dispatch}) => {
  const handleShowAll = () => {
    // gebruik hier de props, nl. dispatch ipv dispatchFilter()
    dispatch({ type: 'SHOW_ALL' })
  }
  const handleShowComplete = () => {
    dispatch({ type: 'SHOW_COMPLETE' })    
  }
  const handleShowIncomplete = () => {
    dispatch({ type: 'SHOW_INCOMPLETE' })     
  }

  return(
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
  )
}

// const TodoList en const TodoItem
// krijgt filteredTodos mee via de props onder de naam en {todos}
// TodoItem krijgt dispatchTodos mee via useContext, dus uit de props halen en niet doorgeven!
const TodoList = ({ todos }) => {
  return(
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

// TodoItem component
// krijgt dispatchTodos mee via useContext, dus uit de props halen
const TodoItem = ({ todo }) => {
  const dispatch = useContext(TodoContext)
  const handleChange = () =>
    dispatch({
      type: todo.complete ? 'UNDO_TODO' : 'DO_TODO',
      id: todo.id
    });
    return (
      <li>
        <label>
          <input
            type="checkbox"
            checked={todo.complete}               
            onChange={handleChange}
          />
          {todo.task}
        </label>
      </li>
    )
}

// AddTodo component
// krijgt dispatchTodos mee via useContext, dus uit de props halen
// en heeft zijn eigen local state voor het inputveld
const AddTodo = () => {
  const dispatch = useContext(TodoContext);

  const [task, setTask] = useState('');

  const handleSubmit = event => {
    if (task) {
      dispatch({
        type: 'ADD_TODO',
        task,
        id: uuid()
      })
    }
    setTask('');
    event.preventDefault();
  };
  
  const handleChange = event => {
    setTask(event.target.value)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        value={task}
        onChange={handleChange}
      />
      <button type="submit">Add Todo</button>
    </form>
  )
}  

export default App;
