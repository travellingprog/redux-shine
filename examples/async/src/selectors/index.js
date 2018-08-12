import { createSelector } from 'reselect'

const postsBySubreddit = state => state.postsBySubreddit

export const selectedSubreddit = state => state.selectedSubreddit.value

const subredditData = createSelector(
  [selectedSubreddit, postsBySubreddit]
  (subredditName, postsBySubreddit) =>
    postsBySubreddit[subredditName] || { isFetching: true, items: [] }
)

export const isFetching = createSelector(
  subredditData,
  data => data.isFetching
)

export const lastUpdated = createSelector(
  subredditData,
  data => data.lastUpdated
)

export const posts = createSelector(
  subredditData,
  data => data.items
)
