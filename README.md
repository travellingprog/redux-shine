# redux-shine

A library of Redux utilities to reduce (pun intended) the boilerplate/repetition, while still keeping containers/actions/reducers/selectors separate. It is meant to be used with React.

**This library is still only at a concept stage.**

This library is built on top of two other small libraries, which must be installed as peer dependencies:

- react-redux
- redux-actions

## Exports

redux-shine exports the following properties:

**Component Helpers**
- pick
- simpleConnect

**Action Helpers**
- asyncAction
- directAction
- LOADING

**Reducer Helpers**
- entitiesReducer
- simpleReducer


## Examples

```js
/* Component.js */

import { pick, simpleConnect } from 'redux-shine';

import * as someSelectors from '../../selectors/someSelectors';
import * as someActions from '../../actions/someActions';
import * as otherActions from '../../actions/otherActions';

const selectors = pick(someSelectors, ['activeModal', 'errors', 'hours', 'progress']);

const actions = {
  ...pick(someActions, ['createTodo']),
  ...pick(otherActions, ['logout'])
};

const Component = (props) => (
  <button onClick={props.createTodo(props.hours))}
);

export default simpleConnect(selectors, actions)(Component);
```


```js
/* someActions.js */

import { asyncAction, directAction, LOADING } from 'redux-shine';

export const knockDoor = directAction('KNOCK_DOOR');

export const createTodo = asyncAction(
  'CREATE_TODO',
  async (text, dueDate, { broadcast, dispatch, getState }) => {
    try {
      broadcast(LOADING);
      const todo = await someAPICall({ text, dueDate });
      broadcast(todo);
    } catch (err) {
      broadcast(err);
    }
  }
);
```

**someReducer.js**
```js
import { simpleReducer } from 'redux-shine';

import { createTodo } from '../someActions';

const initState = {
  errMsg: null,
  latestTodo: null,
  latestUpdate: null,
  loading: false
};

export default simpleReducer({
  [createTodo]: createTodoHandler,
}, initState);

/* Action Handlers */

function createTodoHandler ({ state, msg, err, loading, meta }) {
  return {
    errMsg: err ? err.message : state.errMsg,
    latestTodo: msg || state.latestTodo,
    latestUpdate: msg ? meta.latestUpdate : state.latestUpdate,
    loading
  };
}
```

**someEntityReducer.js**
```js
import { entitiesReducer } from 'redux-shine';

import { createTodo } from '../someActions';

export default entitiesReducer({ name: 'todos', id: 'id' }, {
  [createTodo]: asyncReducer(createTodoHandler)
}, {} /* optional, this is the default initState */);

/* Action Handlers */

function createTodoHandler ({ state, msg, err, loading, meta, todos }) {
  if (msg) {
    return todos.set(msg.id, msg); // adds or sets the entity [msg.id] in our entity store
  }

  // or

  return todos.delete(msg.id) // deletes entity [msg.id] from our entity store

  // or

  const todo = todos.get(msg.id)  // get the entity [msg.id]
  return todos.update(todo.id, { completed: !todo.completed }) // update an entity partially

  // or

  const allTodos = todos.get()   // retrieve all entities, as an array
  const completedTodoIds = allTodos.filter(todo => todo.completed).map(todo => todo.id)
  return todos.delete(completedTodoIds)  // delete multiple entities by providing an arra of ids

  // or

  return;                       //  return nothing, or any falsy = no state change
}
```
