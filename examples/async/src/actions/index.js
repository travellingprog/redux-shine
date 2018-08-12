import { asyncAction, directAction, LOADING } from 'redux-shine'

export const invalidateSubreddit = directAction('INVALIDATE_SUBREDDIT')
export const selectSubreddit = directAction('SELECT_SUBREDDIT')

export const fetchPosts = asyncAction(
  'FETCH_POSTS',
  async (subreddit, { broadcast }) => {
    const meta = { subreddit }

    try {
      broadcast(LOADING, meta)

      const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`)
      const json = await response.json()

      broadcast({
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
      }, meta))
    } catch (err) {
      broadcast(err, meta)
    }
  }
)

const shouldFetchPosts = (state, subreddit) => {
  // TODO create a selector
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = subreddit => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchPostsRequest(subreddit))
  }
}
