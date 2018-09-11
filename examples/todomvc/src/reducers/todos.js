import { entitiesReducer }  from 'redux-shine'

import {
  addTodo
  deleteTodo
  editTodo
  completeTodo
  completeAllTodos
  clearCompleted
  setVisibilityFilter
} from '../actions'

// Our state is an entity map (id-to-entity)
const initialState = {
  '0': {
    id: 0,
    text: 'Use Redux',
    completed: false
  }
}

export default entitiesReducer({ id: 'id', name: 'todos' }, {
  [addTodo]: ({ todos, msg: text }) => {
    const allIds = todos.get().map(todo => todo.id)
    const id = allIds.length ? Math.max(...allIds) + 1 : 0;

    return todos.set(id, {
      id,
      completed: false,
      text
    }
  },

  [deleteTodo]: ({ todos, msg: id }) => {
    return todos.delete(id)
  }

  [editTodo]: ({ todos, msg }) => {
    return todos.update(msg.id, { text: msg.text })
  }

  [completeTodo]: ({ todos, msg: id }) => {
    const todo = todos.get(id)
    return todos.update(id, { completed: !todo.completed })
  }

  [completeAllTodos]: ({ todos }) => {
    const allTodos = todos.get()
    const areAllMarked = todos.every(todo => todo.completed)
    return todos.update(allTodos, { completed, !areAllMarked })
  }

  [clearCompleted]: ({ todos }) => {
    const completedTodos = todos.get().filter(todo => todo.completed)
    return todos.delete(completedTodos)
  }
}, initialState)

