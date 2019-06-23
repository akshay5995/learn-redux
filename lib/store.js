// 1st Principle: Store - Single source of truth
// It's is a singleton
const _ = require("lodash");

// Global store
let store;

// The next principle is that the state of the store can only change in
// one way: through the dispatching of actions

// Reducer takes action and state to return a new state.
const createStore = () => {
  const currentState = {};

  // Action dictates the new state to be returned
  let currentReducerSet = {};

  // A state tree is a set of key-associated pure reducer functions.
  // Ability to add new reducers, Something that represents the state tree
  const addReducers = reducers => {
    currentReducerSet = Object.assign(currentReducerSet, reducers);

    currentReducer = (state, action) => {
      let cumulativeState = {};

      for (key in reducers) {
        cumulativeState[key] = currentReducerSet[key](state[key], action);
      }
      return cumulativeState;
    };
  };

  // List of subscribers to the state
  const subscribers = [];

  const subscribe = fn => {
    subscribers.push(fn);
  };

  function unsubscribe(fn) {
    subscribers.splice(subscribers.indexOf(fn), 1);
  }

  // Dispatcher receives an action
  const dispatch = action => {
    const prevState = currentState;

    // Pass changed copy of the current state
    currentState = currentReducer(_.cloneDeep(currentState), action);

    // Call subscribers with currentState and prevSate
    subscribers.forEach(subscriber => {
      subscriber(currentState, prevState);
    });
  };

  const getState = () => {
    return _.cloneDeep(currentState);
  };

  return {
    dispatch,
    subscribe,
    unsubscribe,
    getState
  };
};

const getInstance = () => {
  if (!store) store = createStore();
  return store;
};

module.exports = getInstance();
