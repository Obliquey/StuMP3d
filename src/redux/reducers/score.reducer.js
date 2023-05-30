const userScore = (state={}, action) => {
    switch (action.type) {
      case 'SET_SCORE':
        return {...state, score: action.payload.score, streak: action.payload.streak};
      default:
        return state;
    }
  }

  export default userScore;