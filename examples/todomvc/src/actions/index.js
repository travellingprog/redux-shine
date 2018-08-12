import { directAction } from 'redux-shine';

export const addTodo = directAction('ADD_TODO')
export const deleteTodo = directAction('DELETE_TODO')
export const editTodo = directAction('EDIT_TODO')
export const completeTodo = directAction('COMPLETE_TODO')
export const completeAllTodos = directAction('COMPLETE_ALL_TODOS')
export const clearCompleted = directAction('CLEAR_COMPLETED')
export const setVisibilityFilter = directAction('SET_VISIBILITY_FILTER')

