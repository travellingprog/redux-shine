import React, { Component } from 'react'
import { pick, simpleConnect } from 'redux-shine'
import * as allActions from '../actions'
import * as selectors from '../selectors'
import Picker from '../components/Picker'
import Posts from '../components/Posts'

const selections = pick(selectors, ['isFetching', 'lastUpdated', 'posts', 'selectedSubreddit'])
const actions = pick(allActions, ['fetchPostsIfNeeded', 'invalidateSubreddit', 'selectSubreddit'])

class App extends Component {
  componentDidMount() {
    const { fetchPostsIfNeeded, selectedSubreddit } = this.props
    fetchPostsIfNeeded(selectedSubreddit)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { fetchPostsIfNeeded, selectedSubreddit } = this.props
      fetchPostsIfNeeded(selectedSubreddit)
    }
  }

  handleChange = nextSubreddit => {
    this.props.selectSubreddit(nextSubreddit)
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { fetchPostsIfNeeded, invalidateSubreddit, selectedSubreddit } = this.props
    invalidateSubreddit(selectedSubreddit)
    fetchPostsIfNeeded(selectedSubreddit)
  }

  render() {
    const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props
    const isEmpty = posts.length === 0
    return (
      <div>
        <Picker value={selectedSubreddit}
                onChange={this.handleChange}
                options={[ 'reactjs', 'frontend' ]}/>
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <button onClick={this.handleRefreshClick}>
              Refresh
            </button>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts posts={posts} />
            </div>
        }
      </div>
    )
  }
}

export default simpleConnect(selections, actions)(App)
