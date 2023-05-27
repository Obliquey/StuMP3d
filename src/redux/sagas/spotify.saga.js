import axios from 'axios';
import { createLogger } from 'redux-logger';
import { put, takeLatest } from 'redux-saga/effects';

// this function needs to activate the spotify API router, then manipulate the songs into their correct reducers, i.e. the 'correct' song, the 'other options', and then the rest of the info for the recap page.
function* callSpotify(action) {
    try{
        const items = yield axios({ method: 'GET', url: `/api/spotify/getArtist?artist=${action.payload}
        `})
        yield put({
            type: 'PLACE_SONGS',
            payload: items.data[1]
        })
        yield put({
            type: 'PLACE_ALBUM_DATA',
            payload: items.data[0]
        })
        yield put({
            type: 'SET_SONGS_ARRIVED',
            payload: 'true'
        })
    }catch {
        console.log("Something went wrong in our Spotify Saga");
    }
}

function* postSong(action) {
    try {
        const res = yield axios({
            method: 'POST',
            url: 'api/guess/setSong',
            data: action.payload
        })
    } catch (error) {
        console.log("Error in postSong saga", error);
    }
}

function* sagaCallSpotify() {
    yield takeLatest('CALL_SPOTIFY', callSpotify)
    yield takeLatest('POST_SONG', postSong)
}

export default sagaCallSpotify;