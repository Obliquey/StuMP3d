import axios from 'axios';
import { createLogger } from 'redux-logger';
import { put, takeLatest } from 'redux-saga/effects';

// this function needs to activate the spotify API router, then manipulate the songs into their correct reducers, i.e. the 'correct' song, the 'other options', and then the rest of the info for the recap page.
function* callSpotify(action) {
    try{
        const items = yield axios({ method: 'GET', url: `/api/spotify/${action.payload}
        `})
        console.log("Here's our array of stuuuuuf:", items.data);
    }catch {

    }
}

function* sagaCallSpotify() {
    yield takeLatest('CALL_SPOTIFY', callSpotify)
}

export default sagaCallSpotify;