- object maps are easier to look through
- arrays are easier to manipulate multiple objects
- objects are easier for picking a single entity
- sometimes, you need to get the current state of the entity
- sometimes, the content of the entity does not matter
- arrays require more work to not duplicate entries


**1st Approach**

```js
// entity.delete
// entity.get
// entity.set
// entity.update

import { actionHandler, entities }  from 'redux-shine'

import {
  addTodo
  deleteTodo
  editTodo
  completeTodo
  completeAllTodos
  clearCompleted
} from '../actions'

const initialState = {
  '0': {
    id: 0,
    text: 'Use Redux',
    completed: false
  }
}

export default actionHandler({
  [addTodo]: ({ state, cargo }) => {
    let ids = Object.keys(state)
    let newId = Math.max(...ids) + 1

    return entities(state).set(newId, {
      id: newId,
      completed: false,
      text: cargo.text
    })
  },

  [deleteTodo]: ({ cargo: id, state }) => entities(state).delete(id),

  [editTodo]: ({ cargo, state }) => entities(state).update(cargo.id, { text: cargo.text }),

  [completeTodo]: ({ cargo, state }) =>  {
    const todo = entities(state).get(cargo.id)
    return entities(state).update(todo.id, { completed: !todo.completed })
  },

  [completeAllTodos]: ({ state }) => {
    const todos = entities(state).get()
    const areAllMarked = todos.every(todo => todo.completed)
    return entities(state).update(ids, { completed: !areAllMarked })
  },

  [clearCompleted]: ({ state }) => {
    const todos = entities(state).get()
    const completedIds = todos.filter(todo => todo.complete).map(todo => todo.id)
    return entities(state).delete(completedIds)
  }
}, initialState)
```

**2nd Approach**

```js
import { actionHandler }  from 'redux-shine'

import {
  addTodo
  deleteTodo
  editTodo
  completeTodo
  completeAllTodos
  clearCompleted
} from '../actions'

const initialState = [
  {
    text: 'Use Redux',
    completed: false,
    id: 0
  }
]

export default actionHandler.forEntities({ idField: 'id', name: 'todos' }, {
  [addTodo]: ({ todos, cargo }) => {
    let ids = todos.map(todo => todo.id)

    return {
      id: Math.max(...ids) + 1,
      text: cargo.text,
      complete: false
    }
  },

  [deleteTodo]: ({ todos, cargo: id }) => {
    let newState = todos.filter(todo => todo.id !== id)
    return newState   // returning an array means you want to replace the entity array
  },

  [editTodo]: ({ cargo }) => ({ id: cargo.id, text: cargo.text }),

  [completeTodo]: ({ todos, cargo }) => {
    const todo = todos.find(item => item.id === cargo.id)
    return { id: todo.id, completed: !todo.completed }
  },

  [completeAllTodos]: ({ todos }) => {
    const areAllMarked = todos.every(todo => todo.completed)
    return todos.map(todo => ({
      ...todo,
      completed: !areAllMarked
    }))
  }

  [clearCompleted]: ({ todos }) => {
    return todos.filter(todo => todo.completed === false)
  }
}, initialState)
```

**3rd Approach**

```js
import { entitiesReducer }  from 'redux-shine'

import {
  addTodo
  deleteTodo
  editTodo
  completeTodo
  completeAllTodos
  clearCompleted
} from '../actions'

const initialState = {
  0: {
    id: 0,
    text: 'Use Redux',
    completed: false
  }
}

export default entitiesReducer({ id: 'id', name: 'todos' }, {
  [addTodo]: ({ todos, msg }) => {
    let ids = todos.get().map(todo => todo.id)
    let newId = Math.max(...ids) + 1

    return todos.set(newId, {
      id: newId,
      completed: false,
      text: msg.text
    })
  },

  [deleteTodo]: ({ msg: id, todos }) => todos.delete(id),

  [editTodo]: ({ msg, todos }) => todos.update(msg.id, { text: msg.text }),

  [completeTodo]: ({ msg, todos }) =>  {
    const todo = todos.get(msg.id)
    return todos.update(todo.id, { completed: !todo.completed })
  },

  [completeAllTodos]: ({ todos }) => {
    const areAllMarked = todos.get().every(todo => todo.completed)
    return todos.update(ids, { completed: !areAllMarked })
  },

  [clearCompleted]: ({ todos }) => {
    const completedIds = todos.get().filter(todo => todo.complete).map(todo => todo.id)
    return todos.delete(completedIds)
  }
}, initialState)
```

**Reference Approach**

```js
export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.text
        }
      ]

    case DELETE_TODO:
      return state.filter(todo =>
        todo.id !== action.id
      )

    case EDIT_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          { ...todo, text: action.text } :
          todo
      )

    case COMPLETE_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          { ...todo, completed: !todo.completed } :
          todo
      )

    case COMPLETE_ALL_TODOS:
      const areAllMarked = state.every(todo => todo.completed)
      return state.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false)

    default:
      return state
  }
}
```



