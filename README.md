## redux-shine

A library of Redux utilities to reduce (pun intended) the boilerplate/repetition, while still keeping containers/actions/reducers/selectors separate. It is meant to be used with React.

**This library is still only at a concept stage.**

This library is built on top of two other small libraries, which must be installed as peer dependencies:

- react-redux
- redux-actions


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
import { actionHandler } from 'redux-shine';

import { createTodo } from '../someActions';

const initState = {
  errMsg: null,
  latestTodo: null,
  latestUpdate: null,
  loading: false
};

export default actionHandler(initState, {
  [createTodo]: createTodoHandler,
});

/* Action Handlers */

function createTodoHandler ({ state, cargo, err, loading, meta }) {
  return {
    errMsg: err ? err.message : state.errMsg,
    latestTodo: cargo || state.latestTodo,
    latestUpdate: cargo ? meta.latestUpdate : state.latestUpdate,
    loading
  };
}
```

**someEntityReducer.js**
```js
import { actionHandler, replaceWith } from 'redux-shine';

import { createTodo } from '../someActions';

export default actionHandler({
  [createTodo]: asyncReducer(createTodoHandler)
}, {} /* optional, this is the default initState */);

/* Action Handlers */

function createTodoHandler ({ state, cargo, err, loading, meta }) {
  if (cargo) {
    return {
      [cargo.id]: cargo       // adds or replaces entity [cargo.id]
    };
  }

  // or

  let newState = { ...state };
  delete newState[cargo.id];
  return replaceWith(newState); // deletes entity [cargo.id] from our entity store

  // or

  return replaceWith({});       // replaces the whole entity store with the provided argument

  // or

  return;                       //  return nothing, or any falsy = no state change
}
```
