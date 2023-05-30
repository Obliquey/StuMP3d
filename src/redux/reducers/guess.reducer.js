const guess = (state={}, action) => {
    switch (action.type) {
        case 'SET_CORRECT_SONG':
            return action.payload;
        default: 
            return state;
    }
}

export default guess;