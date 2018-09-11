import todos from './todos'
import * as actions from '../actions'

describe('todos reducer', () => {
  it('should handle initial state', () => {
    expect(
      todos(undefined, {})
    ).toEqual({
      '0': {
        id: 0,
        text: 'Use Redux',
        completed: false
      }
    })
  })

  it('should handle ADD_TODO', () => {
    expect(
      todos([], {
        type: actions.addTodo,
        payload: 'Run the tests'
      })
    ).toEqual({
      '0': {
        text: 'Run the tests',
        completed: false,
        id: 0
      }
    })

    expect(
      todos({
        '0': {
          id: 0,
          text: 'Use Redux',
          completed: false
        }
      }, {
        type: actions.addTodo,
        payload: 'Run the tests'
      })
    ).toEqual({
      '0': {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      '1': {
        text: 'Run the tests',
        completed: false,
        id: 1
      }
    })

    expect(
      todos({
        '0': {
          text: 'Use Redux',
          completed: false,
          id: 0
        },
        '1': {
          text: 'Run the tests',
          completed: false,
          id: 1
        }
      }, {
        type: actions.addTodo,
        payload: 'Fix the tests'
      })
    ).toEqual({
      '0': {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      '1': {
        text: 'Run the tests',
        completed: false,
        id: 1
      },
      '2': {
        text: 'Fix the tests',
        completed: false,
        id: 2
      }
    })
  })

  it('should handle DELETE_TODO', () => {
    expect(
      todos({
        '0': {
          text: 'Use Redux',
          completed: false,
          id: 0
        },
        '1': {
          text: 'Run the tests',
          completed: false,
          id: 1
        }
      }, {
        type: actions.deleteTodo,
        payload: 1
      })
    ).toEqual({
      '0': {
        text: 'Run the tests',
        completed: false,
        id: 0
      }
    })
  })

  it('should handle EDIT_TODO', () => {
    expect(
      todos({
        '0': {
          text: 'Use Redux',
          completed: false,
          id: 0
        },
        '1': {
          text: 'Run the tests',
          completed: false,
          id: 1
        }
      }, {
        type: actions.editTodo,
        payload: {
          text: 'Fix the tests',
          id: 1
        }
      })
    ).toEqual({
      '0': {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      '1': {
        text: 'Fix the tests',
        completed: false,
        id: 1
      }
    })
  })

  it('should handle COMPLETE_TODO', () => {
    expect(
      todos({
        '0': {
          text: 'Use Redux',
          completed: false,
          id: 0
        },
        '1': {
          text: 'Run the tests',
          completed: false,
          id: 1
        }
      }, {
        type: actions.completeTodo,
        payload: 1
      })
    ).toEqual({
      '0': {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      '1': {
        text: 'Run the tests',
        completed: true,
        id: 1
      }
    })
  })

  it('should handle COMPLETE_ALL_TODOS', () => {
    expect(
      todos({
        '0': {
          text: 'Use Redux',
          completed: true,
          id: 0
        },
        '1': {
          text: 'Run the tests',
          completed: false,
          id: 1
        }
      }, {
        type: actions.completeAllTodos
      })
    ).toEqual({
      '0': {
        text: 'Use Redux',
        completed: true,
        id: 0
      },
      '1': {
        text: 'Run the tests',
        completed: true,
        id: 1
      }
    })

    // Unmark if all todos are currently completed
    expect(
      todos({
        '0': {
          text: 'Use Redux',
          completed: true,
          id: 0
        },
        '1': {
          text: 'Run the tests',
          completed: true,
          id: 1
        }
      }, {
        type: actions.completeAllTodos
      })
    ).toEqual({
      '0': {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      '1': {
        text: 'Run the tests',
        completed: false,
        id: 1
      }
    })
  })

  it('should handle CLEAR_COMPLETED', () => {
    expect(
      todos({
        '0': {
          text: 'Use Redux',
          completed: true,
          id: 0
        },
        '1': {
          text: 'Run the tests',
          completed: false,
          id: 1
        }
      }, {
        type: actions.clearCompleted
      })
    ).toEqual({
      '1': {
        text: 'Run the tests',
        completed: false,
        id: 1
      }
    })
  })

  it('should not generate duplicate ids after CLEAR_COMPLETED', () => {
    expect(
      [
        {
          type: actions.completeTodo,
          payload: 0
        }, {
          type: actions.clearCompleted
        }, {
          type: actions.addTodo,
          payload: 'Write more tests'
        }
      ].reduce(todos, {
        '0': {
          text: 'Use Redux',
          completed: false,
          id: 0
        },
        '1': {
          text: 'Write tests',
          completed: false,
          id: 1
        }
      })
    ).toEqual({
      '1': {
        text: 'Write tests',
        completed: false,
        id: 1
      },
      '2': {
        text: 'Write more tests',
        completed: false,
        id: 2
      }
    })
  })
})
