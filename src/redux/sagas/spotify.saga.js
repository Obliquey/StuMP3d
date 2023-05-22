import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// this function needs to activate the spotify API router, then manipulate the songs into their correct reducers, i.e. the 'correct' song, the 'other options', and then the rest of the info for the recap page.
function* callSpotify(action) {
    console.log('Did we get our artist?:', action.payload);
    try{
        const songs = yield axios({ method: 'GET', url: `/api/spotify/${action.payload}`})
    }catch {

    }
}

function* sagaCallSpotify() {
    yield takeLatest('CALL_SPOTIFY', callSpotify)
}

export default sagaCallSpotify;