import { combineReducers } from 'redux';

const previews = (state=[], action) => {
    switch (action.type) {
        case 'PLACE_SONGS':
            return action.payload;
        default:
            return state;
    }
}

const albumInfo = (state=[], action) => {
    switch (action.type) {
        case 'PLACE_ALBUM_DATA':
            return action.payload;
        default:
            return state;
    }
}

const songsArrived = (state='false', action) => {
    switch (action.type) {
        case 'SET_TRUE_SONGS_ARE_HERE':
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