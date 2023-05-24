import { combineReducers } from 'redux';

const previewsReducer = (state=[], action) => {
    switch (action.type) {
        case 'PLACE_SONGS':
            return action.payload;
        default:
            return state;
    }
}

const albumInfoReducer = (state=[], action) => {
    switch (action.type) {
        case 'PLACE_ALBUM_DATA':
            return action.payload;
        default:
            return state;
    }
}

export default combineReducers({
    previewsReducer,
    albumInfoReducer
});