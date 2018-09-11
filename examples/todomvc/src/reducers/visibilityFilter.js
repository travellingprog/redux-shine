import { simpleReducer } from 'redux-shine'

import { setVisibilityFilter } from '../actions'
import { SHOW_ALL } from '../constants/TodoFilters'

const initialState = { value: SHOW_ALL }

export default simpleReducer({
  [setVisibilityFilter]: { msg: value } => ({ value })
}, initialState)
