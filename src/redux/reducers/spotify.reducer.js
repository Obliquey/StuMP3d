import { combineReducers } from 'redux';

// contains the name and preview link to all the songs from the album we randomly chose
const previews = (state=[], action) => {
    switch (action.type) {
        case 'PLACE_SONGS':
            return action.payload;
        case 'EMPTY_PREVIEWS':
            return action.payload;
        default:
            return state;
    }
}

// contains all the info about the album we took the songs from
const albumInfo = (state=[], action) => {
    switch (action.type) {
        case 'PLACE_ALBUM_DATA':
            return action.payload;
        case 'EMPTY_ALBUM':
            return action.payload;
        default:
            return state;
    }
}

// is a boolean value saying if we got the songs or not. For use in the front end 
const songsArrived = (state='false', action) => {
    switch (action.type) {
        case 'SET_SONGS_ARRIVED':
            return action.payload;
        case 'CLEAR_SONGS_ARRIVED':
            return action.payload;
        default:
            return state;
    }
}

export default combineReducers({
    previews,
    albumInfo,
    songsArrived
});