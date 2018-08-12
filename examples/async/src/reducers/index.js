import { combineReducers } from 'redux'
import { actionHandler } from 'redux-shine';
import { fetchPosts, invalidateSubreddit, selectSubreddit } from '../actions'

const defaultSubredditState = {
  didInvalidate: false,
  isFetching: false,
  items: [],
  lastUpdated: null
}

const postsBySubreddit = actionHandler({}, {
  [fetchPosts]: ({ state, cargo, loading, meta }) => {
    const subredditState = state[meta.subreddit] || { ...defaultSubredditState }

    return {
      [meta.subreddit]: {
        didInvalidate: false,
        isFetching: loading,
        items: cargo ? cargo.posts : subredditState.items,
        lastUpdated: cargo ? cargo.receivedAt : subredditState.lastUpdated;
      }
    }
  }),

  [invalidateSubreddit]: ({ state, cargo }) => {
    const subredditState = state[cargo.subreddit] || { ...defaultSubredditState }

    return {
      [cargo.subreddit]: {
        ...subredditState,
        didInvalidate: true
      }
    }
  }
})

const selectSubreddit = actionHandler({
  value: 'reactjs'
}, {
  [selectSubreddit]: ({ cargo }) => ({ value: cargo })
})

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit
})

export default rootReducer
