import { combineReducers } from "redux";

const guess = (state={}, action) => {
    switch (action.type) {
        case 'SET_CORRECT_SONG':
            return action.payload;
        default: 
            return state;
    }
}

// this reducer will be for the user's history
const userHistory = (state=[], action) => {
  switch (action.type) {
    case 'SET_HISTORY':
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
    guess,
    userHistory
})